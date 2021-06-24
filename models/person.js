
//only responsibility is to define the mongoose schema
//which is the structure of data that is put in the database

const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')


const personSchema = mongoose.Schema({
  name:{
    type:String,
    minLength:3,
    required:true,
    unique:true
  },
  number:{
    type:Number,
    minLength:8,
    required:true
  }
})


//formats the objects returned by mongoose
//removes the __iv and _id
personSchema.set('toJson', {
  transform:(document,returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

personSchema.plugin(uniqueValidator)


//create a model using the structure defined in the schema
module.exports = mongoose.model('Person',personSchema)
