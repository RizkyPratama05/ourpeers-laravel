<?php

namespace App\Mail;

use App\Models\Order;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class OrderStatusUpdatedMail extends Mailable
{
    use Queueable, SerializesModels;

    public $order;
    public $statusLabel;
    public $statusDescription;

    /**
     * Create a new message instance.
     */
    public function __construct(Order $order)
    {
        $this->order = $order->load('items.product');

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

        $this->statusLabel = $labels[$order->status] ?? $order->status;
        $this->statusDescription = $descriptions[$order->status] ?? 'Status pesanan Anda telah diperbarui.';
    }

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        return new Envelope(
            subject: '[Ourpeers Konveksi] Status Pesanan #' . $this->order->id . ' Diperbarui: ' . $this->statusLabel,
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        return new Content(
            view: 'emails.order_status_updated',
        );
    }

    /**
     * Get the attachments for the message.
     *
     * @return array<int, \Illuminate\Mail\Mailables\Attachment>
     */
    public function attachments(): array
    {
        return [];
    }
}
