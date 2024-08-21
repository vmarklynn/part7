const { test, after, beforeEach, describe } = require('node:test')
const Blog = require('../models/blog')
const User = require('../models/user')
const { initialBlogs, initialUsers, blogsInDb, usersInDb } = require('./test_helper')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')

const api = supertest(app)

describe('when there are existing notes', () => {

  beforeEach(async () => {
    await Blog.deleteMany({})
    await Blog.insertMany(initialBlogs)
  })

  test('blogs are returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('blogs return the correct number of blogs', async () => {
    const response = await api.get('/api/blogs')
    assert.strictEqual(response.body.length, initialBlogs.length)
  })

  describe('blogs _id field gets replaced', () => {

    test('with id as identifiers', async () => {
      const response = await api.get('/api/blogs')
      const firstBlog = response.body[0]

      assert.strictEqual('id' in firstBlog, true)
      assert.strictEqual(!('_id' in firstBlog), true)
    })
  })

  describe('addition of new blogs', () => {

    test('works with valid blog', async () => {
      const demoUserLogin = { username: "john@gmail.com", password: "12345678" }
      await api.post('/api/users').send(demoUserLogin)

      const request = await api.post('/api/login').send(demoUserLogin)
      const token = request.body.token

      const testPost =
      {
        title: "Quit School",
        author: "Primeagen",
        url: "www.primeagen.com",
        likes: 2,
      }

      await api
        .post('/api/blogs')
        .set('authorization', `Bearer ${token}`)
        .send(testPost)
        .expect(201)
        .expect('Content-Type', /application\/json/)

      const response = await blogsInDb()

      assert.strictEqual(response.length, initialBlogs.length + 1)
    })

    test('fails without login', async () => {

      const testPost =
      {
        title: "Quit School",
        author: "Primeagen",
        url: "www.primeagen.com",
        likes: 2,
      }

      await api
        .post('/api/blogs')
        .send(testPost)
        .expect(401)
    })

    test('empty like will default to 0 ', async () => {

      const demoUserLogin = { username: initialUsers[0].username, password: initialUsers[0].password }
      await api.post('/api/users').send(demoUserLogin)

      const request = await api.post('/api/login').send(demoUserLogin)
      const token = request.body.token

      const testPost =
      {
        title: "Quit School",
        author: "Primeagen",
        url: "www.primeagen.com",
      }

      await api
        .post('/api/blogs')
        .set('authorization', `Bearer ${token}`)
        .send(testPost)
        .expect(201)

      const response = await blogsInDb()

      assert.strictEqual('likes' in response[initialBlogs.length - 1], true)
      assert.strictEqual(response[initialBlogs.length].likes, 0)
    })

    test('with invalid requests should return 400', async () => {

      const demoUserLogin = { username: initialUsers[0].username, password: initialUsers[0].password }
      await api.post('/api/users').send(demoUserLogin)

      const request = await api.post('/api/login').send(demoUserLogin)
      const token = request.body.token

      const testInvalidPost =
      {
        url: "www.primeagen.com",
      }

      await api
        .post('/api/blogs')
        .set('authorization', `Bearer ${token}`)
        .send(testInvalidPost)
        .expect(400)
    })
  })

  describe('Deletion of blog', () => {

    test('valid id should return a 204', async () => {
      const demoUserLogin = { username: initialUsers[0].username, password: initialUsers[0].password }
      await api.post('/api/users').send(demoUserLogin)

      const request = await api.post('/api/login').send(demoUserLogin)
      const token = request.body.token

      const testPost =
      {
        title: "Quit School",
        author: "Primeagen",
        url: "www.primeagen.com",
        likes: 2,
      }

      await api.post('/api/blogs').set('authorization', `Bearer ${token}`)
        .send(testPost)


      const getRequest = await api.get('/api/blogs')
      const blogs = getRequest.body
      const idToDelete = blogs[blogs.length - 1].id

      await api
        .delete(`/api/blogs/${idToDelete}`)
        .set('authorization', `Bearer ${token}`)
        .expect(204)
    })
  })

  describe('Updating posts', () => {

    test("with a valid request will be successful", async () => {
      const idToUpdate = initialBlogs[0]._id

      const updateBlog = {
        author: "Vincent",
        title: "Find a job at FAANG",
        url: "www.thisisascam.com",
        likes: 50
      }

      const response = await api
        .put(`/api/blogs/${idToUpdate}`)
        .send(updateBlog)

      assert.strictEqual(response.body.likes, updateBlog.likes)
    })
  })
})

after(async () => {
  await User.deleteMany({})
  await mongoose.connection.close()
})

