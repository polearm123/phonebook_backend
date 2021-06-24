//configures the app and all moddleware needed to run it
//starts the mongoose db connection 
//this is responsible for bringing everything together so that the app is fully functional
//when the server is started in the index.js file


const config = require('./utils/config')
const express = require('express')
const morgan = require('morgan')
const app = express()
const cors = require('cors')
const middleware = require('./utils/middleware')
const logger = require('./utils/logger')
const mongoose = require('mongoose')
const personRouter = require('./controllers/person')

logger.info('connecting to,' , config.MONGODB_URI)
mongoose.connect(config.MONGODB_URI,mongoose.connect(config.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true }).then(
    result => {console.log('connected to mongodb')}).catch(error => { console.log('error in connecting to mongoDB', error.message)})
  )



app.use(express.json())
app.use(cors())
app.use(express.static('build'))
app.use(middleware.requestLogger)



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


app.use('/api/people',personRouter)
app.use(middleware.unknownEndpoints)

app.use(middleware.errorHandler)


//after setup the PORT uses the PORT variable set in the .env file.
//put in .gitignore to avoid sensitive information like db passwords from being revealed to public
//back-end listens on port stated waiting for axios requests!
// const PORT = process.env.PORT
// app.listen(PORT , () => {
//   console.log(`server is running on port ${PORT}`)
// })

module.exports = app