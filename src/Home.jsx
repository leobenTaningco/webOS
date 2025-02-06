import React, { useState, useEffect } from "react";
import {Link} from "react-router-dom";
import "./home.css"; // Assuming home.css is in the same directory
import Weather from "./homeApps/Weather.jsx";

const Home = () => {
    const [isMenuActive, setMenuActive] = useState(false);
    const [isWeatherActive, setWeatherActive] = useState(false);
    const [dateTime, setDateTime] = useState(new Date());

    // Toggle menu visibility
    const handleTaskbarClick = () => {
        setMenuActive(!isMenuActive);
    };

    const handleWeatherClick = () => {
        setWeatherActive(!isWeatherActive);
    };

    const handleWeatherClose = () => {
        setWeatherActive(!isWeatherActive);
    };

    // Get date and time
    useEffect(() => {
        const timer = setInterval(() => {
          setDateTime(new Date());
        }, 1000); // Update every 1 second
    
        // When not rendered, it stops the clock, saving memory
        return () => clearInterval(timer);
    }, []);
    
    const formattedTime = `${dateTime.toLocaleTimeString()} `;
    const formattedDate = `${dateTime.toLocaleDateString()}`;

    return (
    <div>
        <div className="bg">
            <div className="bg-card-weather" onClick={handleWeatherClick}></div>
            {isWeatherActive && <Weather onClose={handleWeatherClose}/>}
            <div className="bg-card">lore</div>
            <div className="bg-card">lore</div>
        </div>
        <div className="taskbar">
            <div
            className="taskbar-start"
            onClick={handleTaskbarClick}
            >
                <div className={`home-menu ${isMenuActive ? "active" : ""}`}>
                    {isMenuActive && ( // If true, it renders everything inside this parenthesis
                        <div className="footer-menu">
                        <Link to="/" className="logout"></Link>
                        <div className="user-pic"></div>
                        <div className="user-name">Yzowe</div>
                        </div>
                    )}    
                </div>
            </div>
            <div
            className="taskbar-time"
            >   
                GMT+8<br></br>
                {formattedTime}
                {formattedDate}
            </div>

        </div>
    </div>
    );
};

export default Home;
