import {
  Container,
  AppBar,
  Toolbar,
  Button,
  Table,
  TableContainer,
  TableHead,
  TableRow,
  TableCell,
  TablePagination,
  TableBody,
  Paper,
  Typography
} from '@mui/material'
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

const Header = ({ user }) => {
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const linkStyle = {
    padding: 5,
    margin: 0
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogUser')
    dispatch(setUser(null))
    navigate('/login')
  }

  return (
    user && (
      <div>
        <AppBar position="static">
          <Toolbar>
            <Button color="inherit" component={Link} to="/blogs">
              Blogs
            </Button>
            <Button color="inherit" component={Link} to="/users">
              Users
            </Button>
            <p style={linkStyle}>
              {user.name} is currently logged in
              {user && (
                <Button color="inherit" onClick={handleLogout}>
                  Log out
                </Button>
              )}
            </p>
          </Toolbar>
        </AppBar>
      </div>
    )
  )
}

const Blogs = ({ blogs }) => {
  const ROWS_PER_PAGE = 10
  const sortedBlogs = [...blogs].sort((a, b) => b.likes - a.likes)
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(ROWS_PER_PAGE)

  const dispatch = useDispatch()
  const blogFormRef = useRef()

  const handleChangePage = (event, newPage) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, ROWS_PER_PAGE))
    setPage(0)
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

  if (!blogs) return null

  return (
    <TableContainer component={Paper}>
      <h1>Blogs</h1>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Title</TableCell>
            <TableCell>Author</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {sortedBlogs
            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
            .map((blog) => (
              <TableRow key={blog.id}>
                <TableCell scope="blog">
                  <Link to={`/blogs/${blog.id}`}>{blog.title}</Link>
                </TableCell>
                <TableCell>{blog.author}</TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
      <Togglable buttonLabel="New Note" ref={blogFormRef}>
        <BlogForm create={create} />
      </Togglable>
      <TablePagination
        component="div"
        count={blogs.length}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </TableContainer>
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
