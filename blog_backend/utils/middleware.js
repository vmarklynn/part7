const { info, error } = require('./logger')
const User = require('../models/user')
const jwt = require('jsonwebtoken')

const requestLogger = (request, response, next) => {
  info('Method: ', request.method)
  info('Path: ', request.path)
  info('Body: ', request.body)
  info('--------------------')
  next()
}

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

const validationError = (error, request, response, next) => {
  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).send({ error: error.message })
  } else if (error.name === 'MongoServerError' && error.message.includes('E11000 duplicate key error')) {
    return response.status(400).send({ error: 'username needs to be unique' })
  } else if (error.name === 'JsonWebTokenError') {
    return response.status(401).send({ error: 'invalid token' })
  } else if (error.name === 'TokenExpiredError') {
    return response.status(401).send({ error: 'expired token' })
  }
  next(error)
}

const tokenExtractor = (request, response, next) => {
  // Headers are always capitalized
  const authorization = request.get('authorization')
  // Will return Bearer 'TOKEN'
  if (authorization && authorization.startsWith('Bearer ')) {
    request.token = authorization.replace('Bearer ', '')
  }
  next()
}

const userExtractor = async (request, response, next) => {
  const token = request.token

  const decodedToken = jwt.verify(token, process.env.SECRET)

  if (!decodedToken.id) {
    return response.status(401).send({ error: 'unauthorized user' })
  }
  const user = await User.findById(decodedToken.id)
  request.user = user

  next()
}

module.exports = {
  requestLogger,
  unknownEndpoint,
  validationError,
  tokenExtractor,
  userExtractor
}
