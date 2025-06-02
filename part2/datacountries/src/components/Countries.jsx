import Weather from "./Weather"

const Countries = ({countries, toggleDetails}) => {
  if (countries===null)
    return null
  
  if (countries.length>10) {
    return <p> Too many matches. Specify another filter. </p>
  }

  if (countries.length>1) {
    return countries.map(country=>{
    
      if (country.showDetails===false){
        return (
          <p key={country.name.common}>
            {country.name.common}
            <button onClick={()=>toggleDetails(country.cca2)}>Show details</button>
          </p>
        )
      } else {
        return (
          <div key={country.name.common}>
            <p>
              {country.name.common}
              <button onClick={()=>toggleDetails(country.cca2)}>Hide details</button>
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
            <Weather country={country}/>
          </div>
        )
      }
    })
  }

  if (countries.length===1) {
    return (
      <div>
        <h1>{countries[0].name.common}</h1>
          <h2>Capital</h2>
          <p>{countries[0].capital[0]}</p>
          <h2>Area</h2>
          <p>{countries[0].area}</p>
          <h2>Languages</h2>
          <ul>
            {Object.values(countries[0].languages).map(language=><li key={language}>{language}</li>)}
          </ul>
          <h2>Flag</h2> 
          <img src={countries[0].flags.png}/>
          <Weather country={countries[0]}/>
      </div>
    )
  }

  if (countries.length===0) {
    return <div>No matches, please try another search</div>
  }

}

export default Countries