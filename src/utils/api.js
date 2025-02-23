import axios from "axios";

const API_BASE_URL = "http://localhost:5001/api";

export const fetchAnnouncements = async (filters = {}) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/announcements`, { params: filters });
    return response.data;
  } catch (error) {
    console.error("Error fetching announcements:", error);
    throw error;
  }
};

export const createAnnouncement = async (formData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/announcements`, formData);
    return response.data;
  } catch (error) {
    console.error("Error creating announcement:", error);
    throw error;
  }
};