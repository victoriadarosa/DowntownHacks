const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const multer = require('multer'); // Import multer
const upload = multer({ dest: 'uploads/' }); // Configure multer to store files in the 'uploads' directory

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

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
    picture: String, // Store file path or URL
    description: String,
});

const Announcement = mongoose.model('Announcement', announcementSchema);

// API Route to Create Announcement
app.post('/api/announcements', upload.single('picture'), async (req, res) => {
    console.log("Received request body:", req.body); // Should now show the form fields
    console.log("Received file:", req.file); // To see if the file is uploaded

    const { eventName, eventType, location, startTime, endTime, description } = req.body;
    const picturePath = req.file ? req.file.path : null; // Get file path

    const newAnnouncement = new Announcement({
        eventName,
        eventType,
        location,
        startTime,
        endTime,
        description,
        picture: picturePath, // Store the file path
    });

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

// API Route to Get All Announcements
app.get('/api/announcements', async (req, res) => {
    try {
      const announcements = await Announcement.find();
      res.status(200).json(announcements);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  });

// API Route to Get Announcements with filtering
app.get('/api/announcements', async (req, res) => {
    const { eventType, location, startDate, endDate } = req.query;
    const query = {};
  
    if (eventType) {
      query.eventType = eventType;
    }
  
    if (location) {
      query.location = { $regex: location, $options: 'i' }; // Case-insensitive search
    }
  
    if (startDate && endDate) {
      query.startTime = { $gte: new Date(startDate), $lte: new Date(endDate) };
    }
  
    try {
      const announcements = await Announcement.find(query);
      res.status(200).json(announcements);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  });
  