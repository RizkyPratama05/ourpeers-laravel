<?php

namespace Tests\Feature;

use App\Mail\OrderCreatedMail;
use App\Mail\OrderStatusUpdatedMail;
use App\Models\Category;
use App\Models\Order;
use App\Models\Product;
use App\Models\User;
use App\Services\WhatsAppService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class OrderEmailTest extends TestCase
{
    use RefreshDatabase;

    public function test_checkout_sends_order_created_email_and_whatsapp()
    {
        Mail::fake();
        
        $this->mock(WhatsAppService::class, function ($mock) {
            $mock->shouldReceive('send')
                ->once()
                ->with('081234567890', \Mockery::on(function ($msg) {
                    return str_contains($msg, 'Terima kasih telah melakukan pemesanan') &&
                           str_contains($msg, 'Bank BCA');
                }))
                ->andReturn(true);
        });

        $category = Category::create(['nama' => 'Kaos', 'slug' => 'kaos']);
        $product = Product::create([
            'nama_produk' => 'Kaos Polos',
            'harga' => 50000,
            'stok' => 10,
            'deskripsi' => 'Kaos polos premium',
            'bahan' => 'Cotton Combed 30s',
            'warna' => 'Hitam',
            'keunggulan' => 'Adem',
            'category_id' => $category->id,
        ]);

        $payload = [
            'alamat' => 'Jl. Merdeka No. 123',
            'kurir' => 'JNE',
            'customer_info' => [
                'nama' => 'Budi Santoso',
                'whatsapp' => '081234567890',
                'email' => 'budi@example.com',
                'organisasi' => 'PT. Sukses Selalu',
            ],
            'items' => [
                [
                    'id' => $product->id,
                    'qty' => 2,
                    'harga' => 50000,
                    'detail' => [
                        'desain_depan_url' => 'designs/front.png',
                        'desain_depan_ukuran' => 'A4',
                        'desain_belakang_url' => 'designs/back.png',
                        'desain_belakang_ukuran' => 'A3',
                    ],
                ]
            ],
        ];

        $response = $this->post(route('checkout.store'), $payload);

        $response->assertRedirect();
        
        $this->assertDatabaseHas('orders', [
            'nama_pemesan' => 'Budi Santoso',
            'email_pemesan' => 'budi@example.com',
            'status' => 'menunggu_bayar',
        ]);

        $this->assertDatabaseHas('order_items', [
            'product_id' => $product->id,
            'qty' => 2,
        ]);

        // Check stock decremented
        $this->assertEquals(8, $product->fresh()->stok);

        Mail::assertSent(OrderCreatedMail::class, function ($mail) {
            return $mail->hasTo('budi@example.com') &&
                   $mail->order->nama_pemesan === 'Budi Santoso';
        });
    }

    public function test_uploading_payment_proof_sends_status_updated_email_and_whatsapp()
    {
        Mail::fake();
        Storage::fake('public');

        $this->mock(WhatsAppService::class, function ($mock) {
            $mock->shouldReceive('send')
                ->once()
                ->with('081234567890', \Mockery::on(function ($msg) {
                    return str_contains($msg, 'sedang diverifikasi oleh admin') &&
                           str_contains($msg, 'Pembayaran Diterima');
                }))
                ->andReturn(true);
        });

        $category = Category::create(['nama' => 'Kaos', 'slug' => 'kaos']);
        $product = Product::create([
            'nama_produk' => 'Kaos Polos',
            'harga' => 50000,
            'stok' => 10,
            'deskripsi' => 'Kaos polos premium',
            'bahan' => 'Cotton Combed 30s',
            'warna' => 'Hitam',
            'category_id' => $category->id,
        ]);

        $order = Order::create([
            'id' => 'INV-TEST123',
            'nama_pemesan' => 'Budi Santoso',
            'whatsapp_pemesan' => '081234567890',
            'email_pemesan' => 'budi@example.com',
            'total_belanja' => 50000,
            'biaya_ongkir' => 15000,
            'grand_total' => 65000,
            'status' => 'menunggu_bayar',
            'alamat_pengiriman' => 'Jl. Merdeka No. 123',
            'kurir_pengiriman' => 'JNE',
        ]);

        $file = UploadedFile::fake()->image('proof.jpg');

        $response = $this->post(route('orders.upload-bukti', ['id' => $order->id]), [
            'bukti_transfer' => $file,
        ]);

        $response->assertRedirect();
        
        $this->assertEquals('sudah_bayar', $order->fresh()->status);
        $this->assertNotNull($order->fresh()->bukti_transfer);

        Mail::assertSent(OrderStatusUpdatedMail::class, function ($mail) {
            return $mail->hasTo('budi@example.com') &&
                   $mail->order->status === 'sudah_bayar';
        });
    }

    public function test_admin_updating_order_status_sends_status_updated_email_and_whatsapp()
    {
        Mail::fake();

        $this->mock(WhatsAppService::class, function ($mock) {
            $mock->shouldReceive('send')
                ->once()
                ->with('081234567890', \Mockery::on(function ($msg) {
                    return str_contains($msg, 'telah diperbarui oleh admin') &&
                           str_contains($msg, 'Sedang Diproses');
                }))
                ->andReturn(true);
        });

        $user = User::factory()->create([
            'email_verified_at' => now(),
        ]);

        $order = Order::create([
            'id' => 'INV-TEST456',
            'nama_pemesan' => 'Budi Santoso',
            'whatsapp_pemesan' => '081234567890',
            'email_pemesan' => 'budi@example.com',
            'total_belanja' => 50000,
            'biaya_ongkir' => 15000,
            'grand_total' => 65000,
            'status' => 'sudah_bayar',
            'alamat_pengiriman' => 'Jl. Merdeka No. 123',
            'kurir_pengiriman' => 'JNE',
        ]);

        $response = $this->actingAs($user)->put(route('admin.orders.update', ['id' => $order->id]), [
            'status' => 'diproses',
        ]);

        $response->assertRedirect();
        
        $this->assertEquals('diproses', $order->fresh()->status);

        Mail::assertSent(OrderStatusUpdatedMail::class, function ($mail) {
            return $mail->hasTo('budi@example.com') &&
                   $mail->order->status === 'diproses';
        });
    }
}
