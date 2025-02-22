const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const multer = require("multer");

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const upload = multer({ dest: "uploads/" });

// MongoDB Connection
mongoose
  .connect("mongodb+srv://tuyendang486:dUgykBMiPEmQbLoL@communityboard.vvgkm.mongodb.net/communityboard?retryWrites=true&w=majority")
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Announcement Schema
const announcementSchema = new mongoose.Schema({
  eventName: String,
  eventType: String,
  location: String,
  latitude: Number,
  longitude: Number,
  startTime: Date,
  endTime: Date,
  picture: String,
  description: String,
});

const Announcement = mongoose.model("Announcement", announcementSchema);

// Create Announcement API
app.post("/api/announcements", upload.single("picture"), async (req, res) => {
  console.log("Received request body:", req.body);
  console.log("Received file:", req.file);

  const { eventName, eventType, location, startTime, endTime, description, latitude, longitude } = req.body;

  if (isNaN(latitude) || isNaN(longitude)) {
    return res.status(400).json({ message: "Invalid latitude or longitude" });
  }

  const picturePath = req.file ? req.file.path : null;

  const newAnnouncement = new Announcement({
    eventName,
    eventType,
    location,
    startTime: new Date(startTime),
    endTime: new Date(endTime),
    description,
    picture: picturePath,
    latitude: parseFloat(latitude),
    longitude: parseFloat(longitude),
  });

  try {
    const savedAnnouncement = await newAnnouncement.save();
    res.status(201).json(savedAnnouncement);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get All Announcements
app.get("/api/announcements", async (req, res) => {
  try {
    const { eventType, location, startDate, endDate } = req.query;
    let filterQuery = {};

    if (eventType) {
      filterQuery.eventType = eventType;
    }

    if (location) {
      filterQuery.location = { $regex: new RegExp(location, "i") };
    }

    if (startDate && endDate) {
      filterQuery.startTime = { $gte: new Date(startDate), $lte: new Date(endDate) };
    } else if (startDate) {
      filterQuery.startTime = { $gte: new Date(startDate) };
    } else if (endDate) {
      filterQuery.endTime = { $lte: new Date(endDate) };
    }

    const announcements = await Announcement.find(filterQuery);
    res.status(200).json(announcements);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
