<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Pembaruan Status Pesanan</title>
    <style>
        body {
            font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
            background-color: #f8fafc;
            color: #334155;
            margin: 0;
            padding: 0;
            line-height: 1.6;
        }
        .container {
            max-width: 600px;
            margin: 40px auto;
            background-color: #ffffff;
            border-radius: 16px;
            overflow: hidden;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -2px rgba(0, 0, 0, 0.05);
            border: 1px solid #e2e8f0;
        }
        .header {
            background-color: #0f172a;
            color: #ffffff;
            padding: 30px 40px;
            text-align: center;
        }
        .header h1 {
            margin: 0;
            font-size: 24px;
            font-weight: 800;
            letter-spacing: -0.025em;
        }
        .header p {
            margin: 5px 0 0 0;
            color: #94a3b8;
            font-size: 14px;
        }
        .content {
            padding: 40px;
        }
        .welcome {
            font-size: 16px;
            font-weight: bold;
            margin-bottom: 20px;
            color: #0f172a;
        }
        .status-card {
            background-color: #f8fafc;
            border: 1px solid #e2e8f0;
            border-radius: 12px;
            padding: 25px;
            margin-bottom: 30px;
            text-align: center;
        }
        .status-title {
            font-size: 12px;
            font-weight: 800;
            color: #94a3b8;
            text-transform: uppercase;
            letter-spacing: 0.1em;
            margin-bottom: 8px;
        }
        .status-badge {
            display: inline-block;
            background-color: #0f172a;
            color: #84cc16;
            font-size: 18px;
            font-weight: 800;
            padding: 10px 24px;
            border-radius: 9999px;
            margin-bottom: 15px;
            letter-spacing: 0.05em;
        }
        .status-description {
            font-size: 14px;
            color: #475569;
            margin: 0;
            line-height: 1.6;
        }
        .order-summary {
            border-top: 1px solid #f1f5f9;
            padding-top: 20px;
            margin-top: 20px;
            text-align: left;
        }
        .order-summary-title {
            font-size: 12px;
            font-weight: 800;
            color: #94a3b8;
            text-transform: uppercase;
            letter-spacing: 0.1em;
            margin-bottom: 10px;
        }
        .button {
            display: inline-block;
            background-color: #84cc16;
            color: #0f172a;
            text-decoration: none;
            font-weight: bold;
            padding: 14px 30px;
            border-radius: 8px;
            text-align: center;
            font-size: 14px;
            box-shadow: 0 4px 6px -1px rgba(132, 204, 22, 0.2);
        }
        .footer {
            background-color: #f1f5f9;
            padding: 20px 40px;
            text-align: center;
            font-size: 12px;
            color: #64748b;
            border-top: 1px solid #e2e8f0;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Ourpeers Konveksi</h1>
            <p>Pembaruan Status Pesanan</p>
        </div>
        <div class="content">
            <div class="welcome">Halo {{ $order->nama_pemesan }},</div>
            <p>Kami ingin mengabarkan bahwa status pesanan Anda dengan nomor referensi <strong>#{{ $order->id }}</strong> telah diperbarui.</p>
            
            <div class="status-card">
                <div class="status-title">Status Terbaru Pesanan</div>
                <div class="status-badge">{{ $statusLabel }}</div>
                <p class="status-description">{{ $statusDescription }}</p>
            </div>

            <div class="order-summary">
                <div class="order-summary-title">Ringkasan Pesanan</div>
                <table style="width: 100%; font-size: 14px; border-collapse: collapse;">
                    @foreach($order->items as $item)
                        <tr>
                            <td style="padding: 8px 0; border-bottom: 1px solid #f1f5f9;">
                                <strong>{{ $item->product->nama_produk }}</strong> ({{ $item->qty }} pcs)
                            </td>
                            <td style="padding: 8px 0; border-bottom: 1px solid #f1f5f9; text-align: right; font-weight: bold; color: #0f172a;">
                                Rp {{ number_format($item->subtotal, 0, ',', '.') }}
                            </td>
                        </tr>
                    @endforeach
                    <tr>
                        <td style="padding: 12px 0 4px 0; font-weight: bold;">Grand Total</td>
                        <td style="padding: 12px 0 4px 0; text-align: right; font-weight: bold; color: #84cc16;">Rp {{ number_format($order->grand_total, 0, ',', '.') }}</td>
                    </tr>
                </table>
            </div>

            <div style="text-align: center; margin-top: 40px; margin-bottom: 20px;">
                <a href="{{ url('/order/' . $order->id) }}" class="button">Pantau Posisi Pesanan Anda</a>
            </div>
        </div>
        <div class="footer">
            <p>&copy; {{ date('Y') }} Ourpeers Konveksi. All rights reserved.</p>
            <p>Jika Anda memiliki pertanyaan, silakan hubungi tim CS kami via WhatsApp.</p>
        </div>
    </div>
</body>
</html>
