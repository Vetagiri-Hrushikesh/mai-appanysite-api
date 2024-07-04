
import nodemailer, { Transporter } from 'nodemailer';
import config from '../../../../../config/config.json'

interface EmailConfig {
  development: {
    email: {
      auth: {
        user: string;
        pass: string;
      };
    };
  };
}

const emailConfig: EmailConfig = config;

const transporter: Transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  auth: {
    user: emailConfig.development.email.auth.user,
    pass: emailConfig.development.email.auth.pass,
  },
});

interface SendEmailResponse {
  success: boolean;
  message: string;
  error?: string;
}

async function sendEmail(to: string, subject: string, text: string): Promise<SendEmailResponse> {
  const mailOptions = {
    from: emailConfig.development.email.auth.user,
    to:to,
    subject:subject,
    text:text,
  };

  try {
    console.log(mailOptions);
    await transporter.sendMail(mailOptions);
    return { success: true, message: 'Email sent successfully' };
  } catch (error: any) {
    console.error('Error sending email:', error);
    return { success: false, message: 'Failed to send email', error: error.message };
  }
}

export { sendEmail };