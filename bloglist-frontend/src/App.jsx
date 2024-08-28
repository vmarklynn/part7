import loginService from './services/login'
import userService from './services/users'
import blogService from './services/blogs'
import { useState, useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { handleAlert } from './reducers/alertReducer'
import { initializeBlogs, createBlog } from './reducers/blogReducer'
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

const Blogs = ({ blogs }) => {
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const dispatch = useDispatch()
  const blogFormRef = useRef()

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

  return (
    <div>
      <div>
        {[...blogs]
          .sort((a, b) => b.likes - a.likes)
          .map((blog) => (
            <div key={blog.id} style={blogStyle}>
              <Link to={`/blogs/${blog.id}`}>
                {blog.title}-{blog.author}
              </Link>
            </div>
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
      navigate('/blogs')
    } catch (e) {
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
  const blogs = useSelector((state) => state.blog)
  const [users, setUsers] = useState(null)

  const match = useMatch('/users/:id')
  const blogMatch = useMatch('/blogs/:id')

  console.log('Users information: ', users)

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
    <div>
      <Link to="/users">Users</Link>
      <Link to="/blogs">Blogs</Link>
      <p>{user && user.name}</p>
      <h2>{user ? 'Blogs' : 'Log In to Application'}</h2>
      <Alert />
      <UserHeader user={user} logoutFunction={setUser} />
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
  )
}

export default App
