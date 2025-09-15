import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

// Configure transport via environment variables. Fill these in your .env file.
// Required for real SMTP:
//   SMTP_HOST=smtp.yourprovider.com
//   SMTP_PORT=587
//   SMTP_USER=your_username
//   SMTP_PASS=your_password
// Optional:
//   CONTACT_TO=recipient@example.com  # Where contact messages should arrive
//   CONTACT_FROM=from@example.com     # From address
//   MAIL_MODE=ethereal                # Use Ethereal test SMTP (auto)

let cachedTransporter = null;

function hasRealSMTP() {
  return !!(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS);
}

export function getMailMode() {
  if (hasRealSMTP()) return 'smtp';
  return (process.env.MAIL_MODE || '').toLowerCase() === 'ethereal' ? 'ethereal' : 'json';
}

export function getMailConfigSummary() {
  return {
    mode: getMailMode(),
    hasRealSMTP,
    env: {
      SMTP_HOST: !!process.env.SMTP_HOST,
      SMTP_PORT: !!process.env.SMTP_PORT,
      SMTP_USER: !!process.env.SMTP_USER,
      SMTP_PASS: !!process.env.SMTP_PASS,
      CONTACT_TO: !!process.env.CONTACT_TO,
      CONTACT_FROM: !!process.env.CONTACT_FROM,
      MAIL_MODE: (process.env.MAIL_MODE || '').toLowerCase() || null,
      NODE_ENV: process.env.NODE_ENV || null,
    },
  };
}

async function getTransporter() {
  if (cachedTransporter) return cachedTransporter;

  if (hasRealSMTP()) {
    cachedTransporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT || 587),
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
    return cachedTransporter;
  }

  // No SMTP configured. Pick a dev-friendly transport.
  if ((process.env.MAIL_MODE || '').toLowerCase() === 'ethereal') {
    const testAccount = await nodemailer.createTestAccount();
    cachedTransporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false,
      auth: { user: testAccount.user, pass: testAccount.pass },
    });
  } else {
    // Default: do not send, just emit JSON (great for local dev without internet)
    cachedTransporter = nodemailer.createTransport({ jsonTransport: true });
  }
  return cachedTransporter;
}

export const deliverContactEmail = async ({ name, email, subject, message }) => {
  const transporter = await getTransporter();
  const to = process.env.CONTACT_TO || 'you@example.com';
  const from = process.env.CONTACT_FROM || process.env.SMTP_USER || 'no-reply@example.com';
  const html = `
    <h2>New contact message</h2>
    <p><strong>Name:</strong> ${name}</p>
    <p><strong>Email:</strong> ${email}</p>
    <p><strong>Subject:</strong> ${subject}</p>
    <p><strong>Message:</strong></p>
    <p>${message.replace(/\n/g, '<br/>')}</p>
  `;
  // 1) Notify site owner/admin
  const info = await transporter.sendMail({
    from,
    to,
    subject: `[RentChain Contact] ${subject}`,
    text: `Name: ${name}\nEmail: ${email}\nSubject: ${subject}\n\n${message}`,
    html,
  });

  // 2) Optional: Auto-reply to the sender
  const autorespondEnabled = String(process.env.CONTACT_AUTOREPLY || 'true').toLowerCase() !== 'false';
  const brand = process.env.BRAND_NAME || 'RentChain';
  const projectLink = process.env.PROJECT_LINK || 'https://example.com';
  const supportEmail = process.env.SUPPORT_EMAIL || (process.env.CONTACT_FROM || process.env.SMTP_USER || 'no-reply@example.com');
  if (autorespondEnabled && email) {
    const arSubject = process.env.CONTACT_AUTOREPLY_SUBJECT || `Thanks for reaching out to ${brand}`;
    const arText = [
      `Hi ${name || ''},`.trim(),
      '',
      `Thanks for contacting ${brand}. We received your message and will get back to you shortly.`,
      '',
      `Your message:`,
      `${subject}\n${message}`,
      '',
      `More about the project: ${projectLink}`,
      '',
      `If you have more details to share, reply to this email or write to ${supportEmail}.`,
      '',
      `— The ${brand} Team`,
    ].join('\n');

    const arHtml = `
      <div style="background:#f6f8fb;padding:24px;font-family:Inter,Segoe UI,Roboto,Arial,sans-serif;color:#0f172a;">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:640px;margin:0 auto;background:#ffffff;border-radius:12px;box-shadow:0 4px 16px rgba(0,0,0,0.06);overflow:hidden;">
          <tr>
            <td style="padding:20px 24px;background:linear-gradient(90deg,#5885AF,#6BA8E5);color:#fff;">
              <h1 style="margin:0;font-size:20px;line-height:1.3;">${brand}</h1>
              <p style="margin:4px 0 0;font-size:13px;opacity:.9;">Thanks for reaching out</p>
            </td>
          </tr>
          <tr>
            <td style="padding:24px;">
              <p style="margin:0 0 12px;font-size:15px;">Hi ${name || 'there'},</p>
              <p style="margin:0 0 12px;font-size:15px;">
                Thanks for contacting <strong>${brand}</strong>. We’ve received your message and will get back to you shortly.
              </p>
              <div style="margin:16px 0;padding:12px 14px;background:#f8fafc;border:1px solid #e2e8f0;border-radius:10px;">
                <p style="margin:0 0 8px;font-size:13px;color:#475569;">Your message</p>
                <p style="margin:0;font-size:14px;white-space:pre-line;">${(subject ? `Subject: ${subject}\n` : '') + (message || '').replace(/\n/g,'<br/>')}</p>
              </div>
              <p style="margin:0 0 8px;font-size:15px;">Learn more about the project:</p>
              <p style="margin:0 0 16px;">
                <a href="${projectLink}" style="display:inline-block;background:#0ea5e9;color:#fff;text-decoration:none;padding:10px 14px;border-radius:10px;font-weight:700;">Visit Project</a>
              </p>
              <p style="margin:0 0 12px;font-size:13px;color:#475569;">Need help? Reply to this email or write to <a href="mailto:${supportEmail}">${supportEmail}</a>.</p>
              <p style="margin:16px 0 0;font-size:12px;color:#64748b;">— The ${brand} Team</p>
            </td>
          </tr>
        </table>
      </div>
    `;

    await transporter.sendMail({
      from,
      to: email,
      subject: arSubject,
      text: arText,
      html: arHtml,
    });
  }

  return info;
};
