import { Container } from '@mui/material'
import userService from './services/users'
import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { initializeBlogs } from './reducers/blogReducer'
import Users from './components/Users/Users'
import { Routes, Route, Navigate, useMatch } from 'react-router-dom'
import Blog from './components/Blog/Blog'
import Alert from './components/Alert/Alert'
import User from './components/Users/User'
import Header from './components/Header/Header'
import Blogs from './components/Blogs/Blogs'
import LoginPage from './components/LoginPage/LoginPage'

const App = () => {
  const dispatch = useDispatch()
  const user = useSelector((state) => state.user)
  const blogs = useSelector((state) => state.blog)
  const [users, setUsers] = useState(null)

  const match = useMatch('/users/:id')
  const blogMatch = useMatch('/blogs/:id')

  useEffect(() => {
    userService
      .getAll()
      .then((users) => {
        setUsers(users)
      })
      .catch((error) => console.log(error))
  }, [blogs])

  useEffect(() => {
    dispatch(initializeBlogs())
  }, [dispatch])

  if (!blogs) return null
  if (!users) return null

  const matchedUser = match
    ? users.find((user) => user.id === match.params.id)
    : null

  const matchedBlog = blogMatch
    ? blogs.find((blog) => blog.id === blogMatch.params.id)
    : null

  return (
    <Container>
      <div>
        <Header user={user} />
        <Alert />
        <Routes>
          <Route
            path="/blogs"
            element={
              user ? <Blogs blogs={blogs} /> : <Navigate replace to="/login" />
            }
          />
          <Route
            path="/blogs/:id"
            element={<Blog user={user} blog={matchedBlog} />}
          />
          <Route
            path="/users"
            element={
              user ? <Users users={users} /> : <Navigate replace to="/login" />
            }
          />
          <Route path="/users/:id" element={<User user={matchedUser} />} />
          <Route path="/login" element={<LoginPage />} />
        </Routes>
      </div>
    </Container>
  )
}

export default App
