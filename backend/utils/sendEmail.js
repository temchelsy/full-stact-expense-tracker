import nodemailer from 'nodemailer';

// Function to send email
export const sendEmail = async (to, subject, text) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail', // Can be any email service (e.g., Gmail, SendGrid, Mailgun)
    auth: {
      user: process.env.EMAIL_USER, // Your email address
      pass: process.env.EMAIL_PASS, // Your email password or an app-specific password
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,  // Recipient email
    subject,  // Subject of the email
    text,  // Email body content
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Email sent to ${to}`);
  } catch (error) {
    console.error('Error sending email:', error);
  }
};
