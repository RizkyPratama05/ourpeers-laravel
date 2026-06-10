<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
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
            ]);
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
