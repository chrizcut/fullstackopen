require('dotenv').config()

const express = require('express')
const app = express()
app.use(express.json())

app.use(express.static('dist'))

// let persons = [
//     { 
//       "id": "1",
//       "name": "Arto Hellas", 
//       "number": "040-123456"
//     },
//     { 
//       "id": "2",
//       "name": "Ada Lovelace", 
//       "number": "39-44-5323523"
//     },
//     { 
//       "id": "3",
//       "name": "Dan Abramov", 
//       "number": "12-43-234345"
//     },
//     { 
//       "id": "4",
//       "name": "Mary Poppendieck", 
//       "number": "39-23-6423122"
//     }
// ]

const Person = require('./models/person')

app.get('/info', (request, response) => {
  Person.countDocuments()
    .then(count => {
      response.send(`
        <p>Phonebook has info for ${count} people</p>
        <p>${new Date()}</p>
      `);
    })
})

app.get('/api/persons', (request, response) => {
  Person.find({}).then(persons => response.json(persons)
  )
})

app.get('/api/persons/:id', (request, response) => {
  Person.findById(request.params.id).then(person => response.json(person))
})

app.delete('/api/persons/:id', (request, response) => {
  const id = request.params.id
  persons = persons.filter(person => person.id !== id)

  response.status(204).end()
})

// const generateId = () => {
// //   const maxId = persons.length > 0
// //     ? Math.max(...persons.map(n => Number(n.id)))
// //     : 0
// //   return String(maxId + 1)
//     return Number.parseInt(Math.random()*1_000_000).toString()
// }

app.post('/api/persons', (request, response) => {
  const body = request.body

  if (!body.name||!body.name) {
    return response.status(400).json({ 
      error: 'Name or number missing' 
    })
  }

  // if (persons.find(person=>person.name===body.name)){
  //   return response.status(400).json({
  //       error:'Name already exists'
  //   })
  // }

  const person = new Person({
    name: body.name,
    number: body.number,
  })

  person.save().then(savedPerson=>
    response.json(savedPerson)
  )
})

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})