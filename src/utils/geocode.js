import axios from "axios";

const API_KEY = "AIzaSyBaj1qQzL-Q9bTdWS_15_Cxr_3EYxGVU2A";

export const fetchLocationAddress = async (latitude, longitude) => {
  try {
    const response = await axios.get(
      `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${API_KEY}`
    );
    if (response.data.results.length > 0) {
      return response.data.results[0].formatted_address;
    }
    return "Unknown location";
  } catch (error) {
    console.error("Error fetching location:", error);
    return "Location not found";
  }
};