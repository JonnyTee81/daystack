import nodemailer from "nodemailer";

// For local development, we'll use a simple fake SMTP service
// In production, you'd use a real email service like SendGrid, Mailgun, etc.

export async function createTestEmailAccount() {
  // Create a test account for local development
  const testAccount = await nodemailer.createTestAccount();
  
  return {
    host: "smtp.ethereal.email",
    port: 587,
    secure: false,
    auth: {
      user: testAccount.user,
      pass: testAccount.pass,
    },
  };
}

export function createEmailTransporter() {
  // For local development, use static test credentials
  // These are safe to commit as they're for a fake email service
  return nodemailer.createTransporter({
    host: "smtp.ethereal.email",
    port: 587,
    secure: false,
    auth: {
      user: "ethereal.user@ethereal.email",
      pass: "ethereal.pass",
    },
  });
}

export function getPreviewUrl(messageInfo: any) {
  // For Ethereal Email, return the preview URL
  return nodemailer.getTestMessageUrl(messageInfo);
}