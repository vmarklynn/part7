const usersRouter = require('express').Router()
const User = require('../models/user')
const bcrypt = require('bcryptjs')

usersRouter.get('/', async (request, response) => {
  const users = await User.find({}).populate('blogs', { title: 1, url: 1, author: 1, likes: 1 })
  response.json(users)
})

usersRouter.post('/', async (request, response) => {
  const { username, name, password } = request.body

  if (password === 'undefined' || password.length < 3) {
    return response.status(400).json({ error: 'password needs to be at least 3 characters' })
  }

  const saltRounds = 10
  const passwordHash = await bcrypt.hash(password, saltRounds)

  const newUser = new User({
    username, passwordHash, name
  })

  const savedUser = await newUser.save()

  response.status(201).json(savedUser)

})

module.exports = usersRouter
