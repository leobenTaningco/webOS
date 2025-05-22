import React, { useState, useEffect } from "react";
import {Link} from "react-router-dom";
import "./home.css"; // Assuming home.css is in the same directory
import Weather from "./homeApps/Weather.jsx";
import AStarVisualization from "./homeApps/AStarVisualization.jsx";
import AStarMap from "./homeApps/AStarMap.jsx";

const Home = () => {
    const [isMenuActive, setMenuActive] = useState(false);
    const [isWeatherActive, setWeatherActive] = useState(false);
    const [isAStarVisActive, setAStarVisActive] = useState(false);
    const [isAStarMapisActive, setAStarMapActive] = useState(false);
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

    const handleAStarVisClick = () => {
        setAStarVisActive(!isAStarVisActive);
        isAStarMapisActive && handleAStarMapClose();
    };

    const handleAStarVisClose = () => {
        setAStarVisActive(!isAStarVisActive);
    };

    const handleAStarMapClick = () => {
        setAStarMapActive(!isAStarMapisActive);
        isAStarVisActive && handleAStarVisClose();
    };

    const handleAStarMapClose = () => {
        setAStarMapActive(!isAStarMapisActive);
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
            {/*<div className="bg-card-weather" onClick={handleWeatherClick}></div>
            {isWeatherActive && <Weather onClose={handleWeatherClose}/>}*/}
            <div className="bg-card-astarvisualization" onClick={handleAStarVisClick}></div>
            {isAStarVisActive && <AStarVisualization onClose={handleAStarVisClose}/>}

            <div className="bg-card-astarmap" onClick={handleAStarMapClick}></div>
            {isAStarMapisActive && <AStarMap onClose={handleAStarMapClose}/>}
            {/*<div className="bg-card">lore</div> */}

            <div
            className="bg-card-github"
            onClick={() => window.open("https://github.com/leobenTaningco/webOS", "_blank")}
            ></div>
        </div>
        <div className="taskbar">
            <div
            className="taskbar-start"
            onClick={handleTaskbarClick}
            >
                <div className={`home-menu ${isMenuActive ? "active" : ""}`}>
                    {isMenuActive && ( // If true, it renders everything inside this parenthesis
                        <div className="footer-menu">
                        <Link to="/home" className="logout"></Link>
                        <div className="user-pic"></div>
                        <div className="user-name">Yzowe</div>
                        </div>
                    )}    
                </div>
            </div>
            <div
            className="taskbar-time"
            style={{"color": "white"}}
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
