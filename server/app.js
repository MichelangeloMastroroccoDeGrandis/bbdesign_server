
const express = require('express');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Serve static files from the React app
app.use(express.static(path.join(__dirname, 'build')));

// API routes or other routes can be added here
const nodemailer = require('nodemailer');

// Create a nodemailer transporter
const transporter = nodemailer.createTransport({
  service: 'Gmail', 
  auth: {
    user: process.env.EMAIL_TRANSPORTER,
    pass: process.env.EMAIL_PASSWORD
  }
});

app.post('/booking', (req, res) => {
  const formData = req.body;

  // Compose email message
  const mailOptions = {
    from: 'monica.bbdesign@gmail.com',
    to: 'monica.bbdesign@gmail.com', // Enter the recipient email address here
    subject: 'Nuova Richiesta - BBDesign',
    text: `Name: ${formData.name}\n 
           Email: ${formData.email}\n
           Message: ${formData.message}\n
           ${formData.checkin && `Check-in: ${formData.checkin}` }\n
           ${formData.checkout && `Check-out: ${formData.checkout}` }\n
           ${formData.suite && `Camera: ${formData.suite}` }\n
           ${formData.vegan && `Colazione: Vegan` }\n
           ${formData.italian && `Colazione: Italiana` }\n
           ${formData.international && `Colazione: Internazionale` }\n
           ${formData.carParking ? `Parcheggio: Si` : `Parcheggio: No` }\n
           `
  };

  // Send email
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error sending email:', error);
      res.status(500).send('Error sending email');
    } else {
      console.log('Email sent:', info.response);
      res.status(200).send('Email sent successfully');
    }
  });
});

// Catch all other routes and return the React index file
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname+'build/index.html'));
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
