// const express = require('express');
// const bodyParser = require('body-parser');
// const cors = require('cors');
// const nodemailer = require('nodemailer');
// const axios = require('axios');
// require('dotenv').config()

// const app = express();

// app.use(bodyParser.json());
// app.use(cors());

// // Create a nodemailer transporter
// const transporter = nodemailer.createTransport({
//   service: 'gmail',
//   auth: {
//     user: 'firas.yacoup@gmail.com', // Replaces with your email
//     pass: 'cqpu urvl olgd qzmf', // Replace with your email password
//   },
// });

// // Verify reCAPTCHA function
// const verifyRecaptcha = async (recaptchaValue) => {
//   const recaptchaSecretKey =process.env.RECAPTCHA_SECRET_KEY; // Replace with your reCAPTCHA secret key

//   try {
//     const response = await axios.post(
//       `https://www.google.com/recaptcha/api/siteverify?secret=${recaptchaSecretKey}&response=${recaptchaValue}`
//     );

//     if (response.data.success) {
//       return true;
//     }
//   } catch (error) {
//     console.error('Error verifying reCAPTCHA:', error);
//   }

//   return false;
// };

// // Handle contact form submission and send email
// app.post('/submit', async (req, res) => {
//   const { firstName, lastName, email, subject, message, recaptchaValue } = req.body;

//   // Verify reCAPTCHA
//   const isRecaptchaValid = await verifyRecaptcha(recaptchaValue);
//   if (!isRecaptchaValid) {
//     return res.status(400).json({ message: 'reCAPTCHA verification failed.' });
//   }

//   // Email content
//   const mailOptions = {
//     from: 'YOUR_EMAIL@gmail.com', // Replace with your email
//     to: 'firas.yacoup1@gmail.com', // Replace with your company's email
//     subject: subject || 'New Contact Form Submission', // Use the provided subject or a default value
//     text: `
//       Name: ${firstName} ${lastName}
//       Email: ${email}
//       Message: ${message}
//     `,
//   };

//   // Send email
//   transporter.sendMail(mailOptions, (error, info) => {
//     if (error) {
//       console.error('Error sending email:', error);
//       res.status(500).json({ message: 'Error sending email.' });
//     } else {
//       console.log('Email sent:', info.response);
//       res.status(200).json({ message: 'Email sent successfully.' });
//     }
//   });
// });

// const port = process.env.PORT || 4000;
// app.listen(port, () => {
//   console.log(`Server is running on port ${port}`);
// });




//////////////////////////////////////////////////////////////////////////////////////////////


const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const nodemailer = require('nodemailer');
const axios = require('axios');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 4000;

app.use(bodyParser.json());
app.use(cors());

// Create a nodemailer transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER, // Replace with your email
    pass: process.env.EMAIL_PASS, // Replace with your email password
  },
});

// Verify reCAPTCHA function
const verifyRecaptcha = async (recaptchaValue) => {
  const recaptchaSecretKey = process.env.RECAPTCHA_SECRET_KEY; // Replace with your reCAPTCHA secret key

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
    from: process.env.EMAIL_USER, // Replace with your email
    to: process.env.COMPANY_EMAIL, // Replace with your company's email
    subject: subject || 'New Contact Form Submission',
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

// Handle product purchase confirmation and send email
app.post('/send-email', (req, res) => {
  const { userEmail, selectedProducts } = req.body;

  if (!userEmail || !selectedProducts || selectedProducts.length === 0) {
    return res.status(400).send('Invalid request');
  }

  // Email content for purchase confirmation
  const mailOptions = {
    from: process.env.EMAIL_USER, // Replace with your email
    to: process.env.COMPANY_EMAIL, // Replace with your company's email
    subject: 'Purchase Confirmation',
    text: `User ${userEmail} has purchased the following products:\n\n${selectedProducts
      .map((product) => `${product.name} - Price: $${product.price}`)
      .join('\n')}`,
  };

  // Send email
  transporter.sendMail(mailOptions, (error) => {
    if (error) {
      console.error('Email sending failed:', error);
      res.status(500).json({ message: 'Email sending failed.' });
    } else {
      console.log('Email sent successfully');
      res.status(200).json({ message: 'Email sent successfully.' });
    }
  });
});


app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});


