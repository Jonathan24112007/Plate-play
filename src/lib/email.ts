import { Resend } from "resend";

// Only instantiate Resend if the API key is present
const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

const FROM = process.env.EMAIL_FROM ?? "PlatePlay <hello@plateplay.com>";
const SITE_URL = process.env.NEXTAUTH_URL ?? "http://localhost:3000";

export type BookingEmailData = {
  customerName: string;
  customerEmail: string;
  publicReference: string;
  packageName: string;
  kitchenName: string;
  slotDate?: string;
  slotTime?: string;
  groupSize: number;
  estimatedTotal: string;
};

// ─── Internal helper ────────────────────────────────────────────────────────

async function send(to: string, subject: string, html: string) {
  if (!resend) {
    console.warn(
      `[Email Mock] RESEND_API_KEY not configured. To: "${to}", Subject: "${subject}"`
    );
    return;
  }
  try {
    await resend.emails.send({ from: FROM, to, subject, html });
  } catch (err) {
    console.error("[Email] Failed to send email via Resend:", err);
  }
}

// ─── Templates ──────────────────────────────────────────────────────────────

function baseTemplate(content: string) {
  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><title>PlatePlay</title></head>
<body style="font-family:'Plus Jakarta Sans',-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;background:#FFF7F0;margin:0;padding:0;">
  <div style="max-width:560px;margin:32px auto;background:#fff;border-radius:24px;overflow:hidden;border:1px solid #ffe0cc;box-shadow:0 8px 30px rgba(140,21,56,0.06);">
    <div style="background:#8C1538;padding:28px 32px;">
      <p style="color:#FF6B3D;font-size:11px;font-weight:700;letter-spacing:2px;margin:0 0 4px;font-family:monospace;">PLATEPLAY · COOK · CREATE · CONNECT</p>
      <p style="color:#fff;font-size:22px;font-weight:800;margin:0;">Experiential Cooking Studios</p>
    </div>
    <div style="padding:32px;">
      ${content}
    </div>
    <div style="background:#FFF7F0;padding:20px 32px;border-top:1px solid #ffe0cc;text-align:center;">
      <p style="font-size:11px;color:#888;margin:0 0 6px;">PlatePlay Private Kitchens · Pre-Launch Beta</p>
      <p style="font-size:11px;color:#aaa;margin:0;">Bangalore, India · Questions? Reply to this email or visit <a href="${SITE_URL}" style="color:#8C1538;">plateplay.com</a></p>
    </div>
  </div>
</body>
</html>`;
}

// ─── Authentication Emails ──────────────────────────────────────────────────

export async function sendVerificationEmail(email: string, token: string) {
  const verifyLink = `${SITE_URL}/api/auth/verify?token=${token}`;
  const html = baseTemplate(`
    <h2 style="color:#8C1538;margin:0 0 10px;font-size:22px;">Verify Your PlatePlay Account</h2>
    <p style="color:#444;font-size:14px;line-height:1.6;margin:0 0 20px;">Welcome to PlatePlay! Please confirm your email address to activate priority booking requests and access your custom dish studio creations.</p>
    <div style="text-align:center;margin:30px 0;">
      <a href="${verifyLink}" style="background:#8C1538;color:#FFF7F0;padding:14px 28px;border-radius:999px;font-weight:700;text-decoration:none;font-size:14px;display:inline-block;box-shadow:0 4px 14px rgba(140,21,56,0.25);">Verify My Email Address</a>
    </div>
    <p style="color:#777;font-size:12px;line-height:1.5;">Or copy and paste this URL into your browser:<br><a href="${verifyLink}" style="color:#FF6B3D;word-break:break-all;">${verifyLink}</a></p>
  `);
  await send(email, "Verify Your PlatePlay Account", html);
}

export async function sendPasswordResetEmail(email: string, token: string) {
  const resetLink = `${SITE_URL}/reset-password?token=${token}`;
  const html = baseTemplate(`
    <h2 style="color:#8C1538;margin:0 0 10px;font-size:22px;">Reset Your Password</h2>
    <p style="color:#444;font-size:14px;line-height:1.6;margin:0 0 20px;">We received a request to reset your password for your PlatePlay account. If you initiated this request, click below to set a new password:</p>
    <div style="text-align:center;margin:30px 0;">
      <a href="${resetLink}" style="background:#FF6B3D;color:#fff;padding:14px 28px;border-radius:999px;font-weight:700;text-decoration:none;font-size:14px;display:inline-block;box-shadow:0 4px 14px rgba(255,107,61,0.25);">Reset Password</a>
    </div>
    <p style="color:#777;font-size:12px;line-height:1.5;">This link will expire in 60 minutes. If you did not request a password reset, you can safely ignore this email.</p>
  `);
  await send(email, "Reset Your PlatePlay Password", html);
}

// ─── Booking Lifecycle Emails ───────────────────────────────────────────────

export async function sendBookingRequestReceived(data: BookingEmailData) {
  const html = baseTemplate(`
    <h2 style="color:#8C1538;margin:0 0 8px;">We've received your request!</h2>
    <p style="color:#555;margin:0 0 20px;">Hi ${data.customerName}, thanks for submitting a booking request with PlatePlay. Here's your reference code:</p>
    <div style="background:#FFF7F0;border:1px solid #ffcfc0;border-radius:16px;padding:20px;margin-bottom:24px;text-align:center;">
      <p style="font-size:11px;color:#999;margin:0 0 4px;letter-spacing:2px;font-family:monospace;">PUBLIC REFERENCE</p>
      <p style="font-size:28px;font-weight:900;color:#8C1538;letter-spacing:3px;margin:0;font-family:monospace;">${data.publicReference}</p>
    </div>
    <table style="width:100%;font-size:14px;color:#333;border-collapse:collapse;margin-bottom:20px;">
      <tr><td style="padding:8px 0;color:#888;border-bottom:1px solid #f2e6dc;">Experience Package</td><td style="font-weight:700;border-bottom:1px solid #f2e6dc;">${data.packageName}</td></tr>
      <tr><td style="padding:8px 0;color:#888;border-bottom:1px solid #f2e6dc;">Private Kitchen</td><td style="font-weight:700;border-bottom:1px solid #f2e6dc;">${data.kitchenName}</td></tr>
      ${data.slotDate ? `<tr><td style="padding:8px 0;color:#888;border-bottom:1px solid #f2e6dc;">Requested Date</td><td style="font-weight:700;border-bottom:1px solid #f2e6dc;">${data.slotDate}</td></tr>` : ""}
      ${data.slotTime ? `<tr><td style="padding:8px 0;color:#888;border-bottom:1px solid #f2e6dc;">Session Window</td><td style="font-weight:700;border-bottom:1px solid #f2e6dc;">${data.slotTime}</td></tr>` : ""}
      <tr><td style="padding:8px 0;color:#888;border-bottom:1px solid #f2e6dc;">Group Allocation</td><td style="font-weight:700;border-bottom:1px solid #f2e6dc;">${data.groupSize} Guests</td></tr>
      <tr><td style="padding:8px 0;color:#888;">Estimated Introductory Total</td><td style="font-weight:800;color:#8C1538;font-size:16px;">${data.estimatedTotal}</td></tr>
    </table>
    <p style="color:#666;font-size:13px;line-height:1.5;">Our operations team reviews all pilot slots to guarantee fresh ingredient preparation and chef guidance.</p>
    <p style="color:#666;font-size:13px;">Track your request live anytime at <a href="${SITE_URL}/booking-status" style="color:#8C1538;font-weight:bold;">plateplay.com/booking-status</a>.</p>
  `);
  await send(data.customerEmail, `Your PlatePlay Request — ${data.publicReference}`, html);
}

export async function sendBookingApproved(data: BookingEmailData) {
  const html = baseTemplate(`
    <h2 style="color:#8C1538;margin:0 0 8px;">Your Session is Approved! 🎉</h2>
    <p style="color:#555;margin:0 0 20px;">Hi ${data.customerName}, your private kitchen session at PlatePlay has been approved.</p>
    <div style="background:#FFF7F0;border:2px solid #8C1538;border-radius:16px;padding:20px;margin-bottom:24px;text-align:center;">
      <p style="font-size:11px;color:#999;margin:0 0 4px;letter-spacing:2px;font-family:monospace;">CONFIRMED REFERENCE</p>
      <p style="font-size:28px;font-weight:900;color:#8C1538;letter-spacing:3px;margin:0;font-family:monospace;">${data.publicReference}</p>
    </div>
    <div style="background:#fdf4eb;padding:16px;border-radius:12px;margin-bottom:20px;">
      <p style="font-size:13px;color:#444;margin:0 0 8px;"><strong>What to expect:</strong></p>
      <ul style="font-size:13px;color:#555;margin:0;padding-left:20px;line-height:1.6;">
        <li>Your private kitchen will be sanitized and prepped with fresh ingredients.</li>
        <li>Your culinary host will welcome your group and conduct a quick safety brief.</li>
        <li>Aprons, equipment, induction stations, and stone ovens are ready for you.</li>
      </ul>
    </div>
    <p style="color:#555;font-size:13px;">View full reservation details at <a href="${SITE_URL}/dashboard" style="color:#8C1538;font-weight:bold;">your PlatePlay Dashboard</a>.</p>
  `);
  await send(data.customerEmail, `Session Approved — ${data.publicReference} | PlatePlay`, html);
}

export async function sendBookingDeclined(data: BookingEmailData) {
  const html = baseTemplate(`
    <h2 style="color:#8C1538;margin:0 0 8px;">Update on your PlatePlay request</h2>
    <p style="color:#555;margin:0 0 16px;">Hi ${data.customerName}, unfortunately we are unable to accommodate your session request for <strong>${data.publicReference}</strong> on the requested date.</p>
    <p style="color:#555;font-size:13px;line-height:1.6;">This may be due to venue maintenance, kitchen capacity, or specialty ingredient prep cycles during our pilot phase. We would love to host your group on an alternative date!</p>
    <div style="text-align:center;margin:24px 0;">
      <a href="${SITE_URL}/book" style="background:#8C1538;color:white;padding:12px 24px;border-radius:999px;font-weight:700;text-decoration:none;font-size:13px;">Select Alternative Date</a>
    </div>
  `);
  await send(data.customerEmail, `Request Update — ${data.publicReference} | PlatePlay`, html);
}

export async function sendBookingCancelled(data: BookingEmailData) {
  const html = baseTemplate(`
    <h2 style="color:#8C1538;margin:0 0 8px;">Your request has been cancelled</h2>
    <p style="color:#555;margin:0 0 16px;">Hi ${data.customerName}, your booking request <strong>${data.publicReference}</strong> has been cancelled.</p>
    <p style="color:#555;font-size:13px;">If you ever want to cook with us again, your account remains active and ready for future bookings.</p>
  `);
  await send(data.customerEmail, `Request Cancelled — ${data.publicReference} | PlatePlay`, html);
}

export async function sendSessionReminder(data: BookingEmailData) {
  const html = baseTemplate(`
    <h2 style="color:#8C1538;margin:0 0 8px;">Reminder: Your Kitchen Session is Coming Up!</h2>
    <p style="color:#555;margin:0 0 16px;">Hi ${data.customerName}, your group cooking session <strong>${data.publicReference}</strong> in the <strong>${data.kitchenName}</strong> is approaching.</p>
    <p style="color:#555;font-size:13px;">Please arrive 10 minutes before your slot to suit up with aprons and get acquainted with your cooking station.</p>
  `);
  await send(data.customerEmail, `Session Reminder — ${data.publicReference} | PlatePlay`, html);
}
