const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const nodemailer = require('nodemailer');
const axios = require('axios');
require('dotenv').config()

const app = express();

app.use(bodyParser.json());
app.use(cors());

// Create a nodemailer transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'firas.yacoup@gmail.com', // Replaces with your email
    pass: 'cqpu urvl olgd qzmf', // Replace with your email password
  },
});

// Verify reCAPTCHA function
const verifyRecaptcha = async (recaptchaValue) => {
  const recaptchaSecretKey =process.env.RECAPTCHA_SECRET_KEY; // Replace with your reCAPTCHA secret key

  try {
    const response = await axios.post(
      `https://www.google.com/recaptcha/api/siteverify?secret=${recaptchaSecretKey}&response=${recaptchaValue}`
    );

    if (response.data.success) {
      return true;
    }
  } catch (error) {
    console.error('Error verifying reCAPTCHA:', error);
  }

  return false;
};

// Handle contact form submission and send email
app.post('/submit', async (req, res) => {
  const { firstName, lastName, email, subject, message, recaptchaValue } = req.body;

  // Verify reCAPTCHA
  const isRecaptchaValid = await verifyRecaptcha(recaptchaValue);
  if (!isRecaptchaValid) {
    return res.status(400).json({ message: 'reCAPTCHA verification failed.' });
  }

  // Email content
  const mailOptions = {
    from: 'YOUR_EMAIL@gmail.com', // Replace with your email
    to: 'firas.yacoup1@gmail.com', // Replace with your company's email
    subject: subject || 'New Contact Form Submission', // Use the provided subject or a default value
    text: `
      Name: ${firstName} ${lastName}
      Email: ${email}
      Message: ${message}
    `,
  };

  // Send email
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error sending email:', error);
      res.status(500).json({ message: 'Error sending email.' });
    } else {
      console.log('Email sent:', info.response);
      res.status(200).json({ message: 'Email sent successfully.' });
    }
  });
});

const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

