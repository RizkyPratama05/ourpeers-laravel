<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Konfirmasi Pesanan</title>
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
            border: 1px border #e2e8f0;
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
        .order-box {
            background-color: #f8fafc;
            border: 1px solid #e2e8f0;
            border-radius: 12px;
            padding: 20px;
            margin-bottom: 30px;
        }
        .order-title {
            font-size: 12px;
            font-weight: 800;
            color: #94a3b8;
            text-transform: uppercase;
            letter-spacing: 0.1em;
            margin-bottom: 8px;
        }
        .order-id {
            font-size: 22px;
            font-weight: 800;
            color: #84cc16;
            margin: 0 0 15px 0;
        }
        .detail-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
        }
        .detail-table th {
            text-align: left;
            font-size: 12px;
            font-weight: 800;
            color: #94a3b8;
            text-transform: uppercase;
            padding-bottom: 10px;
            border-bottom: 1px solid #e2e8f0;
        }
        .detail-table td {
            padding: 15px 0;
            border-bottom: 1px solid #f1f5f9;
            font-size: 14px;
        }
        .custom-badge {
            background-color: #f1f5f9;
            padding: 3px 8px;
            border-radius: 4px;
            font-size: 11px;
            font-weight: bold;
            color: #475569;
            margin-right: 5px;
            display: inline-block;
        }
        .price-row {
            font-weight: bold;
            color: #0f172a;
        }
        .bank-details {
            background-color: #f0fdf4;
            border: 1px dashed #bbf7d0;
            border-radius: 12px;
            padding: 25px;
            margin-bottom: 30px;
        }
        .bank-title {
            font-size: 14px;
            font-weight: 800;
            color: #166534;
            margin: 0 0 10px 0;
        }
        .bank-account {
            font-family: monospace;
            font-size: 18px;
            font-weight: bold;
            color: #0f172a;
            margin: 5px 0;
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
            <p>Pesanan Anda Telah Dibuat</p>
        </div>
        <div class="content">
            <div class="welcome">Halo {{ $order->nama_pemesan }},</div>
            <p>Terima kasih telah memesan di Ourpeers Konveksi. Pesanan Anda telah terdaftar dalam sistem kami dan siap diproses setelah pembayaran diselesaikan.</p>
            
            <div class="order-box">
                <div class="order-title">Nomor Pesanan Anda</div>
                <div class="order-id">#{{ $order->id }}</div>
                
                <table class="detail-table">
                    <thead>
                        <tr>
                            <th>Detail Produk</th>
                            <th style="text-align: right;">Subtotal</th>
                        </tr>
                    </thead>
                    <tbody>
                        @foreach($order->items as $item)
                            <tr>
                                <td>
                                    <strong>{{ $item->product->nama_produk }}</strong><br>
                                    <span style="font-size: 12px; color: #64748b;">Jumlah: {{ $item->qty }} pcs @ Rp {{ number_format($item->harga_satuan, 0, ',', '.') }}</span>
                                    
                                    @if($item->customization)
                                        <div style="margin-top: 10px;">
                                            <span class="custom-badge">Bahan: {{ $item->customization['bahan'] ?? '-' }}</span>
                                            <span class="custom-badge">Warna: {{ $item->customization['warna'] ?? '-' }}</span>
                                            @if(isset($item->customization['ukuran']))
                                                <div style="margin-top: 5px; font-size: 11px; color: #64748b;">
                                                    Ukuran:
                                                    @foreach($item->customization['ukuran'] as $size => $qty)
                                                        @if($qty > 0)
                                                            {{ $size }}({{ $qty }}) 
                                                        @endif
                                                    @endforeach
                                                </div>
                                            @endif
                                            @if(isset($item->customization['desain']['dada_kiri']['path']) && $item->customization['desain']['dada_kiri']['path'])
                                                <div style="margin-top: 5px; font-size: 11px; color: #166534;">
                                                    ✓ Desain Depan Terunggah ({{ $item->customization['desain']['dada_kiri']['size'] ?? 'Standar' }})
                                                </div>
                                            @endif
                                            @if(isset($item->customization['desain']['belakang']['path']) && $item->customization['desain']['belakang']['path'])
                                                <div style="margin-top: 2px; font-size: 11px; color: #166534;">
                                                    ✓ Desain Belakang Terunggah ({{ $item->customization['desain']['belakang']['size'] ?? 'Standar' }})
                                                </div>
                                            @endif
                                        </div>
                                    @endif
                                </td>
                                <td style="text-align: right;" class="price-row">
                                    Rp {{ number_format($item->subtotal, 0, ',', '.') }}
                                </td>
                            </tr>
                        @endforeach
                        <tr>
                            <td style="font-weight: bold; border-top: 2px solid #e2e8f0; padding-top: 15px;">Biaya Ongkir (Flat)</td>
                            <td style="text-align: right; font-weight: bold; border-top: 2px solid #e2e8f0; padding-top: 15px;">Rp {{ number_format($order->biaya_ongkir, 0, ',', '.') }}</td>
                        </tr>
                        <tr>
                            <td style="font-size: 16px; font-weight: 800; border-top: 2px solid #0f172a; padding-top: 15px;">Grand Total</td>
                            <td style="text-align: right; font-size: 16px; font-weight: 800; color: #84cc16; border-top: 2px solid #0f172a; padding-top: 15px;">Rp {{ number_format($order->grand_total, 0, ',', '.') }}</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <div class="bank-details">
                <div class="bank-title">Instruksi Pembayaran Transfer Bank:</div>
                <p style="margin: 0 0 15px 0; font-size: 13px; color: #1e293b;">Silakan lakukan transfer sebesar nominal <strong>Rp {{ number_format($order->grand_total, 0, ',', '.') }}</strong> ke salah satu rekening bank berikut:</p>
                
                <div style="margin-bottom: 15px; border-bottom: 1px dashed #bbf7d0; padding-bottom: 10px;">
                    <div style="font-weight: bold; font-size: 12px; color: #166534;">BANK BCA</div>
                    <div class="bank-account">123-456-7890</div>
                    <div style="font-size: 12px; color: #475569;">a.n. Ourpeers Konveksi</div>
                </div>

                <div>
                    <div style="font-weight: bold; font-size: 12px; color: #166534;">BANK MANDIRI</div>
                    <div class="bank-account">098-765-4321</div>
                    <div style="font-size: 12px; color: #475569;">a.n. Ourpeers Konveksi</div>
                </div>
                
                <p style="margin: 15px 0 0 0; font-size: 12px; color: #166534; font-style: italic;">*Setelah transfer, harap segera unggah bukti pembayaran melalui tombol di bawah.</p>
            </div>

            <div style="text-align: center; margin-top: 40px; margin-bottom: 20px;">
                <a href="{{ url('/order/success/' . $order->id) }}" class="button">Unggah Bukti Transfer / Cek Status</a>
            </div>
        </div>
        <div class="footer">
            <p>&copy; {{ date('Y') }} Ourpeers Konveksi. All rights reserved.</p>
            <p>Jika Anda memiliki pertanyaan, silakan hubungi tim CS kami via WhatsApp.</p>
        </div>
    </div>
</body>
</html>
