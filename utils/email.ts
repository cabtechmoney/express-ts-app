import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const emailUser = process.env.EMAIL_USER;
const emailPassword = process.env.EMAIL_PASSWORD;

let transporter: any = null;

function getTransporter() {
  if (!transporter) {
    transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: emailUser,
        pass: emailPassword,
      },
    });
  }
  return transporter;
}

export async function sendPasswordResetEmail(email: string, resetLink: string) {
  if (!emailUser || !emailPassword) {
    console.warn('Email service not configured');
    return { success: false, message: 'Email service not available' };
  }

  try {
    const transporter = getTransporter();
    await transporter.sendMail({
      from: emailUser,
      to: email,
      subject: 'Password Reset Request',
      html: `<p>Click <a href="${resetLink}">here</a> to reset your password</p>`,
    });
    return { success: true };
  } catch (error) {
    console.error('Email error:', error);
    return { success: false, message: 'Failed to send email' };
  }
}

export async function sendInvoiceEmail(email: string, invoiceUrl: string, invoiceNumber: string) {
  if (!emailUser || !emailPassword) {
    console.warn('Email service not configured');
    return { success: false, message: 'Email service not available' };
  }

  try {
    const transporter = getTransporter();
    await transporter.sendMail({
      from: emailUser,
      to: email,
      subject: `Invoice ${invoiceNumber}`,
      html: `<p>Your invoice is ready. <a href="${invoiceUrl}">Download here</a></p>`,
    });
    return { success: true };
  } catch (error) {
    console.error('Email error:', error);
    return { success: false, message: 'Failed to send email' };
  }
}

export async function sendDeadlineReminder(email: string, projectName: string, deadline: string) {
  if (!emailUser || !emailPassword) {
    console.warn('Email service not configured');
    return { success: false, message: 'Email service not available' };
  }

  try {
    const transporter = getTransporter();
    await transporter.sendMail({
      from: emailUser,
      to: email,
      subject: `Deadline Reminder: ${projectName}`,
      html: `<p>Reminder: Project <strong>${projectName}</strong> is due on <strong>${deadline}</strong></p>`,
    });
    return { success: true };
  } catch (error) {
    console.error('Email error:', error);
    return { success: false, message: 'Failed to send email' };
  }
}
