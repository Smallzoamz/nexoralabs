export async function sendTelegramNotification(message: string) {
    const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN
    const CHAT_ID = process.env.TELEGRAM_CHAT_ID

    if (!BOT_TOKEN || !CHAT_ID) {
        console.warn('⚠️ Telegram credentials not configured. Skipping notification.')
        return false
    }

    try {
        const response = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                chat_id: CHAT_ID,
                text: message,
                parse_mode: 'HTML',
            }),
        })

        if (!response.ok) {
            console.error('Failed to send Telegram notification:', await response.text())
            return false
        }

        return true
    } catch (error) {
        console.error('Error sending Telegram notification:', error)
        return false
    }
}
