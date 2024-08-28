import loginService from './services/login'
import userService from './services/users'
import blogService from './services/blogs'
import { useState, useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { handleAlert } from './reducers/alertReducer'
import {
  initializeBlogs,
  createBlog,
  updateBlog,
  deleteBlog
} from './reducers/blogReducer'
import Users from './components/Users/Users'
import {
  Routes,
  Route,
  useNavigate,
  Navigate,
  Link,
  useMatch
} from 'react-router-dom'
import './index.css'
import Blog from './components/Blog/Blog'
import BlogForm from './components/BlogForm/BlogForm'
import Login from './components/Login/Login'
import Togglable from './components/Togglable/Togglable'
import Alert from './components/Alert/Alert'
import { setUser } from './reducers/userReducer'
import User from './components/Users/User'

const UserHeader = ({ user }) => {
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogUser')
    dispatch(setUser(null))
    navigate('/login')
  }

  return (
    user && (
      <p>
        {user.name} is currently logged in
        {user && <button onClick={handleLogout}>Log out</button>}
      </p>
    )
  )
}

const Blogs = ({ user }) => {
  const dispatch = useDispatch()
  const reduxBlogs = useSelector((state) => state.blog)
  const blogFormRef = useRef()

  const handleLike = async (blogToUpdate) => {
    try {
      dispatch(updateBlog(blogToUpdate))
    } catch (e) {
      dispatch(handleAlert('Failed to update', true))
    }
  }

  const create = (blogObject) => {
    try {
      blogFormRef.current.toggleVisibility()
      dispatch(createBlog(blogObject))
      dispatch(
        handleAlert(
          `A new blog ${blogObject.title} by ${blogObject.author} was added.`,
          false
        )
      )
    } catch (e) {
      dispatch(handleAlert('Failed to post blog', true))
    }
  }

  const handleDelete = async (blogId) => {
    try {
      dispatch(deleteBlog(blogId))
    } catch (e) {
      dispatch(handleAlert('Failed to delete', true))
    }
  }

  return (
    <div>
      <div>
        {[...reduxBlogs]
          .sort((a, b) => b.likes - a.likes)
          .map((blog) => (
            <Blog
              key={blog.id}
              blog={blog}
              isCreator={user.username === blog.user.username}
              onLike={handleLike}
              onDelete={handleDelete}
            />
          ))}
      </div>
      <Togglable buttonLabel="New Note" ref={blogFormRef}>
        <BlogForm create={create} />
      </Togglable>
    </div>
  )
}

const LoginPage = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({ username, password })
      window.localStorage.setItem('loggedBlogUser', JSON.stringify(user))
      dispatch(setUser(user))
      blogService.setToken(user.token)
      setUsername('')
      setPassword('')
      console.log('Navigating!')
      navigate('/')
    } catch (e) {
      console.log(e)
      dispatch(handleAlert('Wrong credentials', true))
    }
  }

  return (
    <Login
      username={username}
      password={password}
      setUsername={setUsername}
      setPassword={setPassword}
      onSubmit={handleLogin}
    />
  )
}
const App = () => {
  const dispatch = useDispatch()
  const user = useSelector((state) => state.user)
  const [users, setUsers] = useState(null)
  const match = useMatch('/users/:id')

  useEffect(() => {
    userService
      .getAll()
      .then((users) => {
        setUsers(users)
      })
      .catch((error) => console.log(error))
  }, [])

  useEffect(() => {
    dispatch(initializeBlogs())
  }, [dispatch])

  if (!users) return null
  const matchedUser = match
    ? users.find((user) => user.id === match.params.id)
    : null

  return (
    <div>
      <Link to="/users">Users</Link>
      <Link to="/">Blogs</Link>
      <p>{user && user.name}</p>
      <h2>{user ? 'Blogs' : 'Log In to Application'}</h2>
      <Alert />
      <UserHeader user={user} logoutFunction={setUser} />
      <Routes>
        <Route
          path="/"
          element={
            user ? <Blogs user={user} /> : <Navigate replace to="/login" />
          }
        />
        <Route
          path="/users"
          element={user ? <Users /> : <Navigate replace to="/login" />}
        />
        <Route path="/users/:id" element={<User user={matchedUser} />} />
        <Route path="/login" element={<LoginPage />} />
      </Routes>
    </div>
  )
}

export default App
