<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Order;
use Illuminate\Http\Request;
use Inertia\Inertia;

class OrderController extends Controller
{
    public function index()
    {
        return Inertia::render('Admin/Orders/Index', [
            'orders' => Order::with('items.product')->latest()->get(),
        ]);
    }

    public function update(Request $request, $id)
    {
        $order = Order::findOrFail($id);
        $order->update(['status' => $request->status]);

        return redirect()->route('admin.orders.index')->with('success', 'Status pesanan berhasil diperbarui.');
    }
}
