import { useState, useEffect } from 'react'
import personService from './services/persons'
import './index.css'
import Filter from './components/Filter'
import PersonForm from './components/PersonForm'
import Persons from './components/Persons'
import Notification from './components/Notification'


const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [value, setValue] = useState('')
  const [confirmationMessage, setConfirmationMessage] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)

  useEffect(()=>{
    personService
      .getAll()
      .then(initialPersons =>{
        setPersons(initialPersons)
    })
  },[])
  // console.log('render', persons.length, 'persons')

  const filteredPersons = persons.filter(person=>person.name.toLowerCase().indexOf(value.toLowerCase())>-1)

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
          })
          .catch(error => {
            setErrorMessage(`${newName} is not on the server anymore.`)
            setTimeout(() => {
              setErrorMessage(null)
            }, 5000)
            
            setPersons(persons.filter(person=>person.id!==id))
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
    setValue(event.target.value)
  }

  const deletePerson = (id) => {
    const namePerson = persons.filter(person=>person.id===id)[0].name
    if (window.confirm(`Delete ${namePerson}?`)) {
      personService
        .deletePerson(id)
        .then(deletedPerson=>{
          // console.log(deletedPerson)
          setPersons(persons.filter(person=>person.id!==deletedPerson.id))
      })
    }
  }

  return (
    <div>
      <Notification message={confirmationMessage} type="confirmation"/>
      <Notification message={errorMessage} type="error"/>
      <h1>Phonebook</h1>
        <Filter value={value} action={handleSearch}/>
      <h2>Add new</h2>
        <PersonForm action={addPerson} newName={newName} actionName={handleNameAddition} newNumber={newNumber} actionNumber={handleNumberAddition}/>
      <h2>Numbers</h2>
        <Persons persons={filteredPersons} deletePerson={deletePerson}/>
    </div>
  )
}

export default App