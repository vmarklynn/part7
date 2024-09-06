import { handleAlert } from './reducers/alertReducer'
import { getUserValue, handleUser } from './reducers/userReducer'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  Container,
  Table,
  TableContainer,
  TableHead,
  TableRow,
  TableCell,
  TablePagination,
  TableBody,
  Paper
} from '@mui/material'
import loginService from './services/login'
import userService from './services/users'
import blogService from './services/blogs'
import { useState, useEffect, useRef } from 'react'
import Users from './components/Users/Users'
import {
  Routes,
  Route,
  useNavigate,
  Navigate,
  Link,
  useMatch
} from 'react-router-dom'
import Blog from './components/Blog/Blog'
import BlogForm from './components/BlogForm/BlogForm'
import Login from './components/Login/Login'
import Togglable from './components/Togglable/Togglable'
import Alert from './components/Alert/Alert'
import User from './components/Users/User'
import Header from './components/Header/Header'

const Blogs = ({ blogs }) => {
  const ROWS_PER_PAGE = 10
  const sortedBlogs = [...blogs].sort((a, b) => b.likes - a.likes)
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(ROWS_PER_PAGE)
  const alert = handleAlert()

  const queryClient = useQueryClient()
  const blogFormRef = useRef()

  const handleChangePage = (event, newPage) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, ROWS_PER_PAGE))
    setPage(0)
  }

  const newBlogMutation = useMutation({
    mutationFn: blogService.createBlog,
    onSuccess: (newBlog) => {
      const blogs = queryClient.getQueryData(['blogs'])
      queryClient.setQueryData(['blogs'], blogs.concat(newBlog))
      alert({
        alert: `A new blog ${newBlog.title} by ${newBlog.author} was added.`,
        error: false
      })
    },
    onError: () => {
      alert({ alert: 'Blog failed to post', error: true })
    }
  })

  const create = (blogObject) => {
    blogFormRef.current.toggleVisibility()
    newBlogMutation.mutate(blogObject)
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
  const navigate = useNavigate()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const alert = handleAlert()
  const userData = handleUser()

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({ username, password })
      window.localStorage.setItem('loggedBlogUser', JSON.stringify(user))
      userData(user)
      blogService.setToken(user.token)
      setUsername('')
      setPassword('')
      navigate('/blogs')
    } catch (e) {
      alert({
        alert: 'Wrong credentials',
        error: true
      })
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
  const user = getUserValue()
  const [users, setUsers] = useState(null)

  const blogsQuery = useQuery({
    queryKey: ['blogs'],
    queryFn: blogService.getAll
  })

  const blogs = blogsQuery.data

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
