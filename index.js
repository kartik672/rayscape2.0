const express = require('express');
const app = express();
const port = 3000;
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
dotenv.config();

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());

const path = require('path');
app.use('/public', express.static(path.join(__dirname, 'public')));

// Email configuration
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Routes
app.get("/", (req, res) => {
  res.render("index");
});

app.get('/contact', (req, res) => {
  res.render('contact');
});

app.get('/showreel', (req, res) => {
  res.render('showreel');
});

app.get('/about', (req, res) => {
  res.render('about');
});

app.get('/services', (req, res) => {
  res.render('services');
});
app.get('/test', (req, res) => {
  res.render('test');
});

// Handle form submission
app.post('/submit-form', (req, res) => {
  const { name, email, position, message } = req.body;

  const mailOptions = {
    from: 'kartikruhela672@gmail.com',
    to: 'business@rayscapefilms.in', // can be same as from or different
    subject: `New Application for ${position}`,
    text: `
      Name: ${name}
      Email: ${email}
      Position: ${position}
      Message: ${message}
    `,
    html: `
      <h2>New Job Application</h2>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Position:</strong> ${position}</p>
      <p><strong>Message:</strong> ${message}</p>
    `
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error sending email:', error);
      return res.status(500).send('Error sending message');
    }
    console.log('Email sent:', info.response);
    res.status(200).send('Message sent successfully');
  });
});

// Add this route with your other routes
app.post('/submit-contact', (req, res) => {
  const { name, email, message } = req.body;

  // Validate input
  if (!name || !email || !message) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ error: 'Please enter a valid email address' });
  }

  const mailOptions = {
    from: `"Contact Form" <${process.env.EMAIL_USER}>`,
    to: 'business@rayscapefilms.in', // Sending to yourself
    replyTo: email, // So you can reply directly to the sender
    subject: `New Contact Form Submission from ${name}`,
    text: `
      Name: ${name}
      Email: ${email}
      Message: ${message}
    `,
    html: `
      <h2>New Contact Form Submission</h2>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
      <p><strong>Message:</strong></p>
      <p>${message.replace(/\n/g, '<br>')}</p>
    `
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Contact form error:', error);
      return res.status(500).json({ error: 'Error sending message' });
    }
    console.log('Contact form email sent:', info.response);
    res.status(200).json({ message: 'Message sent successfully' });
  });
});

app.listen(port, () => {
  console.log(`The app is listening on port ${port}`);
});