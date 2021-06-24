
//error handling middleware
//express error handlers are middleware that are defined with a function

const logger = require('./logger')

const errorHandler = (error,request,response,next) => {
  console.log(error.message)
  if(error.name==='CastError'){
    return response.status(400).send({ error:error.message })
  }else if(error.name==='ValidationError'){
    return response.status(400).send({ error:error.message })
  }else if(error.name==='CreateError'){
    return response.status(400).send({ error:error.message })
  }
  next(error)
}


//middleware that handles request that has no route handler
const unknownEndpoints = (request,response) => {
  response.status(404).send({ error:'unknown endpoint' })
}

const requestLogger = (request,response,next) => {
  logger.info(`Method: ${request.method}`)
  logger.info(`Path: ${request.path}`)
  logger.info(`Body: ${request.body}`)
  logger.info('-------')
  next()
}

module.exports = { requestLogger,unknownEndpoints,errorHandler }