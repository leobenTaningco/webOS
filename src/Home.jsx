import React, { useState, useEffect } from "react";
import {Link} from "react-router-dom";
import "./home.css"; // Assuming home.css is in the same directory

const Home = () => {
    const [isMenuActive, setMenuActive] = useState(false);
    const [dateTime, setDateTime] = useState(new Date());

    // Toggle menu visibility
    const handleTaskbarClick = () => {
    setMenuActive(!isMenuActive);
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

    return (
    <div>
        <div className="bg"></div>
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
                <div className="time-date">
                    {formattedTime}
                </div>
            </div>

        </div>
    </div>
    );
};

export default Home;
