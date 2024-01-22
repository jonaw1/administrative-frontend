import nodemailer from 'nodemailer';

const sendEmail = async (to: string, subject: string, text: string) => {
  const transporter = nodemailer.createTransport({
    host: process.env.SEND_EMAILS_SMTP,
    port: process.env.SEND_EMAILS_PORT,
    secure: process.env.SEND_EMAILS_SECURE,
    auth: {
      user: process.env.SEND_EMAILS_EMAIL,
      pass: process.env.SEND_EMAILS_PW
    }
  } as object);

  const mailOptions: nodemailer.SendMailOptions = {
    from: process.env.SEND_EMAILS_EMAIL,
    to,
    subject,
    text
  };

  await transporter.sendMail(mailOptions);
};

export default sendEmail;
