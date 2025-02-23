import React, { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom"; 
import { MarkerClusterer } from "@googlemaps/markerclusterer";

const Map = ({ announcements, userLocation }) => {
    const mapRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        if (!window.google) {
            console.error("Google Maps API not loaded");
            return;
        }

        if (
            !userLocation || 
            !isFinite(userLocation.latitude) || 
            !isFinite(userLocation.longitude)
        ) {
            console.error('Invalid user location:', userLocation);
            return;
        }

        const center = {
            lat: parseFloat(userLocation.latitude),
            lng: parseFloat(userLocation.longitude),
        };

        const map = new window.google.maps.Map(mapRef.current, {
            center,
            zoom: 10,
        });

        const markers = announcements.map((announcement) => {
            const lat = parseFloat(announcement.latitude);
            const lng = parseFloat(announcement.longitude);

            if (!isNaN(lat) && !isNaN(lng)) {
                const marker = new window.google.maps.Marker({
                    position: { lat, lng },
                    title: announcement.eventName,
                });

                const infoWindow = new window.google.maps.InfoWindow({
                    content: `<h3>${announcement.eventName}</h3><p>${announcement.eventType}</p>`,
                });

                marker.addListener("click", () => {
                    infoWindow.open(map, marker);
                });

                return marker;
            } else {
                console.error(`Invalid coordinates for announcement ${announcement.eventName}:`, lat, lng);
                return null;
            }
        }).filter(marker => marker !== null);

        new MarkerClusterer({ markers, map });
    }, [announcements, userLocation]);

    return (
        <div>
            <button 
                onClick={() => navigate("/")} 
                style={{ margin: "10px", padding: "8px 12px", cursor: "pointer" }}
            >
                Back
            </button>
            <div ref={mapRef} style={{ height: "500px", width: "100%" }} />
        </div>
    );
};

export default Map;