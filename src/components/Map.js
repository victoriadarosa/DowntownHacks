/**
 * This component displays a Google Map with markers representing announcements near the user's location.
 * The map is centered around the user's location, and markers are placed for valid announcements based 
 * on their geographical coordinates. It uses the Google Maps API and MarkerClusterer for efficient marker clustering.
 */

import React, { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom"; 
import { MarkerClusterer } from "@googlemaps/markerclusterer";

const Map = ({ announcements, userLocation }) => {
    const mapRef = useRef(null);

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

        const now = new Date();

        console.log("All Announcements:", announcements);

        const validAnnouncements = announcements.filter((announcement) => {
            const startTime = new Date(announcement.startTime);
            const endTime = announcement.endTime ? new Date(announcement.endTime) : null;

            if (endTime && endTime < now) {
                return false;
            }

            if (!endTime && now - startTime > 24 * 60 * 60 * 1000) {
                return false;
            }

            return true;
        });

        console.log("Valid Announcements:", validAnnouncements);

        const center = {
            lat: parseFloat(userLocation.latitude),
            lng: parseFloat(userLocation.longitude),
        };

        const map = new window.google.maps.Map(mapRef.current, {
            center,
            zoom: 10,
        });

        const userMarker = new window.google.maps.Marker({
            position: center,
            title: "Your Location",
            icon: {
                url: "/images/user.png", //blue marker icon
                scaledSize: new window.google.maps.Size(40, 40),
            },
            map,
        });

        const markers = validAnnouncements.map((announcement) => {
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
            {/* Remove the Back button */}
            <div ref={mapRef} style={{ height: "500px", width: "100%" }} />
        </div>
    );
};

export default Map;
