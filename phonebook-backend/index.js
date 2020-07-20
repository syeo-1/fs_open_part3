require('dotenv').config()
const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')
// const mongoose = require('mongoose')


app.use(cors())
app.use(express.json())


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
    skip: function(req, res) {return req.method !== "POST"}
}))
app.use(morgan('tiny', {
    skip: function(req, resp) {return req.method === "POST"}
}))

let persons = [
    {
      name: 'Arto Hellas',
      number: "1234567",
      id: 1,
    },
    {
      name: 'Ada Lovelace',
      number: "38282838652",
      id: 2,
    },
    {
      name: 'Dan Abramov',
      number: "67290391",
      id: 3,
    },
    {
      name: 'Mary Poppendieck',
      number: "8607310",
      id: 4,
    }
]

// app.get('/api/persons', (request, response) => {
//     response.json(persons)
// })
app.get('/api/persons', (request, response) => {
    Person.find({}).then(persons => {
        response.json(persons)
    }).catch(error => console.log(error))
})


app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find(person => person.id === id)
    return person ? response.json(person) : response.status(404).end()
})

app.get('/info', (request, response) => {
    const num_persons = persons.length
    const date = new Date()
    response.send(
        `<p>Phonebook has info for ${num_persons} people</p>
        <p>${date}</p>`
        )
})

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(person => person.id !== id)
    response.status(204).end()
})

app.post('/api/persons', (request, response) => {
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
    } else if (persons.some(person => person.name === body.name)) {
        return response.status(409).json({
            error: 'name must be unique'
        })
    }

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
    // response.json(person)
})

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})