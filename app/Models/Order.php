<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'id',
        'user_id',
        'nama_pemesan',
        'whatsapp_pemesan',
        'email_pemesan',
        'organisasi_pemesan',
        'total_belanja',
        'biaya_ongkir',
        'grand_total',
        'status',
        'alamat_pengiriman',
        'kurir_pengiriman',
        'bukti_transfer',
    ];

    public function items()
    {
        return $this->hasMany(OrderItem::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Cancel orders that have been waiting for payment for more than 5 minutes.
     * Restores stock and sends email/WA notifications.
     */
    public static function cancelExpiredOrders()
    {
        $expiredTime = now()->subMinutes(5);

        // Find all orders that are waiting for payment and created more than 5 minutes ago
        $expiredOrders = self::with('items')->where('status', 'menunggu_bayar')
            ->where('created_at', '<=', $expiredTime)
            ->get();

        foreach ($expiredOrders as $order) {
            \Illuminate\Support\Facades\DB::transaction(function () use ($order) {
                // Update order status to 'batal'
                $order->update(['status' => 'batal']);

                // Restore stock for each item
                foreach ($order->items as $item) {
                    Product::where('id', $item->product_id)->increment('stok', $item->qty);
                }
            });

            // Send email status update
            try {
                if ($order->email_pemesan) {
                    \Illuminate\Support\Facades\Mail::to($order->email_pemesan)->send(new \App\Mail\OrderStatusUpdatedMail($order));
                }
            } catch (\Exception $e) {
                \Illuminate\Support\Facades\Log::error('Gagal mengirim email status update order (batal otomatis): ' . $e->getMessage());
            }

            // Send WhatsApp status update
            try {
                if ($order->whatsapp_pemesan) {
                    $whatsappService = app(\App\Services\WhatsAppService::class);
                    $statusUrl = url("/order/{$order->id}");
                    
                    $message = "Halo *{$order->nama_pemesan}*,\n\n"
                        . "Mohon maaf, pesanan Anda *#{$order->id}* telah dibatalkan secara otomatis karena kami tidak menerima konfirmasi pembayaran dalam waktu 5 menit.\n\n"
                        . "Status Terbaru: *Dibatalkan*\n\n"
                        . "Jika Anda masih berminat dengan produk kami, silakan lakukan pemesanan ulang.\n\n"
                        . "Terima kasih,\n"
                        . "*Ourpeers Konveksi*";

                    $whatsappService->send($order->whatsapp_pemesan, $message);
                }
            } catch (\Exception $e) {
                \Illuminate\Support\Facades\Log::error('Gagal mengirim WhatsApp status update (batal otomatis): ' . $e->getMessage());
            }
        }
    }}
