import React, {useEffect, useState} from "react";
import "./weather.css";

const Weather = () => {
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
                <div className="app-open-close">
                </div>
                <input className="city-input"
                    type="text"
                    placeholder="Enter city"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                />
                <div className ="city-button" 
                onClick={fetchWeather}>
                    wuwu
                </div>
                <h1>uwu</h1>
            </div>
    );
};

export default Weather;