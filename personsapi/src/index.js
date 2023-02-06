const { json } = require('express')
const express = require('express')
const app = express()
app.use(express.json())
const PORT = 3001
const data = [
    { 
      "id": 1,
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

app.get('/', (req, res) => {
    console.log('/ GET request processed')
    res.send('<h1>Hello World</h1>')
})

app.get('/api/persons', (req, res) => {
    console.log('/api/persons GET request processed')
    res.json(data)
})

app.get('/api/persons/:id', (req, res) => {
  console.log(`/api/persons GET request processed for id ${req.params.id}`)
  const id = Number(req.params.id)
  const data_entry = data.find(itm => itm.id === id)
  if (!data_entry) {
    res.status(404).send(`no person with ID ${id} found`)
    return
  }
  res.json(data_entry)
})

app.post('/api/persons', (req, res) => {
  console.log('/api/persons POST request processed')
  const data_entry = req.body

  if (!data_entry) {
    res.status(400).send('no data provided')
    return
  }
  if (!data_entry.name) {
    res.status(400).send('name property is missing')
    return
  } 
  
  if (!data_entry.number) {
    res.status(400).send('number property is missing')
    return
  }

  const matching_entry = data.find(item => item.name === data_entry.name)
  if (matching_entry) {
    res.status(400).send(`entry with name ${data_entry.name} is already existing`)
    return
  }

  data_entry.id = Math.round(Math.random()*100000)
  data.push(data_entry)
  res.json(data_entry)
})

app.delete('/api/persons/:id', (req, res) => {
  console.log(`/api/persons DELETE request processed for id ${req.params.id}`)
  const id = Number(req.params.id)
  const index = data.findIndex(itm => itm.id === id)
  if (index === -1) {
    res.status(404).send(`no person with ID ${id} found`)
    return
  }
  const data_entry = data.splice(index,1)
  res.json(data_entry)
})

app.get('/api/info', (req, res) => {
    console.log('/api/info GET request processed')
    res.send(`Phonebook has info for ${data.length} people <br/>${new Date()}`)
})

app.listen(PORT, ()=> {
    console.log('server is running')
})

