const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const multer = require("multer");

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const upload = multer({ dest: "uploads/" });

mongoose
  .connect("mongodb+srv://tuyendang486:dUgykBMiPEmQbLoL@communityboard.vvgkm.mongodb.net/communityboard?retryWrites=true&w=majority")
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

const announcementSchema = new mongoose.Schema({
  eventName: String,
  eventType: String,
  location: String,
  latitude: Number,
  longitude: Number,
  startTime: Date,
  endTime: Date,
  description: String,
});

const Announcement = mongoose.model("Announcement", announcementSchema);

app.post("/api/announcements", multer().none(), async (req, res) => {
  console.log("Received request body:", req.body);
  console.log("Received file:", req.file);

  const { eventName, eventType, location, startTime, endTime, description, latitude, longitude } = req.body;

  if (!eventName || !eventType || !startTime || isNaN(latitude) || isNaN(longitude)) {
    return res.status(400).json({ message: "Missing or invalid required fields" });
  }

  const newAnnouncement = new Announcement({
    eventName,
    eventType,
    location,
    startTime: new Date(startTime),
    endTime: endTime ? new Date(endTime) : null,
    description,
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

const haversineDistance = (lat1, lon1, lat2, lon2) => {
    const toRadians = (degrees) => degrees * (Math.PI / 180);
    const R = 6371;
    const dLat = toRadians(lat2 - lat1);
    const dLon = toRadians(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c * 0.621371;
  };
  
  app.get("/api/announcements", async (req, res) => {
    try {
      const { eventType, startTime, latitude, longitude } = req.query;
      let filterQuery = {};
  
      if (eventType) {
        filterQuery.eventType = eventType;
      }
      if (startTime) {
        filterQuery.startTime = { $gte: new Date(startTime) };
      }
  
      const announcements = await Announcement.find(filterQuery);
  
      if (latitude && longitude) {
        const userLat = parseFloat(latitude);
        const userLon = parseFloat(longitude);
        const filteredAnnouncements = announcements.filter(announcement => {
          const distance = haversineDistance(userLat, userLon, announcement.latitude, announcement.longitude);
          return distance <= 100;
        });
        res.status(200).json(filteredAnnouncements);
      } else {
        res.status(200).json(announcements);
      }
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  });
  
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
