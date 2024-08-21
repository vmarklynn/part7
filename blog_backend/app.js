const { MONGODB_URI } = require('./utils/config')
const { requestLogger, unknownEndpoint, validationError, tokenExtractor, userExtractor } = require('./utils/middleware.js')
const { info, error } = require('./utils/logger')
const express = require('express')
require('express-async-errors')
const blogsRouter = require('./controllers/blogs')
const usersRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')
const app = express()
const cors = require('cors')
const mongoose = require('mongoose')

mongoose.connect(MONGODB_URI).then(result => {
  info('Connected to MongoDB')
}).catch(error => {
  error('Connection error: ', error.message)
})

app.use(cors())
app.use(express.json())
app.use(requestLogger)
app.use(tokenExtractor)

app.use('/api/blogs', blogsRouter)
app.use('/api/users', usersRouter)
app.use('/api/login', loginRouter)

if (process.env.NODE_ENV === "test") {
  const testRouter = require('./controllers/testing')
  app.use('/api/testing', testRouter)
}

app.use(validationError)
app.use(unknownEndpoint)

module.exports = app

