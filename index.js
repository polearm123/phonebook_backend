const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()

app.use(express.json())
app.use(cors())
app.use(express.static('build'))

//middleware - express json parse
//takes the request and turns it into a json object
//that can be read using request.body


//customer morgan token that takes the body of a request (post usually has a body)
//and returns it to be printed by the morgan request handler below
morgan.token('content', function getContent(request) {
  const requestBody = JSON.stringify(request.body)
  return requestBody
})


//morgan custom request handler that uses the custom token and prints 
//important request information
app.use(morgan(function (tokens, req, res) {
  return [
    tokens.method(req, res),
    tokens.url(req, res),
    tokens.status(req, res),
    tokens.res(req, res, 'content-length'), '-',
    tokens['response-time'](req, res), 'ms',
    tokens.content(req)
  ].join(' ')
}))


//people list storing name and numbers
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


//default route handler that displays hello world in HTML format
app.get('/' , (request,response) => {
	response.send("<h1> Hello World </h1>")
})


//info route handler displays information from the people list in HTML format
app.get('/info', (request,response) => {
  const date = new Date()
  response.send(`<h1>Phonebook has info for ${people.length} people</h1>
    <p>${date}</p>
  `)

})


//gets a specific person object from the people list 
//uses Number to convert string to integer to find the person in 
//the people list
app.get('/api/people/:id', (request,response) => {
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


//used to generate an id for the json list of people and numbers
//finds the max id in the list adds one and returns it
const generateId = () => {

  const maxId = people.length >0 ? Math.max(...people.map((person)=>person.id)) : 0
  return maxId+1

} 


//route for post request made to server
//checks if the name or number is present if so returns 
//if not it adds it to the list of people
//request.body can only be used because of the express.json()
app.post('/api/people', (request,response) => {

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


//route handling a delete request
//finds the person in the list and deletes returning a 204 status
//if person is not present it returns a 404 status
app.delete('/api/people/:id' , (request,response) => {

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


//returns jsonified list of people in the people list
app.get('/api/people', (request,response) => {
	response.json(people)
})


//middleware that handles request that has no route handler
const unknownEndpoints = (request,response) => {
  response.status(404).send({error:"unknown endpoint"})
}



app.use(unknownEndpoints)


const PORT = process.env.PORT || 3096
app.listen(PORT , () => {
	console.log(`server is running on port ${PORT}`)
})
