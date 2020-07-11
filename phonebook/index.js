const express = require('express')
const app = express()
const morgan = require('morgan')

app.use(express.json())
// app.use(morgan('tiny'))

morgan.token('json', function getBody (req) {
    return JSON.stringify(req.body)
})


app.use(morgan(':method :url :status :res[content-length] - :response-time ms :json'))

// morgan.token('json', function getJSON(request,response) {
//     response.json(person)
// })


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

app.get('/api/persons', (request, response) => {
    response.json(persons)
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
    const id = Math.floor((Math.random()*1000)+1)
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

    const person = {
        name: body.name,
        number: body.number,
        id: id,
    }
    
    persons = persons.concat(person)
    // console.log(persons)
    response.json(person)
})

const PORT = 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})