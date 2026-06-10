<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class WhatsAppService
{
    /**
     * Send WhatsApp message.
     *
     * @param string $target Number of the recipient (e.g. 081234567890)
     * @param string $message Message content
     * @return bool
     */
    public function send(string $target, string $message): bool
    {
        if (empty($target)) {
            Log::warning('WhatsApp target number is empty, message not sent.');
            return false;
        }

        // Normalise target to Indonesian international format if needed or keep it as user entered
        // Fonnte accepts local numbers (like 0812...) and international numbers (like 62812...)
        $provider = env('WHATSAPP_PROVIDER', 'log');

        if ($provider === 'fonnte') {
            $token = env('FONNTE_TOKEN');
            
            try {
                $response = Http::withHeaders([
                    'Authorization' => $token,
                ])->withoutVerifying()->post('https://api.fonnte.com/send', [
                    'target' => $target,
                    'message' => $message,
                ]);

                if ($response->successful()) {
                    Log::info("WhatsApp message sent successfully via Fonnte to: {$target}");
                    return true;
                } else {
                    Log::error("Fonnte API error: " . $response->body());
                    return false;
                }
            } catch (\Exception $e) {
                Log::error("Failed to send WhatsApp message via Fonnte: " . $e->getMessage());
                return false;
            }
        }

        // Default: Log driver
        Log::info("=== WHATSAPP SEND SIMULATION ===");
        Log::info("To: {$target}");
        Log::info("Message:\n{$message}");
        Log::info("=================================");
        return true;
    }
}
