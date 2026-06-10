<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Order;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Log;
use App\Mail\OrderStatusUpdatedMail;

class OrderController extends Controller
{
    public function index()
    {
        Order::cancelExpiredOrders();
        return Inertia::render('Admin/Orders/Index', [
            'orders' => Order::with('items.product')->latest()->get(),
        ]);
    }

    public function update(Request $request, $id)
    {
        $order = Order::findOrFail($id);
        $oldStatus = $order->status;
        $newStatus = $request->status;

        $order->update(['status' => $newStatus]);

        if ($oldStatus !== $newStatus) {
            try {
                if ($order->email_pemesan) {
                    Mail::to($order->email_pemesan)->send(new OrderStatusUpdatedMail($order));
                }
            } catch (\Exception $e) {
                Log::error('Gagal mengirim email status update order (admin update): ' . $e->getMessage());
            }

            try {
                if ($order->whatsapp_pemesan) {
                    $whatsappService = app(\App\Services\WhatsAppService::class);
                    $statusUrl = url("/order/{$order->id}");
                    
                    $labels = [
                        'menunggu_bayar' => 'Menunggu Pembayaran',
                        'sudah_bayar' => 'Pembayaran Diterima (Menunggu Verifikasi)',
                        'diproses' => 'Sedang Diproses',
                        'siap' => 'Siap Dikirim / Diambil',
                        'selesai' => 'Selesai',
                    ];

                    $descriptions = [
                        'menunggu_bayar' => 'Pesanan Anda telah kami terima. Silakan lakukan pembayaran ke rekening transfer bank yang tertera agar pesanan Anda dapat diproses.',
                        'sudah_bayar' => 'Terima kasih atas pembayaran Anda. Bukti transfer telah kami terima dan sedang diverifikasi oleh admin kami.',
                        'diproses' => 'Pembayaran Anda telah disetujui! Saat ini pesanan Anda sedang masuk ke tahap produksi oleh tim konveksi kami.',
                        'siap' => 'Kabar baik! Pesanan Anda telah selesai diproduksi dan siap dikirim ke alamat Anda atau diambil di workshop kami.',
                        'selesai' => 'Pesanan Anda telah selesai diproses sepenuhnya. Terima kasih telah mempercayakan Ourpeers Konveksi!',
                    ];

                    $statusLabel = $labels[$newStatus] ?? $newStatus;
                    $statusDescription = $descriptions[$newStatus] ?? 'Status pesanan Anda telah diperbarui.';

                    $message = "Halo *{$order->nama_pemesan}*,\n\n"
                        . "Kabar baik! Status pesanan Anda *#{$order->id}* telah diperbarui oleh admin.\n\n"
                        . "Status Terbaru: *{$statusLabel}*\n"
                        . "{$statusDescription}\n\n"
                        . "Anda dapat memantau perkembangan pesanan Anda secara berkala melalui tautan berikut:\n"
                        . "{$statusUrl}\n\n"
                        . "Terima kasih,\n"
                        . "*Ourpeers Konveksi*";

                    $whatsappService->send($order->whatsapp_pemesan, $message);
                }
            } catch (\Exception $e) {
                Log::error('Gagal mengirim WhatsApp status update (admin update): ' . $e->getMessage());
            }
        }

        return redirect()->route('admin.orders.index')->with('success', 'Status pesanan berhasil diperbarui.');
    }
}
