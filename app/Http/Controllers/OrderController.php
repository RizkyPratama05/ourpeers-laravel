<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Log;
use App\Mail\OrderCreatedMail;
use App\Mail\OrderStatusUpdatedMail;
use Inertia\Inertia;

class OrderController extends Controller
{
    public function checkout()
    {
        return Inertia::render('Checkout');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'alamat' => 'required|string',
            'kurir' => 'required|string',
            'items' => 'required|array',
            'customer_info' => 'required|array',
        ]);

        $orderId = 'INV-' . time();
        $totalBelanja = 0;
        $ongkirFlat = 15000;

        foreach ($request->items as $item) {
            $totalBelanja += $item['harga'] * $item['qty'];
        }

        $grandTotal = $totalBelanja + $ongkirFlat;

        DB::transaction(function () use ($request, $orderId, $totalBelanja, $ongkirFlat, $grandTotal) {
            $order = Order::create([
                'id' => $orderId,
                'user_id' => $request->user_id ?? null,
                'nama_pemesan' => $request->customer_info['nama'] ?? null,
                'whatsapp_pemesan' => $request->customer_info['whatsapp'] ?? null,
                'email_pemesan' => $request->customer_info['email'] ?? null,
                'organisasi_pemesan' => $request->customer_info['organisasi'] ?? null,
                'total_belanja' => $totalBelanja,
                'biaya_ongkir' => $ongkirFlat,
                'grand_total' => $grandTotal,
                'status' => 'menunggu_bayar',
                'alamat_pengiriman' => $request->alamat,
                'kurir_pengiriman' => $request->kurir,
            ]);

            foreach ($request->items as $item) {
                OrderItem::create([
                    'order_id' => $orderId,
                    'product_id' => $item['id'],
                    'qty' => $item['qty'],
                    'harga_satuan' => $item['harga'],
                    'subtotal' => $item['harga'] * $item['qty'],
                    'customization' => isset($item['detail']) ? $item['detail'] : null,
                ]);

                // Reduce stock
                Product::where('id', $item['id'])->decrement('stok', $item['qty']);
            }
        });

        try {
            $order = Order::findOrFail($orderId);
            if ($order->email_pemesan) {
                Mail::to($order->email_pemesan)->send(new OrderCreatedMail($order));
            }
        } catch (\Exception $e) {
            Log::error('Gagal mengirim email konfirmasi order: ' . $e->getMessage());
        }

        try {
            $order = Order::findOrFail($orderId);
            if ($order->whatsapp_pemesan) {
                $whatsappService = app(\App\Services\WhatsAppService::class);
                $formattedTotal = number_format($order->grand_total, 0, ',', '.');
                $statusUrl = url("/order/{$order->id}");
                
                $message = "Halo *{$order->nama_pemesan}*,\n\n"
                    . "Terima kasih telah melakukan pemesanan di *Ourpeers Konveksi*.\n\n"
                    . "Detail Pesanan Anda:\n"
                    . "- Kode Pesanan: *#{$order->id}*\n"
                    . "- Total Tagihan: *Rp {$formattedTotal}*\n"
                    . "- Metode Pembayaran: Transfer Bank Manual\n\n"
                    . "Silakan lakukan transfer ke salah satu rekening berikut:\n"
                    . "1. *Bank BCA*: 123-456-7890 a.n. Ourpeers Konveksi\n"
                    . "2. *Bank Mandiri*: 098-765-4321 a.n. Ourpeers Konveksi\n\n"
                    . "Setelah melakukan transfer, silakan unggah bukti transfer Anda dengan membuka tautan berikut:\n"
                    . "{$statusUrl}\n\n"
                    . "Terima kasih,\n"
                    . "*Ourpeers Konveksi*";

                $whatsappService->send($order->whatsapp_pemesan, $message);
            }
        } catch (\Exception $e) {
            Log::error('Gagal mengirim WhatsApp konfirmasi order: ' . $e->getMessage());
        }

        return redirect()->route('orders.success', ['id' => $orderId]);
    }

    public function show($id)
    {
        return Inertia::render('CheckStatus', [
            'order' => Order::with('items.product')->findOrFail($id),
        ]);
    }

    public function checkStatus()
    {
        return Inertia::render('CheckStatus');
    }

    public function uploadBukti(Request $request, $id)
    {
        $request->validate([
            'bukti_transfer' => 'required|image|max:2048',
        ]);

        $order = Order::findOrFail($id);

        if ($request->hasFile('bukti_transfer')) {
            // Delete old proof of transfer if it exists
            if ($order->bukti_transfer) {
                Storage::disk('public')->delete($order->bukti_transfer);
            }

            $path = $request->file('bukti_transfer')->store('bukti_transfer', 'public');
            $order->update([
                'bukti_transfer' => $path,
                'status' => 'sudah_bayar',
            ]);
        }

        try {
            if ($order->email_pemesan) {
                Mail::to($order->email_pemesan)->send(new OrderStatusUpdatedMail($order));
            }
        } catch (\Exception $e) {
            Log::error('Gagal mengirim email status update order (upload bukti): ' . $e->getMessage());
        }

        try {
            if ($order->whatsapp_pemesan) {
                $whatsappService = app(\App\Services\WhatsAppService::class);
                $statusUrl = url("/order/{$order->id}");
                
                $message = "Halo *{$order->nama_pemesan}*,\n\n"
                    . "Bukti pembayaran untuk pesanan *#{$order->id}* telah kami terima dan saat ini sedang diverifikasi oleh admin.\n\n"
                    . "Status Pesanan Anda: *Pembayaran Diterima (Menunggu Verifikasi)*\n\n"
                    . "Anda dapat memantau perkembangan pesanan Anda secara berkala melalui tautan berikut:\n"
                    . "{$statusUrl}\n\n"
                    . "Terima kasih,\n"
                    . "*Ourpeers Konveksi*";

                $whatsappService->send($order->whatsapp_pemesan, $message);
            }
        } catch (\Exception $e) {
            Log::error('Gagal mengirim WhatsApp status update (upload bukti): ' . $e->getMessage());
        }

        return redirect()->back()->with('success', 'Bukti transfer berhasil diunggah.');
    }

    public function uploadDesign(Request $request)
    {
        $request->validate([
            'design_file' => 'required|image|max:5120',
        ]);

        if ($request->hasFile('design_file')) {
            $path = $request->file('design_file')->store('designs', 'public');
            return response()->json([
                'success' => true,
                'path' => $path,
                'url' => asset('storage/' . $path)
            ]);
        }

        return response()->json([
            'success' => false,
            'message' => 'Gagal mengunggah file'
        ], 400);
    }
}
