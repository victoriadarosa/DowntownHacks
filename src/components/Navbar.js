import React from "react";
import { NavLink } from "react-router-dom";
import "../index.css";

export default function NavBar() {
    return (
        <nav className="nav">
            <NavLink to="/home" className="site-title">Site Name</NavLink>
            <ul>
                <li>
                    <NavLink to="/create-announcement" className={({ isActive }) => isActive ? "active" : ""}>
                        Create Announcement
                    </NavLink>
                </li>
                <li>
                    <NavLink to="/map" className={({ isActive }) => isActive ? "active" : ""}>
                        Map
                    </NavLink>
                </li>
            </ul>
        </nav>
    );
}
