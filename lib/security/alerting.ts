export type AlertSeverity = 'INFO' | 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export const ALERT_TYPES = {
  NEW_ORDER: 'INFO',
  BLOCKED_PATH: 'HIGH',
  BAD_BOT: 'MEDIUM',
  RATE_LIMIT: 'MEDIUM',
  FAILED_LOGIN: 'HIGH',
  SUSPICIOUS_INPUT: 'HIGH',
  IP_BLACKLISTED: 'CRITICAL',
  HIGH_VOLUME_ORDER: 'INFO',
} as const;

export async function sendTelegramAlert(message: string, severity: AlertSeverity = 'INFO') {
  // We'll require process.env.TELEGRAM_BOT_TOKEN and process.env.TELEGRAM_CHAT_ID
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!token || !chatId) {
    console.warn('Telegram alerts are not configured. Message:', message);
    return;
  }

  const prefix = getSeverityPrefix(severity);
  const text = `${prefix}\n\n${message}\n\n#${severity} #QueenOfLingerie`;

  try {
    await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: chatId,
        text,
        parse_mode: 'HTML',
      }),
    });
  } catch (error) {
    console.error('Failed to send Telegram alert:', error);
  }
}

function getSeverityPrefix(severity: AlertSeverity): string {
  switch (severity) {
    case 'CRITICAL': return '🚨 <b>CRITICAL ALERT</b> 🚨';
    case 'HIGH': return '🛑 <b>HIGH ALERT</b>';
    case 'MEDIUM': return '⚠️ <b>WARNING</b>';
    case 'LOW': return 'ℹ️ <b>NOTICE</b>';
    case 'INFO': return '✅ <b>INFO</b>';
    default: return '🔔 <b>ALERT</b>';
  }
}
