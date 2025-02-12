import React, { useEffect, useState, useRef } from "react";
import "./weather.css";

const Weather = ({ onClose }) => {
    const [weatherData, setWeatherData] = useState(null);
    const [city, setCity] = useState("Manila");
    const appOpenRef = useRef(null); // Attached to the app-open div
    const isDragging = useRef(false);
    const offset = useRef({ x: 0, y: 0 });

    const fetchWeather = async () => {
        try {
            const apiKey = import.meta.env.VITE_API_KEY_WEATHER;
            const url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;
            const response = await fetch(url);
            setWeatherData(await response.json());
        } catch (error) {
            console.error("Error fetching weather:", error);
        }
    };

    useEffect(() => {
        if (weatherData) {
            console.log(weatherData);
        }
    }, [weatherData]);

    // Stores the original position of the mouse
    const handleMouseDown = (e) => {
        isDragging.current = true;
        offset.current = {
            // Mouse position in the viewport - div's position in the viewport(specifically the top & left corners)
            x: e.clientX - appOpenRef.current.getBoundingClientRect().left,
            y: e.clientY - appOpenRef.current.getBoundingClientRect().top,
        };
        console.log("handleMouseDown")
        console.log(offset.current.x)// Counts px from the div itself
        console.log(offset.current.y)
        console.log(e.clientX +"-" + appOpenRef.current.getBoundingClientRect().left,)
        console.log(e.clientY +"-" + appOpenRef.current.getBoundingClientRect().top,)
    };

    // Same formula but now uses the stored values from handleMouseDown
    const handleMouseMove = (e) => {
        if (!isDragging.current) return;
        const newX = e.clientX - offset.current.x;
        const newY = e.clientY - offset.current.y;
        appOpenRef.current.style.left = `${newX}px`; // So it counts px from the div itself
        appOpenRef.current.style.top = `${newY}px`;
        console.log("handleMouseMove")
        console.log(newX)
        console.log(newY)
        console.log(e.clientX +"-" + offset.current.x)
        console.log(e.clientY +"-" + offset.current.x)
    };

    const handleMouseUp = () => {
        isDragging.current = false;
    };

    useEffect(() => {
        window.addEventListener("mousemove", handleMouseMove);
        window.addEventListener("mouseup", handleMouseUp);
        return () => {
            window.removeEventListener("mousemove", handleMouseMove);
            window.removeEventListener("mouseup", handleMouseUp);
        };
    }, []);

    return (
        <div ref={appOpenRef} className="app-open" onMouseDown={handleMouseDown}>
            <div className="app-open-close" onClick={onClose}></div>
            <div className="app-move"></div>
            <div className="city-input-block">
                <input
                    className="city-input"
                    type="text"
                    placeholder="Enter city"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                />
                <div className="city-button" onClick={fetchWeather}>
                    Set city
                </div>
            </div>

            {weatherData && weatherData.main && (
                <div className="weather-info">
                    <h2>
                        {weatherData.name}, {weatherData.sys?.country}
                    </h2>
                    <p>🌡 Temperature: {(weatherData.main?.temp - 273.15).toFixed(2)}°C</p>
                    <p>☁ Condition: {weatherData.weather?.[0]?.description}</p>
                    <p>💨 Humidity: {weatherData.main?.humidity}%</p>
                </div>
            )}
        </div>
    );
};

export default Weather;
