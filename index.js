const express = require('express')
const app = express()
app.use(express.json())

let people = [
  {
    id:1,
    name:"Arto",
    number:"11111"
  },
  {
    id:2,
    name:"Spe",
    number:"1231923"
  },
  {
    id:3,
    name:"Juan",
    number:"33333"
  },
  {
    id:4,
    name:"Henriq",
    number:"22222"
  }
]

app.get('/' , (request,response) => {
	response.send("<h1> Hello World </h1>")
})

app.get('/info', (request,response) => {
  const date = new Date()
  response.send(`<h1>Phonebook has info for ${people.length} people</h1>
    <p>${date}</p>
  `)

})

app.get('/api/persons/:id', (request,response) => {
  console.log("request params: " , request.params)
  const id = Number(request.params.id)
  
  const matchingPerson = people.find((person) => person.id === id)

  if(matchingPerson){
    response.json(matchingPerson)
  }else{
    console.log("the id requested is not present in the database")
    response.status(404).end()
  }

})

const generateId = () => {

  const maxId = people.length >0 ? Math.max(...people.map((person)=>person.id)) : 0
  return maxId+1

} 
app.post('/api/persons', (request,response) => {

  const body = request.body

  console.log("body of post request is:  " , body.name)
  if(!body.name){
    console.log("person could not be added request body empty")
    return response.status(404).end()
  }
  //check if the name or number exists in the phonebook
  const existingNumber = people.find(person => person.number === body.number) 
  const existingName = people.find(person=>person.name===body.name)

  //returns an error json if the name or number already exists
  if(existingNumber||existingName){
    console.log("existing person with name or number")
    return response.status(404).json({error:"must be unique"})
  }

  const newPerson = {
    id:generateId(),
    name:body.name,
    number:body.number
  }

  people = people.concat(newPerson)
  console.log("person successfully added")
  response.status(204).end()


})


app.delete('/api/persons/:id' , (request,response) => {

  const id = Number(request.params.id)
  console.log("id is: " , id)
  const findPerson = people.find((person) => person.id === id)
  console.log("person found is: ", findPerson)
  if(findPerson){
    people = people.filter((person) => person.id != id)
    console.log("person found and deleted")
    response.status(204).end()
  }else{
    console.log("person does not exist and cannot be deleted")
    response.status(404).end()

  }

})

app.get('/api/persons', (request,response) => {
	response.json(people)
})

const PORT = 3010
app.listen(PORT , () => {
	console.log(`server is running on port ${PORT}`)
})
