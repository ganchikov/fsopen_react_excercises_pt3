const express = require('express')
const morgan = require('morgan')

const app = express()
app.use(express.json())

morgan.token('payload', (req, res) => 
  { 
      if (req.method === 'POST')
        return JSON.stringify(req.body)
  })


app.use(express.static('build'))
app.use(morgan(':method :url :status :response-time ms :payload'))

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
    res.send('<h1>Hello World</h1>')
})

app.get('/api/persons', (req, res) => {
    res.json(data)
})

app.get('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id)
  const data_entry = data.find(itm => itm.id === id)
  if (!data_entry) {
    res.status(404).send(`no person with ID ${id} found`)
    return
  }
  res.json(data_entry)
})

app.post('/api/persons', (req, res) => {
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
    res.send(`Phonebook has info for ${data.length} people <br/>${new Date()}`)
})

app.listen(PORT, ()=> {
    console.log('server is running')
})

