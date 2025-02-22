import React, { useState, useEffect, useRef } from "react";

const CreateAnnouncement = () => {
    const inputRef = useRef(null);

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

            new window.google.maps.places.Autocomplete(inputRef.current, options);
        }
    }, []);

    return <input id="pac-input" ref={inputRef} type="text" placeholder="Enter a location" />;
};

export default CreateAnnouncement;



// var options = {
//     types: ['(cities)']
//   }
  
// var input1 = document.getElementById("from");
// var autocomplete1 = new google.maps.places.Autocomplete(input1, options)
  

// import React, { useState, useEffect } from "react";

// const loadGooglePlaces = (callback) => {
//   // Check if Google Maps API is already loaded
//   if (window.google && window.google.maps && window.google.maps.places) {
//     callback(window.google.maps);
//     return;
//   }

//   // Check if the script is already in the DOM to avoid multiple loads
//   if (document.querySelector("script[src*='maps.googleapis.com']")) {
//     document
//       .querySelector("script[src*='maps.googleapis.com']")
//       .addEventListener("load", () => {
//         if (window.google && window.google.maps && window.google.maps.places) {
//           callback(window.google.maps);
//         }
//       });
//     return;
//   }

//   // Create and load the Google Maps script
//   const script = document.createElement("script");
//   script.src = `https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&libraries=places`;
//   script.async = true;
//   script.defer = true;
//   script.onload = () => {
//     if (window.google && window.google.maps && window.google.maps.places) {
//       callback(window.google.maps);
//     } else {
//       console.error("Google Maps API failed to load.");
//     }
//   };

//   document.body.appendChild(script);
// };

// const CreateAnnouncement = () => {
//   const [location, setLocation] = useState("");

//   useEffect(() => {
//     loadGooglePlaces((google) => {
//       if (!google || !google.maps || !google.maps.places) {
//         console.error("Google Maps API is not available.");
//         return;
//       }

//       setTimeout(() => {
//         const input = document.getElementById("location-input");
//         if (!input) {
//           console.error("Location input field not found.");
//           return;
//         }

//         const autocomplete = new google.maps.places.Autocomplete(input, {
//           types: ["geocode"],
//         });

//         autocomplete.addListener("place_changed", () => {
//           const place = autocomplete.getPlace();
//           if (place && place.formatted_address) {
//             setLocation(place.formatted_address);
//           }
//         });
//       }, 1000); // Adding a slight delay
//     });
//   }, []);

//   const handleSubmit = (event) => {
//     event.preventDefault();
//     alert(`Announcement created for location: ${location}`);
//   };

//   return (
//     <div>
//       <h2>Create Announcement</h2>
//       <form onSubmit={handleSubmit}>
//         <label>
//           Location:
//           <input
//             type="text"
//             id="location-input"
//             value={location}
//             onChange={(e) => setLocation(e.target.value)}
//             placeholder="Enter a location"
//           />
//         </label>
//         <button type="submit">Submit</button>
//       </form>
//     </div>
//   );
// };

// export default CreateAnnouncement;
