import { config } from '../config/env';
import nodemailer from 'nodemailer';
import { internalServerError } from '@talentsync/types';
import { logger } from '@talentsync/config';

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

  // If email credentials not configured
  if (!config.emailUser || !config.emailPassword) {
    logger.warn('Email credentials not configured.');
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
export const sendEmail = async ({ to, subject, text, html }: EmailOptions): Promise<void> => {
  const transport = getTransporter();

  // throw error if transporter is not configured
  if (!transport) throw internalServerError('Failed to send email', 'EMAIL_DELIVERY_FAILED');

  // Send mail
  try {
    await transport.sendMail({
      from: config.emailFrom,
      to,
      subject,
      text,
      html: html || text,
    });
    logger.info(`Email sent successfully to ${to}`);
  } catch (error) {
    logger.error(`Failed to send email: ${error}`);
    throw internalServerError('Failed to send email', 'EMAIL_DELIVERY_FAILED');
  }
};

// mail content + invoking sendMail
export const sendOtpEmail = async (email: string, otp: string): Promise<void> => {
  const subject = 'Reset Password';
  const text = `Your password reset OTP is: ${otp}\n\nThis OTP will expire in 15 minutes.\n\nIf you didn't request this, Please secure your account!.`;
  const html = `
    <div style="font-family: Arial, sans-serif; padding: 18x;">
      <h2>Reset Password</h2>
      <p>Your password reset OTP is:</p>
      <h1 style="color: green; font-size: 32px; letter-spacing: 5px;">${otp}</h1>
      <p>This OTP will expire in <strong>15 minutes</strong>.</p>
      <p style="color: #5d5d5d; margin-top: 30px;">If you didn't request this, Please secure your account!</p>
    </div>
  `;

  await sendEmail({ to: email, subject, text, html });
};
