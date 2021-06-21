const mongoose = require('mongoose')
require('dotenv').config()

//url for database
const url = process.env.MONGODB_URL

console.log("connecting to url", url)

//connect to database specified by the url
mongoose.connect(url,mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true }).then(
    result => {
        console.log("connected to mongodb")
    }).catch(error => {
        console.log("error in connecting to mongoDB", error.message)
    })
)

//Schema/structure for the model that will be attached to a document
const personSchema = mongoose.Schema({
    name:String,
    number:Number
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


//create a model using the structure defined in the schema
module.exports = mongoose.model('Person',personSchema)