require('dotenv').config()

const express = require('express')
const app = express()
app.use(express.json())

app.use(express.static('dist'))

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

app.get('/api/persons/:id', (request, response,next) => {
  Person.findById(request.params.id)
    .then(person => {
      if (person) {
        response.json(person)
      } else {
        response.status(404).end()
      }
    })
    .catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response,next) => {
  Person.findByIdAndDelete(request.params.id)
  .then(result => response.status(204).end())
  .catch(error => next(error))
})

// const generateId = () => {
// //   const maxId = persons.length > 0
// //     ? Math.max(...persons.map(n => Number(n.id)))
// //     : 0
// //   return String(maxId + 1)
//     return Number.parseInt(Math.random()*1_000_000).toString()
// }

app.post('/api/persons', (request, response, next) => {
  const body = request.body

  if (!body.name||!body.name) {
    return response.status(400).json({ 
      error: 'Name or number missing' 
    })
  }

  const person = new Person({
    name: body.name,
    number: body.number,
  })

  person.save()
    .then(savedPerson=>
      response.json(savedPerson)
    )
    .catch(error=>next(error))
})

app.put('/api/persons/:id', (request, response, next) => {
  const { name, number } = request.body

  Person.findById(request.params.id)
    .then(person => {
      if (!person) {
        return response.status(404).end()
      }

      person.name = name
      person.number = number

      return person.save().then((updatedPerson) => {
        response.json(updatedPerson)
      })
    })
    .catch(error => next(error))
})

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'Malformatted id' })
  }  else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }

  next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})