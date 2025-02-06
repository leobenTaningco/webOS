import React, {useEffect, useState} from "react";
import "./weather.css";

const Weather = ({onClose}) => {
    const [weatherData, setWeatherData] = useState(null);
    const [city, setCity] = useState("Manila");

    const fetchWeather = async () => {
        try{
            const apiKey = import.meta.env.VITE_API_KEY_WEATHER;
            console.log(city);
            const url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;
            console.log(url);
            const response = await fetch(url);
            setWeatherData(await response.json());
        }catch(error){
            console.log("tangina gago",error);
        }
    }

    useEffect(() => {
        if (weatherData) {
            console.log(weatherData);
        }
    }, [weatherData]); 

    return (
        <div className="app-open">
            <div className="app-open-close" onClick={onClose}></div>
            <div className="city-input-block">
            <input className="city-input"
                type="text"
                placeholder="Enter city"
                value={city}
                onChange={(e) => setCity(e.target.value)}
            />
            <div className ="city-button" onClick={fetchWeather}>Set city</div>
            </div>
            
            {weatherData && weatherData.main && (
                <div className="weather-info">
                    <h2>{weatherData.name}, {weatherData.sys?.country}</h2>
                    <p>🌡 Temperature: {(weatherData.main?.temp - 273.15).toFixed(2)}°C</p> {/* toFixed means 2 dec places */}
                    <p>☁ Condition: {weatherData.weather?.[0]?.description}</p>
                    <p>💨 Humidity: {weatherData.main?.humidity}%</p>
                </div>
            )}

        </div>
    );
};

export default Weather;