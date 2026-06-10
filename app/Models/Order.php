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
    }}
