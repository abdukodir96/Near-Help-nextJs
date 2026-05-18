import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);
const mailFrom = process.env.MAIL_FROM ?? 'NearHelp <onboarding@resend.dev>';

type BookingBody = {
  name: string;
  email: string;
  phone: string;
  serviceTitle: string;
  date: string;
  time: string;
  address: string;
  note?: string;
};

const buildHtml = (b: BookingBody) => `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"/><title>Booking Received</title></head>
<body style="margin:0;padding:0;background:#f3f4f6;font-family:Arial,Helvetica,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f3f4f6;padding:40px 16px;">
  <tr><td align="center">
    <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">

      <tr><td style="background:#0052da;border-radius:12px 12px 0 0;padding:32px 40px;text-align:center;">
        <div style="font-size:26px;font-weight:900;color:#fff;">NearHelp</div>
        <div style="font-size:13px;color:rgba(255,255,255,0.7);margin-top:4px;text-transform:uppercase;letter-spacing:.08em;">House Service Company</div>
      </td></tr>

      <tr><td style="background:#fff;padding:40px;">
        <div style="text-align:center;margin-bottom:28px;">
          <span style="display:inline-block;background:#ecfdf5;color:#065f46;font-size:13px;font-weight:800;padding:8px 20px;border-radius:999px;text-transform:uppercase;">✓ Booking Received</span>
        </div>
        <p style="margin:0 0 8px;font-size:22px;font-weight:900;color:#111827;">Hello, ${b.name}!</p>
        <p style="margin:0 0 28px;font-size:15px;color:#6b7280;line-height:1.7;">
          Your booking request has been successfully submitted. Our team will contact you shortly.
        </p>
        <div style="background:#f8faff;border:1px solid #dbeafe;border-radius:10px;padding:20px 24px;margin-bottom:28px;">
          <div style="font-size:12px;color:#6b7280;font-weight:700;text-transform:uppercase;letter-spacing:.1em;margin-bottom:6px;">Service</div>
          <div style="font-size:18px;font-weight:900;color:#0052da;">${b.serviceTitle}</div>
        </div>
        <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:28px;">
          <tr>
            <td style="padding:10px 0;border-bottom:1px solid #e5e7eb;color:#6b7280;font-size:14px;width:140px">Date</td>
            <td style="padding:10px 0;border-bottom:1px solid #e5e7eb;color:#111827;font-size:14px;font-weight:600">${b.date}</td>
          </tr>
          <tr>
            <td style="padding:10px 0;border-bottom:1px solid #e5e7eb;color:#6b7280;font-size:14px">Time</td>
            <td style="padding:10px 0;border-bottom:1px solid #e5e7eb;color:#111827;font-size:14px;font-weight:600">${b.time}</td>
          </tr>
          <tr>
            <td style="padding:10px 0;border-bottom:1px solid #e5e7eb;color:#6b7280;font-size:14px">Address</td>
            <td style="padding:10px 0;border-bottom:1px solid #e5e7eb;color:#111827;font-size:14px;font-weight:600">${b.address}</td>
          </tr>
          <tr>
            <td style="padding:10px 0;border-bottom:1px solid #e5e7eb;color:#6b7280;font-size:14px">Phone</td>
            <td style="padding:10px 0;border-bottom:1px solid #e5e7eb;color:#111827;font-size:14px;font-weight:600">${b.phone}</td>
          </tr>
          ${b.note ? `<tr>
            <td style="padding:10px 0;color:#6b7280;font-size:14px">Note</td>
            <td style="padding:10px 0;color:#111827;font-size:14px;font-weight:600">${b.note}</td>
          </tr>` : ''}
        </table>
        <div style="background:#fffbeb;border:1px solid #fcd34d;border-radius:8px;padding:16px 20px;">
          <p style="margin:0;font-size:14px;color:#92400e;line-height:1.6;">
            <strong>What's next?</strong> Our team will review your request and reach out to you at <strong>${b.email}</strong> or <strong>${b.phone}</strong> to confirm the appointment.
          </p>
        </div>
      </td></tr>

      <tr><td style="background:#253041;border-radius:0 0 12px 12px;padding:24px 40px;text-align:center;">
        <p style="margin:0 0 6px;font-size:15px;font-weight:800;color:#fff;">NearHelp</p>
        <p style="margin:0;font-size:12px;color:rgba(255,255,255,0.5);">This is an automated message. Please do not reply to this email.</p>
      </td></tr>

    </table>
  </td></tr>
</table>
</body></html>`;

const buildText = (b: BookingBody) => [
  `Hello ${b.name},`,
  '',
  'Your booking request has been received.',
  '',
  `Service:  ${b.serviceTitle}`,
  `Date:     ${b.date}`,
  `Time:     ${b.time}`,
  `Address:  ${b.address}`,
  `Phone:    ${b.phone}`,
  b.note ? `Note:     ${b.note}` : '',
  '',
  `We will contact you at ${b.email} or ${b.phone} to confirm.`,
  '',
  'NearHelp',
].filter(Boolean).join('\n');

export async function POST(req: NextRequest) {
  try {
    const body: BookingBody = await req.json();
    const { name, email, phone, serviceTitle, date, time, address } = body;

    if (!name || !email || !phone || !serviceTitle || !date || !time || !address) {
      return NextResponse.json({ error: 'Missing required fields.' }, { status: 400 });
    }

    const { data, error } = await resend.emails.send({
      from: mailFrom,
      to: email,
      subject: `✓ Booking received — ${serviceTitle}`,
      html: buildHtml(body),
      text: buildText(body),
    });

    if (error) {
      console.error('[booking/route] Resend error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, id: data?.id });
  } catch (err) {
    console.error('[booking/route] Unexpected error:', err);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}
