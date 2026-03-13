import { config } from '../config/env';
import nodemailer from 'nodemailer';

interface EmailOptions {
  to: string;
  subject: string;
  text: string;
  html?: string;
}

let transporter: nodemailer.Transporter | null = null;

// initiate the transporter to send mails
const getTransporter = () => {
  if (transporter) return transporter;

  if (!config.emailUser || !config.emailPassword) {
    console.warn('Email credentials not configured. Emails will be logged to console.');
    return null;
  }

  transporter = nodemailer.createTransport({
    service: config.emailService,
    auth: {
      user: config.emailUser,
      pass: config.emailPassword,
    },
  });

  return transporter;
};

// using the transporter to send mail
const sendEmail = async ({ to, subject, text, html }: EmailOptions): Promise<void> => {
  const transport = getTransporter();

  if (!transport) throw new Error('Failed to send email');

  try {
    await transport.sendMail({
      from: config.emailFrom,
      to,
      subject,
      text,
      html: html || text,
    });
    console.log(`Email sent successfully to ${to}`);
  } catch (error) {
    console.error('Failed to send email:', error);
    throw new Error('Failed to send email');
  }
};

// welcome email sent to auto-created candidate accounts
export const sendWelcomeEmail = async (name: string, email: string, phone: string): Promise<void> => {
  const subject = 'Your TalentSYNC Account Has Been Created';
  const text = `Hi ${name},\n\nA TalentSYNC account has been created for you.\n\nYour login credentials:\n  Email: ${email}\n  Phone: ${phone}\n  Password: password123\n\nPlease log in and change your password at the earliest.\n\nTalentSYNC Team`;
  const html = `
    <div style="font-family: Arial, sans-serif; padding: 18px; max-width: 500px;">
      <h2>Welcome to TalentSYNC!</h2>
      <p>Hi <strong>${name}</strong>,</p>
      <p>An account has been created for you on the TalentSYNC platform. You can now log in, view your profile, and apply for jobs.</p>
      <h3 style="margin-bottom: 4px;">Your Login Credentials</h3>
      <table style="border-collapse: collapse; width: 100%;">
        <tr><td style="padding: 6px 0; color: #555;">Email</td><td style="padding: 6px 0;"><strong>${email}</strong></td></tr>
        <tr><td style="padding: 6px 0; color: #555;">Phone</td><td style="padding: 6px 0;"><strong>${phone}</strong></td></tr>
        <tr><td style="padding: 6px 0; color: #555;">Password</td><td style="padding: 6px 0;"><strong>password123</strong></td></tr>
      </table>
      <p style="margin-top: 20px; color: #d9534f;"><strong>Please change your password after logging in for the first time.</strong></p>
      <p style="color: #5d5d5d; margin-top: 30px;">If you did not expect this email, please contact our support team.</p>
      <p style="margin-top: 20px;">- TalentSYNC Team</p>
    </div>
  `;

  await sendEmail({ to: email, subject, text, html });
};
