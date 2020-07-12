import React, { useState, useEffect } from 'react'
import personService from './persons'
import '../index.css'

const Filter = ({searchString, handleSearchString}) => (
  <form>
    <div>
      filter shown with <input value={searchString} onChange={handleSearchString}/>
    </div>
  </form>
)

const PersonForm = ({addData, newName, newNumber, handleNewName, handleNewNumber}) => (
    <form onSubmit={addData}>
      <div>
        name: <input value={newName} onChange={handleNewName}/>
      </div>
      <div>
        number: <input value={newNumber} onChange={handleNewNumber}/>
      </div>
      <div>
        <button type="submit">add</button>
      </div>
    </form>
)

const Person = ({name, number, deletePrompt}) => (
  <li>{name} {number} <button onClick={deletePrompt}>delete</button></li>
)

const AddNotification = ({message}) => {
   if (message === null) {
     return null
   }

   return (
     <div className="add">
       {message}
     </div>
   )
}

const ErrorNotification = ({message}) => {
   if (message === null) {
     return null
   }

   return (
     <div className="error">
       {message}
     </div>
   )
}

const App = () => {
  const [ persons, setPersons ] = useState([]) 
  const [ newName, setNewName ] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filterNumbers, setFilterNumbers] = useState(true)
  const [searchString, setSearchString] = useState('')
  const [addMessage, setAddMessage] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)

  useEffect(() => {
    // console.log('effect')
    personService
      .getAllPersons()
      .then(response => {
        setPersons(response.data)
      })
  }, [])

  const addData = (event) => {
    event.preventDefault()
    const nameObject = {
      name: newName,
      number: newNumber,
    }

    // can't compare objects directly in JS!!!
    // can use JSON.stringify if you really want to use includes/some methods

    let alreadyInPersons = false
    for (let i = 0 ; i < persons.length ; i++) {      
      if (nameObject.name === persons[i].name) {
        alreadyInPersons = true
      }
    }

    if (!alreadyInPersons) {
      personService
        .addPerson(nameObject)
        .then(response => {setPersons(persons.concat(response.data))})
        .then(
          setAddMessage(`Added ${nameObject.name}`),
          setTimeout(() => {
            setAddMessage(null)
          }, 5000)
        )
    } else {
      if (window.confirm(`${nameObject.name} is already added to phonebook. Replace the old number with a new one?`)) {
        // console.log(persons);
        const idToUpdate = persons.find(person => person.name === nameObject.name).id
        // console.log(idToUpdate);
        personService.update(idToUpdate, nameObject)
          .then(response => {
            // console.log(response.data);
            setPersons(persons
              .map(person => person.id === idToUpdate ? response.data : person))
          })
          .catch(error => {
            setErrorMessage(
              `Information of ${nameObject.name} has already been removed from server`
            )
            setTimeout(() => {
              setErrorMessage(null)
            }, 5000)
            // console.log(error)
          })
      }
    }

    setNewName('')
    setNewNumber('')
  }
  
  const handleNewName = (event) => {
    // console.log(event.target.value);
    setNewName(event.target.value)
  }
  
  const handleNewNumber = (event) => {
    setNewNumber(event.target.value)
  }

  const handleSearchString = (event) => {
    // console.log(event.target.value);
    setSearchString(event.target.value)

    searchString.length === 0 ? setFilterNumbers(false) : setFilterNumbers(true)
    // console.log("persons to show", personsToShow);
  }
  
  const deletePrompt = (id, name) => {
    // console.log(person)
    if (window.confirm(`Delete ${name} ?`)) {
      personService.deletePerson(id)
      setPersons(persons.filter(person => person.id !== id))
    }

  }
  const personsToShow = filterNumbers 
    ? persons.filter(person => person.name.toLowerCase().includes(searchString))
    : persons 
  
  // be aware that var on left of equals (eg. searchString) is the prop var
  // and the value it is being set to is the searchString in App component
  return (
    <div>
      <h2>Phonebook</h2>
      <AddNotification message={addMessage}/>
      <ErrorNotification message={errorMessage}/>
      <Filter searchString={searchString} handleSearchString={handleSearchString}/>
      <h2>add a new</h2>
      <PersonForm 
        addData={addData}
        newName={newName}
        newNumber={newNumber}
        handleNewName={handleNewName}
        handleNewNumber={handleNewNumber}
      />
      <h2>Numbers</h2>
      <div>
        <ul>
          {personsToShow.map((person, i) =>
            <Person 
            key={i}
            name={person.name}
            number={person.number} 
            deletePrompt={() => deletePrompt(person.id, person.name)}
          />
          )}
        </ul>
      </div>
    </div>
  )
}

export default App