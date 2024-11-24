require('dotenv').config();
const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname)));

// Email transporter configuration
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// Routes
app.post('/api/contact', async (req, res) => {
    try {
        console.log('Received contact form submission:', req.body);
        const { name, email, message } = req.body;

        // Validate input
        if (!name || !email || !message) {
            console.log('Validation failed:', { name, email, message });
            return res.status(400).json({ error: 'All fields are required' });
        }

        // Email options
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: process.env.EMAIL_USER, // Send to yourself
            subject: `Contact Form Message from ${name}`,
            text: `
                Name: ${name}
                Email: ${email}
                Message: ${message}
            `
        };

        console.log('Attempting to send email with options:', mailOptions);

        // Send email
        await transporter.sendMail(mailOptions);
        console.log('Email sent successfully');

        res.status(200).json({ message: 'Message sent successfully' });
    } catch (error) {
        console.error('Detailed error in sending email:', error);
        res.status(500).json({ error: 'Failed to send message', details: error.message });
    }
});

// Serve index.html for all routes
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
