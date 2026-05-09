<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\Product;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        return Inertia::render('Dashboard', [
            'stats' => [
                'total_products' => Product::count(),
                'total_orders' => Order::count(),
                'total_revenue' => Order::where('status', 'selesai')->sum('grand_total'),
                'pending_orders' => Order::whereIn('status', ['menunggu_bayar', 'diproses'])->count(),
            ]
        ]);
    }
}
