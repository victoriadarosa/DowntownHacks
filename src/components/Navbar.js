import React from "react";
import { NavLink } from "react-router-dom";
import "../index.css";

const NavBar = ({user, onLogout}) => {
    return (
        <nav className="nav">
            <NavLink to="/home" className="site-title">Home</NavLink>
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
                <li>
                    <button onClick={onLogout} className="logout-button">
                        Logout
                    </button>
                </li>
            </ul>
        </nav>
    );
};

export default NavBar;
