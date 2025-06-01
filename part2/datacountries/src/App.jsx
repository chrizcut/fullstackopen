import { useState, useEffect } from 'react'
import axios from 'axios'
const api_key = import.meta.env.VITE_SOME_KEY

const Results = ({results, toggleDetails}) => {
  if (typeof results==="string") {
    return <p> {results} </p>
  }

  if (results===null)
    return null

  if (results.length>1) {
    return results.map(country=>{
      const indexCountry = results.indexOf(results.filter(pays=>country.name.common===pays.name.common)[0])
    
      if (country.showDetails===false){
        return (
          <p key={country.name.common}>
            {country.name.common}
            <button onClick={()=>toggleDetails(indexCountry)}>Show details</button>
          </p>
        )
      } else {
        return (
          <div key={country.name.common}>
            <p>
              {country.name.common}
              <button onClick={()=>toggleDetails(indexCountry)}>Hide details</button>
            </p>
            <h2>Capital</h2>
            <p>{country.capital[0]}</p>
            <h2>Area</h2>
            <p>{country.area}</p>
            <h2>Languages</h2>
            <ul>
              {Object.values(country.languages).map(language=><li key={language}>{language}</li>)}
            </ul>
            <h2>Flag</h2> 
            <img src={country.flags.png}/>
            <h2>Weather in {country.capital[0]}</h2>
            <p>
              Temperature: {country.temperature} °C
            </p>
            <img src={`https://openweathermap.org/img/wn/${country.weatherIcon}@2x.png`}/>
            <p>
              Wind speed: {country.windSpeed} m/s
            </p>
          </div>
        )
      }
    })
  }

  if (results.length===1) {
    console.log(results,results[0].showDetails)
    return (
      <div>
        <h1>{results[0].name.common}</h1>
          <h2>Capital</h2>
          <p>{results[0].capital[0]}</p>
          <h2>Area</h2>
          <p>{results[0].area}</p>
          <h2>Languages</h2>
          <ul>
            {Object.values(results[0].languages).map(language=><li key={language}>{language}</li>)}
          </ul>
          <h2>Flag</h2> 
          <img src={results[0].flags.png}/>
          <h2>Weather in {results[0].capital[0]}</h2>
            <p>
              Temperature: {results[0].temperature} °C
            </p>
            <img src={`https://openweathermap.org/img/wn/${results[0].weatherIcon}@2x.png`}/>
            <p>
              Wind speed: {results[0].windSpeed} m/s
            </p>
      </div>
    )
  }

}

const App = () => {
  const [value, setValue] = useState('')
  const [results, setResults] = useState(null)

  useEffect(()=>{
    if (results && typeof results!=="string"){
      const resultsUpdated = results
      

    }
  },[results])

  useEffect(() => {
    if (value) {
      axios
        .get(`https://studies.cs.helsinki.fi/restcountries/api/all`)
        .then(response => {
          const listMatchingCountries = response.data.filter(country=>country.name.common.toLowerCase().includes(value.toLowerCase()))
          // console.log(listMatchingCountries)
          if (listMatchingCountries.length>10){
            setResults("Too many matches. Specify another filter.")
          } else {
            
            for (let country of listMatchingCountries){
              axios
                .get(`http://api.openweathermap.org/geo/1.0/direct?q=${country.capital[0]}&appid=${api_key}`)
                .then(response => {
                  const lat = response.data[0].lat
                  const lon = response.data[0].lon
                  axios
                    .get(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${api_key}&units=metric`)
                    .then(response => {
                      country.showDetails=false
                      country.temperature = response.data.main.temp
                      country.weatherIcon = response.data.weather[0].icon
                      country.windSpeed = response.data.wind.speed
                    })
                })
            }
            setTimeout(()=>setResults(listMatchingCountries),1000)
            
          }
        })
    } else {
      setResults('')
    }
  }, [value])

  const handleChange = (event) => {
    setValue(event.target.value)
  }

  const toggleDetails = (index) => {
    const changedCountry={...results[index],showDetails:!results[index].showDetails}
    const newResults = [...results]
    newResults[index] = changedCountry
    setResults(newResults)
  }

  return (
    <div>
      <p>
        Find countries: 
        <input value={value} onChange={handleChange} />
      </p>
      <Results results={results} toggleDetails={toggleDetails}/>
    </div>
  )
}

export default App