const express = require('express')
const morgan = require('morgan')
const cors = require('cors')

//imports the person module from the models directory
const Person = require('./models/person')
const mongoose = require('mongoose')
require('dotenv').config()
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


//default route handler that displays hello world in HTML format
app.get('/' , (request,response) => {
	response.send("<h1> Hello World </h1>")
})


//info route handler displays information from the people list in HTML format
app.get('/api/people/info', (request,response,next) => {
  const date = new Date()
  Person.find({}).countDocuments().then(infoResponse => {
    response.send(`<h1>Phonebook has info for ${infoResponse} people</h1>
    <p>${date}</p>`
  )
  }).catch(error =>
    {mongoose.connection.close()
    next(error)
  })
    
  })


//retrieves a specific document from the database corresponding to the
//request paramters
app.get('/api/people/:id', (request,response,next) => {

  Person.findById(request.params.id).then(person => {
    if(note){
      response.json(person)
    }else{
      response.status(404).end()
    }
    //catch block will trigger if the id given
    //does not match the mongodb id format
  }).catch(error => next(error))

})


//to handle editing contacts that already exist
app.put('/api/people/:id',(request,response,next) => {
  const body = request.body
  console.log(body._id)

  const updatedPerson = {
    number: body.number,
    name: body.name
  }

  Person.findByIdAndUpdate(body._id,updatedPerson,{new:true}).then(updatedResponse => {
    console.log("found a match", updatedResponse)
    response.json(updatedResponse,{error:`${updatedResponse.name}'s number has been changed successfully`})
  }).catch(error => next(error))

})


//route for post request made to server
//checks if the name or number is present if so returns 
//if not it adds it to the list of people
//request.body can only be used because of the express.json()
app.post('/api/people', (request,response,next) => {

  const body = request.body

  //if there is no name or number attached to the body of the request
  //return page not found 404
  console.log(`number is ${body.number} name is ${body.name}`)
  if(body.name === undefined || body.number === undefined){
    console.log("person could not be added request body empty")
    return response.status(404).end()
  }
  
  const newPerson = new Person({
    name:body.name,
    number:body.number
  })

  newPerson.save().then(savedPerson => {
    response.json(savedPerson)
  }).catch(error => next(error))

   
})

    
//route handling a delete request
//finds the person in the list and deletes returning a 204 status
//if person is not present it returns a 404 status
app.delete('/api/people/:id' , (request,response,next) => {

  Person.findByIdAndDelete(request.params.id).then(result => {
    response.status(204).end()
    //leaves the error handling to the error handling middleware
  }).catch(error => next(error))

})


//returns jsonified list of people in the people list
app.get('/api/people', (request,response) => {
  Person.find({}).then(people => {
    response.json(people)
  }).catch(error => {
    next(error)
  })
	
})


//middleware that handles request that has no route handler
const unknownEndpoints = (request,response) => {
  response.status(404).send({error:"unknown endpoint"})
}
app.use(unknownEndpoints)


//error handling middleware
//express error handlers are middleware that are defined with a function
const errorHandler = (error,request,response,next) => {
  console.log(error.message)

  if(error.name==='CastError'){
    return response.status(400).send({error:error.message})
  }else if(error.name==='ValidationError'){
    return response.status(400).send({error:error.message})
  }else if(error.name==='CreateError'){
    return response.status(400).send({error:error.message})
  }
}
app.use(errorHandler)


//after setup the PORT uses the PORT variable set in the .env file.
//put in .gitignore to avoid sensitive information like db passwords from being revealed to public
//back-end listens on port stated waiting for axios requests!
const PORT = process.env.PORT
app.listen(PORT , () => {
	console.log(`server is running on port ${PORT}`)
})
