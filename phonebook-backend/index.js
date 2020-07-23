require('dotenv').config()
const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')
// const { query } = require('express')
// const uniqueValidator = require('mongoose-unique-validator')
// const person = require('./models/person')
// const mongoose = require('mongoose')


app.use(cors())
app.use(express.json())
app.use(express.static('build'))


// const url = process.env.MONGODB_URI
// mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })

// const personSchema = new mongoose.Schema({
//   name: String,
//   number: String,
// })

// const Person = mongoose.model('Person', personSchema)

morgan.token('json', function getBody (req) {
  return JSON.stringify(req.body)
})

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :json', {
  skip: function(req) {return req.method !== 'POST'}
}))
app.use(morgan('tiny', {
  skip: function(req) {return req.method === 'POST'}
}))

// let persons = [
//     {
//       name: 'Arto Hellas',
//       number: '1234567',
//       id: 1,
//     },
//     {
//       name: 'Ada Lovelace',
//       number: '38282838652',
//       id: 2,
//     },
//     {
//       name: 'Dan Abramov',
//       number: '67290391',
//       id: 3,
//     },
//     {
//       name: 'Mary Poppendieck',
//       number: '8607310',
//       id: 4,
//     }
// ]


// app.get('/api/persons', (request, response) => {
//     response.json(persons)
// })
app.get('/api/persons', (request, response, next) => {
  Person.find({}).then(persons => {
    response.json(persons)
  }).catch(error => next(error))
})


app.get('/api/persons/:id', (request, response, next) => {
  Person.findById(request.params.id)
    .then(person => {
      if (person) {
        response.json(person)
      } else {
        response.status(404).end()
      }
    })
    .catch(error => next(error))
    // const id = Number(request.params.id)
    // const person = persons.find(person => person.id === id)
    // return person ? response.json(person) : response.status(404).end()
})

app.get('/info', (request, response) => {
  let num_persons
  Person.find({}).then(persons => {
    num_persons = persons.length
    const date = new Date()
    response.send(
      `<p>Phonebook has info for ${num_persons} people</p>
            <p>${date}</p>`)
  })
})

app.delete('/api/persons/:id', (request, response, next) => {
  // const id = Number(request.params.id)
  // persons = persons.filter(person => person.id !== id)
  // response.status(204).end()
  Person.findByIdAndRemove(request.params.id)
    .then(() => {
      response.status(204).end()
    })
    .catch(error => next(error))
})

app.post('/api/persons', (request, response, next) => {
  // const id = Math.floor((Math.random()*1000)+1)
  const body = request.body

  // console.log(body)
  if (!body.name) {
    return response.status(400).json({
      error: 'name is missing'
    })
  } else if (!body.number) {
    return response.status(400).json({
      error: 'number is missing'
    })
  }
  //   else if (persons.some(person => person.name === body.name)) {
  //     return response.status(409).json({
  //       error: 'name must be unique'
  //     })
  //   }

  const person = new Person({
    name: body.name,
    number: body.number,
  })
  // const person = {
  //     name: body.name,
  //     number: body.number,
  //     id: id,
  // }
  // persons = persons.concat(person)
  // console.log(persons)
  person.save().then(savedPerson => {
    response.json(savedPerson)
  })
    .catch(error => next(error))
    // response.json(person)
})

app.put('/api/persons/:id', (request, response, next) => {
  const body = request.body

  // const person = {
  //     name: body.name,
  //     number: body.number,
  // }

  //try using the below on july 22 :)?
  const person = new Person({
    name: body.name,
    number: body.number,
  })
  // Person.updateOne({_id: request.params.id }, {$set: person}, {new: true, runValidators: true})
  //     .then(updatedPerson => {
  //         console.log('updatedperson: ', updatedPerson)
  //         response.json(updatedPerson)
  //     })
  //     .catch(error => {
  //         // console.log(error)
  //         next(error)
  //     })

  //
  Person.findByIdAndUpdate(request.params.id, { number: person.number }, { runValidators: true, new: true })
    .then(updatedPerson => {
      // console.log('response: ', response.json(updatedPerson))
      // console.log('words')
      response.json(updatedPerson)
    })
    .catch(error => {
      // console.log(error)
      // console.log('stuff')
      next(error)
    })
})

const errorHandler = (error, request, response, next) => {
  console.log('error: ', error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformmated id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).send({ error: 'a validation error occured' })
  }

  next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})