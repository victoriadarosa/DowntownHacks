import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

const CreateAnnouncement = () => {
    const inputRef = useRef(null);
    const [eventName, setEventName] = useState("");
    const [eventType, setEventType] = useState("");
    const [location, setLocation] = useState({ lat: null, lng: null });
    const [startTime, setStartTime] = useState(""); 
    const [endTime, setEndTime] = useState(""); 
    const [description, setDescription] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        if (!window.google) {
            console.error("Google Maps API not loaded");
            return;
        }

        const center = { lat: 50.064192, lng: -130.605469 };
        const defaultBounds = {
            north: center.lat + 0.1,
            south: center.lat - 0.1,
            east: center.lng + 0.1,
            west: center.lng - 0.1,
        };

        if (inputRef.current) {
            const options = {
                bounds: defaultBounds,
                componentRestrictions: { country: "us" },
                fields: ["address_components", "geometry", "icon", "name"],
                strictBounds: false,
            };

            const autocomplete = new window.google.maps.places.Autocomplete(inputRef.current, options);

            autocomplete.addListener("place_changed", () => {
                const place = autocomplete.getPlace();
                console.log(place);
                if (place && place.geometry) {
                    const lat = place.geometry.location.lat();
                    const lng = place.geometry.location.lng();
                    setLocation({ lat, lng }); // Store the latitude and longitude in state
                }
            });
        }
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append("eventName", eventName);
        formData.append("eventType", eventType);
        formData.append("latitude", location.lat); // Use the stored latitude
        formData.append("longitude", location.lng); // Use the stored longitude
        formData.append("startTime", startTime);
    
        if (endTime) {
            formData.append("endTime", endTime);
        }
        if (description) {
            formData.append("description", description);
        }

        console.log({
            eventName,
            eventType,
            location,
            startTime,
            endTime: endTime || "Not provided",
            description: description || "Not provided",
        });

        try {
            const response = await fetch("http://localhost:5001/api/announcements", {
                method: "POST",
                body: formData,
            });

            if (response.ok) {
                console.log("Announcement created successfully");
                navigate("/home");
            } else {
                console.error("Error creating announcement:", response.statusText);
            }
        } catch (error) {
            console.error("Error creating announcement:", error);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label>Event Name:</label>
                <input
                    type="text"
                    value={eventName}
                    onChange={(e) => setEventName(e.target.value)}
                    required
                />
            </div>

            <div>
                <label>Event Type:</label>
                <select
                    value={eventType}
                    onChange={(e) => setEventType(e.target.value)}
                    required
                >
                    <option value="">Select event type</option>
                    <option value="Safety Alerts">Safety Alerts</option>
                    <option value="Local Events">Local Events</option>
                    <option value="Outdoor Activities">Outdoor Activities</option>
                    <option value="Volunteer">Volunteer</option>
                    <option value="Health">Health</option>
                    <option value="Family & Kids">Family & Kids</option>
                    <option value="Networking">Networking</option>
                    <option value="Other">Other</option>
                </select>
            </div>

            <div>
                <label>Location:</label>
                <input
                    id="pac-input"
                    ref={inputRef}
                    type="text"
                    placeholder="Enter a location"
                    // Remove value={location.address} as we don't have address in state
                    required
                    style={{ width: '400px', maxWidth: '100%' }}
                />
            </div>

            <div>
                <label>Start Time:</label>
                <input
                    type="datetime-local"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    required
                />
            </div>

            <div>
                <label>End Time (Optional):</label>
                <input
                    type="datetime-local"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                />
            </div>

            <div>
                <label>Description (Optional):</label>
                <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />
            </div>

            <button type="submit">Create Announcement</button>
            <button type="button" onClick={() => navigate("/home")}>
                Back to Home
            </button>
        </form>
    );
};

export default CreateAnnouncement;



// import React, { useState, useEffect, useRef } from "react";
// import { useNavigate } from "react-router-dom";

// const CreateAnnouncement = () => {
//     const inputRef = useRef(null);
//     const [eventName, setEventName] = useState("");
//     const [eventType, setEventType] = useState("");
//     const [location, setLocation] = useState("");
//     const [startTime, setStartTime] = useState(""); 
//     const [endTime, setEndTime] = useState(""); 
//     const [picture, setPicture] = useState(null);
//     const [description, setDescription] = useState("");
//     const navigate = useNavigate();

//     useEffect(() => {
//         if (!window.google) {
//             console.error("Google Maps API not loaded");
//             return;
//         }

//         const center = { lat: 50.064192, lng: -130.605469 };
//         const defaultBounds = {
//             north: center.lat + 0.1,
//             south: center.lat - 0.1,
//             east: center.lng + 0.1,
//             west: center.lng - 0.1,
//         };

//         if (inputRef.current) {
//             const options = {
//                 bounds: defaultBounds,
//                 componentRestrictions: { country: "us" },
//                 fields: ["address_components", "geometry", "icon", "name"],
//                 strictBounds: false,
//             };

//             //new window.google.maps.places.Autocomplete(inputRef.current, options);

//             //new stuff
//             const autocomplete =  new window.google.maps.places.Autocomplete(inputRef.current, options);

//             autocomplete.addListener("place_changed", () => {
//               const place = autocomplete.getPlace();
//               console.log(place);
//               console.log(place.formatted_address);
//               if (place && place.formatted_address) {
//                   setLocation(place.formatted_address); // Set the full address
//               }
//           });

//         }
//     }, []);

//     // const handleSubmit = (e) => {
//     //     e.preventDefault();
//     //     console.log({
//     //         eventName,
//     //         eventType,
//     //         startTime,
//     //         endTime,
//     //         location,
//     //         picture,
//     //         description,
//     //     });

//     //     navigate("/home");
//     // };

//     const handleSubmit = async (e) => {
//       e.preventDefault();
  
      
//     const formData = new FormData();
//     formData.append("eventName", eventName);
//     formData.append("eventType", eventType);
//     formData.append("location", location);
//     formData.append("startTime", startTime);
    
//     // Only append optional fields if they have values
//     if (endTime) {
//         formData.append("endTime", endTime);
//     }
//     if (description) {
//         formData.append("description", description);
//     }
//     if (picture) {
//         formData.append("picture", picture); // Handle picture uploads
//     }

//     // Log the data being sent, showing only the optional fields if they are present
//     console.log({
//         eventName,
//         eventType,
//         location,
//         startTime,
//         endTime: endTime || "Not provided",
//         description: description || "Not provided",
//         picture: picture ? picture.name : null, // Log the picture name if it's provided
//     });
  
//       try {
//           const response = await fetch("http://localhost:5001/api/announcements", {
//               method: "POST",
//               body: formData,
//           });
  
//           if (response.ok) {
//               console.log("Announcement created successfully");
//               navigate("/home");
//           } else {
//               console.error("Error creating announcement:", response.statusText);
//           }
//       } catch (error) {
//           console.error("Error creating announcement:", error);
//       }
//   };
  

//     return (
//         <form onSubmit={handleSubmit}>
//             <div>
//                 <label>Event Name:</label>
//                 <input
//                     type="text"
//                     value={eventName}
//                     onChange={(e) => setEventName(e.target.value)}
//                     required
//                 />
//             </div>

//             <div>
//                 <label>Event Type:</label>
//                 <select
//                     value={eventType}
//                     onChange={(e) => setEventType(e.target.value)}
//                     required
//                 >
//                     <option value="">Select event type</option>
//                     <option value="Safety Alerts">Safety Alerts</option>
//                     <option value="Local Events">Local Events</option>
//                     <option value="Outdoor Activities">Outdoor Activities</option>
//                     <option value="Volunteer">Volunteer</option>
//                     <option value="Health">Health</option>
//                     <option value="Family & Kids">Family & Kids</option>
//                     <option value="Networking">Networking</option>
//                     <option value="Other">Other</option>
//                 </select>
//             </div>

//             <div>
//                 <label>Location:</label>
//                 <input
//                     id="pac-input"
//                     ref={inputRef}
//                     type="text"
//                     placeholder="Enter a location"
//                     value={location}
//                     onChange={(e) => setLocation(e.target.value)}
//                     required
//                     style={{ width: '400px', maxWidth: '100%' }}
//                 />
//             </div>

//             <div>
//                 <label>Start Time:</label>
//                 <input
//                     type="datetime-local"
//                     value={startTime}
//                     onChange={(e) => setStartTime(e.target.value)}
//                     required
//                 />
//             </div>

//             <div>
//                 <label>End Time (Optional):</label>
//                 <input
//                     type="datetime-local"
//                     value={endTime}
//                     onChange={(e) => setEndTime(e.target.value)}
//                 />
//             </div>

//             <div>
//                 <label>Picture (Optional):</label>
//                 <input
//                     type="file"
//                     accept="image/*"
//                     onChange={(e) => setPicture(e.target.files[0])}
//                 />
//             </div>

//             <div>
//                 <label>Description (Optional):</label>
//                 <textarea
//                     value={description}
//                     onChange={(e) => setDescription(e.target.value)}
//                 />
//             </div>

//             <button type="submit">Create Announcement</button>
//             <button type="button" onClick={() => navigate("/home")}>
//                 Back to Home
//             </button>
//         </form>
//     );
// };

// export default CreateAnnouncement;
