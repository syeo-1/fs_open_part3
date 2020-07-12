import axios from 'axios'
const baseUrl = 'http://localhost:3001/persons'

const getAllPersons = () => {
    return axios.get(baseUrl)
}

const addPerson = newPerson => {
    return axios.post(baseUrl, newPerson)
}

const update = (id, newPerson) => {
    return axios.put(`${baseUrl}/${id}`, newPerson)
}
        
const deletePerson = (id) => {
    axios.delete(`${baseUrl}/${id}`)
}

export default {getAllPersons, addPerson, update, deletePerson}
        