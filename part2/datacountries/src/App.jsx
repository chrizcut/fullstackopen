import { useState, useEffect } from 'react'
import axios from 'axios'
import Countries from './components/Countries'

const api_key = import.meta.env.VITE_SOME_KEY

const App = () => {
  const [value, setValue] = useState('')
  const [countries, setCountries] = useState([])

  useEffect(()=>{
    axios
      .get(`https://studies.cs.helsinki.fi/restcountries/api/all`)
      .then(response => {
        const listCountries=response.data
        setCountries(listCountries.map(country=>({...country,showDetails:false})))
      })
  },[])

  const filteredCountries = countries.filter(country=>country.name.common.toLowerCase().includes(value.toLowerCase()))      

  const handleChange = (event) => {
    setValue(event.target.value)
  }

  const toggleDetails = (cc) => {
    const chosenCountry = countries.filter(country=>country.cca2===cc)[0]
    const indexCountry = countries.indexOf(chosenCountry)
    const changedCountry={...chosenCountry,showDetails:!chosenCountry.showDetails}
    const newCountries = [...countries]
    newCountries[indexCountry] = changedCountry
    setCountries(newCountries)
  }

  return (
    <div>
      <p>
        Find countries: 
        <input value={value} onChange={handleChange} />
      </p>
      <Countries countries={filteredCountries} toggleDetails={toggleDetails}/>
    </div>
  )
}

export default App