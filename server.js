// server.js
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MongoDB Connection
mongoose.connect('mongodb+srv://tuyendang486:dUgykBMiPEmQbLoL@communityboard.vvgkm.mongodb.net/communityboard?retryWrites=true&w=majority')
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err));

// Define Announcement Schema
const announcementSchema = new mongoose.Schema({
    eventName: String,
    eventType: String,
    location: String,
    startTime: Date,
    endTime: Date,
    picture: String, // You may want to handle file uploads differently
    description: String,
});

const Announcement = mongoose.model('Announcement', announcementSchema);

// API Route to Create Announcement
app.post('/api/announcements', async (req, res) => {
    const newAnnouncement = new Announcement(req.body);
    try {
        const savedAnnouncement = await newAnnouncement.save();
        res.status(201).json(savedAnnouncement);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
