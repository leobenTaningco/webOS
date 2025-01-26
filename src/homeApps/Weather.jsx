import React, {useEffect, useState} from "react";
import "./weather.css";

const Weather = () => {
    const [weatherData, setWeatherData] = useState(null);
    const [city, setCity] = useState("");

    let uwu = 1;
    const fetchWeather = async () => {
        try{
            const apiKey = import.meta.env.VITE_API_KEY_WEATHER;
            const url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;
            const response = await fetch(url);
            setWeatherData(await response.json());
            console.log(weatherData);  
        }catch(error){
            console.log("tangina gago",error);
            
        }

    }

    return (
        <div className="app-open">
                <div className="app-open-close" onClick={fetchWeather}>
                </div>
                <input className="city-input"
                    type="text"
                    placeholder="Enter city"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                />
                <h1>wuwu</h1>
                <h1>uwu</h1>
            </div>
    );
};

export default Weather;