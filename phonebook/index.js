const express = require('express')
const app = express()

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

const PORT = 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})