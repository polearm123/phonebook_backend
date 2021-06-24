//this file only handles the routing of the application 
//and exports the module to the app.js

const personRouter = require('express').Router()
const Person = require('../models/person')


//info route handler displays information from the people list in HTML format
personRouter.get('/info', (request,response,next) => {
  const date = new Date()
  Person.find({}).countDocuments().then(infoResponse => {
    response.send(`<h1>Phonebook has info for ${infoResponse} people</h1>
    <p>${date}</p>`)
  }).catch(error =>
  {
    next(error)
  })
})


//retrieves a specific document from the database corresponding to the
//request paramters
personRouter.get('/:id', (request,response,next) => {

  Person.findById(request.params.id).then(person => {
    if(person){
      response.json(person)
    }else{
      response.status(404).end()
    }
    //catch block will trigger if the id given
    //does not match the mongodb id format
  }).catch(error => next(error))

})


//to handle editing contacts that already exist
personRouter.put('/:id',(request,response,next) => {
  const body = request.body
  console.log(body._id)

  const updatedPerson = {
    number: body.number,
    name: body.name
  }

  Person.findByIdAndUpdate(body._id,updatedPerson,{ new:true }).then(updatedResponse => {
    console.log('found a match', updatedResponse)
    response.json(updatedResponse,{ error:`${updatedResponse.name}'s number has been changed successfully` })
  }).catch(error => next(error))

})


//route for post request made to server
//checks if the name or number is present if so returns 
//if not it adds it to the list of people
//request.body can only be used because of the express.json()
personRouter.post('/', (request,response,next) => {

  const body = request.body

  //if there is no name or number attached to the body of the request
  //return page not found 404
  console.log(`number is ${body.number} name is ${body.name}`)
  if(body.name === undefined || body.number === undefined){
    console.log('person could not be added request body empty')
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
personRouter.delete('/:id' , (request,response,next) => {

  Person.findByIdAndDelete(request.params.id).then(result => {
    response.status(204).end()
    //leaves the error handling to the error handling middleware
  }).catch(error => next(error))

})


//returns jsonified list of people in the people list
personRouter.get('/', (request,response,next) => {
  console.log('inside get')
  Person.find({}).then(people => {
    response.json(people)
  }).catch(error => {
    next(error)
  })
})


module.exports = personRouter