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
  const [message, setMessage] = useState([null,null])

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
            setMessage([`${newName}'s number has been modified.`,"confirmation"])
            setTimeout(() => {
              setMessage([null,null])
            }, 5000)

            setPersons(persons.map(person => person.id === id ? updatedPerson : person))
            setNewName('')
            setNewNumber('')
          })
          .catch(() => {
            setMessage([`${newName} is not on the server anymore.`,"error"])
            setTimeout(() => {
              setMessage([null,null])
            }, 5000)
            
            setPersons(persons.filter(person=>person.id!==id))
          })
      }
    } else {
      personService
        .create(newPerson)
        .then(returnedPerson => {
          setMessage([`${newName} has been added to the phonebook.`,"confirmation"])
          setTimeout(() => {
            setMessage([null,null])
          }, 5000)

          setPersons(persons.concat(returnedPerson))
          setNewName('')
          setNewNumber('')
        })
        .catch(error => {
          console.log(error.response.data.error)
          setMessage([error.response.data.error,"error"])
          setTimeout(() => {
            setMessage([null,null])
          }, 5000)
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
        .then(result=>{
          console.log(result)
          setPersons(persons.filter(person=>person.id!==id))
          setMessage([`${namePerson} has been deleted from the phonebook.`,"confirmation"])
          setTimeout(() => {
            setMessage([null,null])
          }, 5000)
      })
    }
  }

  return (
    <div>
      <Notification message={message[0]} type={message[1]}/>
      <h1>Test phonebook</h1>
        <Filter value={value} action={handleSearch}/>
      <h2>Add new</h2>
        <PersonForm action={addPerson} newName={newName} actionName={handleNameAddition} newNumber={newNumber} actionNumber={handleNumberAddition}/>
      <h2>Numbers</h2>
        <Persons persons={filteredPersons} deletePerson={deletePerson}/>
    </div>
  )
}

export default App