<?php

namespace App\Console\Commands;

use App\Models\Order;
use Illuminate\Console\Command;

class CancelExpiredOrders extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'orders:cancel-expired';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Cancel orders that have not been paid in 5 minutes';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('Checking for expired orders...');
        Order::cancelExpiredOrders();
        $this->info('Expired orders cancellation check completed.');
    }
}
