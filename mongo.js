const mongoose = require('mongoose')


if(process.argv.length < 3){
    console.log("please provide the password as an argument: node mongo.js <password>")
}

const password = process.argv[2]
const name = process.argv[3]
const number = process.argv[4]

console.log(`name: ${name} password ${password} number:${number}`)

//url for database
const url = `mongodb+srv://fullstack:${password}@cluster0.znukd.mongodb.net/phonebook-app?retryWrites=true&w=majority`

//connect to database specified by the url
mongoose.connect(url,mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true }))

//Schema/structure for the model that will be attached to a document
const personSchema = mongoose.Schema({
    name:String,
    number:Number
})


//create a model using the structure defined in the schema
const Person = mongoose.model('Person',personSchema)


//if user only inputs password, show all the entries in the database
if(password && name===undefined && number===undefined){
    Person.find({}).then(response => {
        response.forEach(person => {
            console.log(`${person.name} ${person.number}`)
        })
        mongoose.connection.close()
    }).catch(error => {
        console.log("there was an error in fetching all data" ,error)
    })
    
}


//if all three parameters are given on command line
if(password && name!==undefined && number!==undefined)
    {
    //create a new person following the mongoose model
    const newPerson = new Person({
        name:name,
        number:number
    })

    //save the person specified using the mongoose model
    //to the database and close the connection
    newPerson.save().then(result => {
        console.log("new person saved" , newPerson)
        mongoose.connection.close()
    }).catch(error => {
    console.log("error in saving person")
        })
    }
