import { Resend } from "resend";
import { clientConfig } from "@/client.config";

function getResend(): Resend {
  const key = process.env.RESEND_API_KEY;
  if (!key) throw new Error("RESEND_API_KEY is not set");
  return new Resend(key);
}

interface BookingConfirmationParams {
  bookingId: string;
  customerName: string;
  customerEmail: string;
  serviceName: string;
  startsAt: string; // ISO UTC
}

function formatDateTime(iso: string): string {
  return new Date(iso).toLocaleString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    timeZone: clientConfig.business.timezone,
  });
}

export async function sendBookingConfirmation(
  params: BookingConfirmationParams
): Promise<void> {
  if (!process.env.RESEND_API_KEY) {
    console.warn("RESEND_API_KEY not set — skipping confirmation email");
    return;
  }

  const {
    customerName,
    customerEmail,
    serviceName,
    startsAt,
  } = params;

  const {
    name: salonName,
    address,
    phone,
    email: salonEmail,
  } = clientConfig.business;

  const dateTimeStr = formatDateTime(startsAt);

  const subject = `Your appointment is confirmed — ${dateTimeStr}`;

  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${subject}</title>
</head>
<body style="margin:0;padding:0;background:#f9f8f6;font-family:system-ui,-apple-system,sans-serif;color:#1F2937;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f9f8f6;padding:32px 16px;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;background:#ffffff;border-radius:16px;overflow:hidden;border:1px solid #E5E7EB;">
          <!-- Header -->
          <tr>
            <td style="background:#D97757;padding:24px 32px;">
              <p style="margin:0;font-size:22px;font-weight:700;color:#ffffff;">${salonName}</p>
            </td>
          </tr>
          <!-- Body -->
          <tr>
            <td style="padding:32px;">
              <h1 style="margin:0 0 8px;font-size:20px;font-weight:700;color:#1F2937;">
                You&apos;re confirmed, ${customerName}!
              </h1>
              <p style="margin:0 0 24px;color:#6B7280;font-size:15px;">
                We can&apos;t wait to see you. Here are your appointment details.
              </p>

              <!-- Details card -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background:#F7F5F2;border-radius:12px;margin-bottom:24px;">
                <tr>
                  <td style="padding:20px 24px;">
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="padding:6px 0;color:#6B7280;font-size:13px;width:110px;">Service</td>
                        <td style="padding:6px 0;font-weight:600;font-size:14px;color:#1F2937;">${serviceName}</td>
                      </tr>
                      <tr>
                        <td style="padding:6px 0;color:#6B7280;font-size:13px;">Date &amp; Time</td>
                        <td style="padding:6px 0;font-weight:600;font-size:14px;color:#1F2937;">${dateTimeStr}</td>
                      </tr>
                      <tr>
                        <td style="padding:6px 0;color:#6B7280;font-size:13px;">Location</td>
                        <td style="padding:6px 0;font-weight:600;font-size:14px;color:#1F2937;">${address}</td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <p style="margin:0 0 16px;color:#6B7280;font-size:14px;line-height:1.6;">
                <strong style="color:#1F2937;">Cancellation policy:</strong> Please give us at least
                24 hours notice if you need to cancel or reschedule. Late cancellations may result
                in forfeiture of your deposit.
              </p>

              <p style="margin:0 0 24px;color:#6B7280;font-size:14px;line-height:1.6;">
                Questions? Reply to this email or reach us at
                <a href="tel:${phone.replace(/\D/g, "")}" style="color:#D97757;">${phone}</a> or
                <a href="mailto:${salonEmail}" style="color:#D97757;">${salonEmail}</a>.
              </p>

              <p style="margin:0;color:#1F2937;font-size:15px;font-weight:600;">
                See you soon!<br />
                <span style="font-weight:400;color:#6B7280;">— The ${salonName} team</span>
              </p>
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="padding:16px 32px;border-top:1px solid #E5E7EB;">
              <p style="margin:0;font-size:12px;color:#9CA3AF;text-align:center;">
                ${salonName} · ${address}
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`.trim();

  await getResend().emails.send({
    from: `${salonName} <noreply@${process.env.RESEND_SENDING_DOMAIN ?? "resend.dev"}>`,
    to: customerEmail,
    subject,
    html,
  });
}

// ─── Cancellation email ────────────────────────────────────────────────────

interface CancellationParams {
  customerName: string;
  customerEmail: string;
  serviceName: string;
  startsAt: string;
}

export async function sendBookingCancellation(
  params: CancellationParams
): Promise<void> {
  if (!process.env.RESEND_API_KEY) {
    console.warn("RESEND_API_KEY not set — skipping cancellation email");
    return;
  }

  const { customerName, customerEmail, serviceName, startsAt } = params;
  const { name: salonName, phone, email: salonEmail } = clientConfig.business;
  const dateTimeStr = formatDateTime(startsAt);

  await getResend().emails.send({
    from: `${salonName} <noreply@${process.env.RESEND_SENDING_DOMAIN ?? "resend.dev"}>`,
    to: customerEmail,
    subject: "Your appointment has been cancelled",
    html: `
<html><body style="font-family:system-ui,sans-serif;color:#1F2937;padding:32px;">
  <h2>Hi ${customerName},</h2>
  <p>Your <strong>${serviceName}</strong> appointment on <strong>${dateTimeStr}</strong> has been cancelled.</p>
  <p>If a deposit was paid, a refund will be processed within 5–10 business days.</p>
  <p>To rebook, visit our website or contact us at <a href="tel:${phone.replace(/\D/g, "")}">${phone}</a> or <a href="mailto:${salonEmail}">${salonEmail}</a>.</p>
  <p>— The ${salonName} team</p>
</body></html>
    `.trim(),
  });
}
