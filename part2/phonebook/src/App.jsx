import { useState, useEffect } from 'react'
import personService from './services/persons'
import './index.css'

const Filter = (props) => (
  <div>
    Filter names: <input onChange={props.action}/>
  </div>
)

const PersonForm = (props) => (
  <form onSubmit={props.action}>
    <div>
      name: <input value={props.newName} onChange={props.actionName}/>
    </div>
    <div>
      number: <input value={props.newNumber} onChange={props.actionNumber}/>
    </div>
    <div>
      <button type="submit">Add</button>
    </div>
  </form>
)

const Persons = ({persons,deletePerson}) => {
  return persons.map(person=><Person key={person.name} person={person} deletePerson={deletePerson}/>)
}

const Person = ({person,deletePerson}) => {
   return (<div>
    {person.name}: {person.number} <button onClick={() => deletePerson(person.id)}>delete</button>
  </div>)
}

const Notification = ({message, type}) => {
  if (message===null) return null

  return <div className={type}>
    {message}
  </div>
}


const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filteredPersons, setFilteredPersons] = useState([])
  const [confirmationMessage, setConfirmationMessage] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)

  useEffect(()=>{
    personService
      .getAll()
      .then(initialPersons =>{
        setPersons(initialPersons)
        setFilteredPersons(initialPersons)
    })
  },[])
  // console.log('render', persons.length, 'persons')

  const addPerson = (event) => {
    event.preventDefault()
    const listNames=persons.map(person=>person.name)

    const newPerson = {
      name:newName,
      number:newNumber
    }

    if (listNames.find(name=>name===newName)){
      if (window.confirm(`${newName} is already in the phonebook. Replace the old number with a new one?`)){
        const id = persons.filter(person=>person.name===newName)[0].id
        personService
          .update(id,newPerson)
          .then(updatedPerson=>{
            setConfirmationMessage(`${newName}'s number has been modified.`)
            setTimeout(() => {
              setConfirmationMessage(null)
            }, 5000)

            setPersons(persons.map(person => person.id === id ? updatedPerson : person))
            setFilteredPersons(persons.map(person => person.id === id ? updatedPerson : person))
          })
          .catch(error => {
            setErrorMessage(`${newName} is not on the server anymore.`)
            setTimeout(() => {
              setErrorMessage(null)
            }, 5000)
            
            setPersons(persons.filter(person=>person.id!==id))
            setFilteredPersons(persons.filter(person=>person.id!==id))
          })
      }
    } else {
      personService
        .create(newPerson)
        .then(returnedPerson => {
          setConfirmationMessage(`${newName} has been added to the phonebook.`)
          setTimeout(() => {
            setConfirmationMessage(null)
          }, 5000)

          setPersons(persons.concat(returnedPerson))
          setFilteredPersons(persons.concat(returnedPerson))
          setNewName('')
          setNewNumber('')
        })
      }
  }

  const handleNameAddition = (event) => {
    setNewName(event.target.value)
  }

  const handleNumberAddition = (event) => {
    setNewNumber(event.target.value)
  }

  const handleSearch = (event) => {
    const listMatchingPersons = persons.filter(person=>person.name.toLowerCase().indexOf(event.target.value.toLowerCase())>-1)
    // console.log(listMatchingPersons)
    setFilteredPersons(listMatchingPersons)
  }

  const deletePerson = (id) => {
    const namePerson = persons.filter(person=>person.id===id)[0].name
    if (window.confirm(`Delete ${namePerson}?`)) {
      personService
        .deletePerson(id)
        .then(deletedPerson=>{
          // console.log(deletedPerson)
          setPersons(persons.filter(person=>person.id!==id))
          setFilteredPersons(persons.filter(person=>person.id!==id))
      })
    }
  }

  return (
    <div>
      <Notification message={confirmationMessage} type="confirmation"/>
      <Notification message={errorMessage} type="error"/>
      <h1>Phonebook</h1>
        <Filter action={handleSearch}/>
      <h2>Add new</h2>
        <PersonForm action={addPerson} newName={newName} actionName={handleNameAddition} newNumber={newNumber} actionNumber={handleNumberAddition}/>
      <h2>Numbers</h2>
        <Persons persons={filteredPersons} deletePerson={deletePerson}/>
    </div>
  )
}

export default App