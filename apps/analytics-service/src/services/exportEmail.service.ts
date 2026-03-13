import nodemailer from 'nodemailer';
import { config } from '../config/env';

let transporter: nodemailer.Transporter | null = null;

const getTransporter = () => {
  if (transporter) return transporter;

  transporter = nodemailer.createTransport({
    service: config.emailService,
    auth: {
      user: config.emailUser,
      pass: config.emailPassword,
    },
  });

  return transporter;
};

const sendExportEmail = async (
  to: string,
  format: 'pdf' | 'xlsx',
  attachmentBuffer: Buffer,
  fileName: string
): Promise<void> => {
  const transport = getTransporter();

  await transport.sendMail({
    from: config.emailFrom,
    to,
    subject: `TalentSYNC Analytics Export (${format.toUpperCase()})`,
    text: 'Your requested analytics export is attached.',
    html: `<p>Your requested analytics export is attached.</p>`,
    attachments: [
      {
        filename: fileName,
        content: attachmentBuffer,
        contentType:
          format === 'pdf'
            ? 'application/pdf'
            : 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      },
    ],
  });
};

export { sendExportEmail };
