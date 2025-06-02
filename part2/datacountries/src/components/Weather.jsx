import { useState, useEffect } from 'react'
import axios from 'axios'

const api_key = import.meta.env.VITE_SOME_KEY

const Weather = ({country}) => {

    const [weather, setWeather] = useState([])

    useEffect(()=>{
        axios
        .get(`https://api.openweathermap.org/data/2.5/weather?lat=${country.capitalInfo.latlng[0]}&lon=${country.capitalInfo.latlng[1]}&appid=${api_key}&units=metric`)
        .then(response => {
            setWeather([response.data.main.temp, response.data.weather[0].icon, response.data.wind.speed])
        })
    },[])

    return (
        <div>
            <h2>Weather in {country.capital[0]}</h2>
                <p>
                    Temperature: {weather[0]} °C
                </p>
                <img src={`https://openweathermap.org/img/wn/${weather[1]}@2x.png`}/>
                <p>
                    Wind speed: {weather[2]} m/s
                </p> 
        </div>
    )
}



export default Weather