const mongoose = require('mongoose')
const app = require('../app')
const supertest = require('supertest')
const User = require('../models/user')
const { beforeEach, describe, test, after } = require('node:test')
const { initialUsers } = require('./test_helper')

const api = supertest(app)

describe('when there are users in the database', () => {

  beforeEach(async () => {
    await User.deleteMany({})
    await User.insertMany(initialUsers)
  })

  test('GET requests return a valid response', async () => {
    await api
      .get('/api/users')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('invalid password post will return a 400 HTTP Bad Request', async () => {
    const invalidRequest = {
      name: "Vincent",
      username: "v1234",
      password: "1"
    }

    await api
      .post('/api/users')
      .send(invalidRequest)
      .expect(400)
  })

  test('valid User posts will be in MongoDB', async () => {
    const validRequest = {
      name: "Vincent",
      username: "v12345",
      password: "123"
    }

    await api
      .post('/api/users')
      .send(validRequest)
      .expect(201)
  })

  test('duplicate usernames will return a 400', async () => {
    const invalidRequest = {
      name: "Vincent",
      username: "vincent@gmail.com",
      password: "12345678"
    }

    await api
      .post('/api/users')
      .send(invalidRequest)
      .expect(400)
  })
})

after(async () => {
  await User.deleteMany({})
  await mongoose.connection.close()
})
