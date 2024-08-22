import { useState, useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { handleAlert } from './reducers/alertReducer'
import { initializeBlogs } from './reducers/blogReducer'
import './index.css'
import Blog from './components/Blog/Blog'
import BlogForm from './components/BlogForm/BlogForm'
import Login from './components/Login/Login'
import Togglable from './components/Togglable/Togglable'
import Alert from './components/Alert/Alert'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const dispatch = useDispatch()
  const reduxBlogs = useSelector((state) => state.blog)
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)

  const blogFormRef = useRef()

  useEffect(() => {
    dispatch(initializeBlogs())
  }, [dispatch])

  console.log('Currently contains: ', reduxBlogs)

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      blogService.setToken(user.token)
      setUser(user)
    }
  }, [])

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({ username, password })
      window.localStorage.setItem('loggedBlogUser', JSON.stringify(user))
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
    } catch (e) {
      dispatch(handleAlert('Wrong credentials', true))
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogUser')
    setUser(null)
  }

  const handleLike = async (blogToUpdate) => {
    try {
      const userInfo = blogToUpdate.user
      const updatedBlog = await blogService.updateBlog(blogToUpdate)
      updatedBlog.user = userInfo
      const updatedBlogs = blogs.map((blog) =>
        blog.id === updatedBlog.id ? updatedBlog : blog
      )
      updatedBlogs.sort((a, b) => b.likes - a.likes)
      setBlogs(updatedBlogs)
    } catch (e) {
      dispatch(handleAlert('Failed to update', true))
    }
  }

  const createBlog = async (blogObject) => {
    try {
      blogFormRef.current.toggleVisibility()
      const createdBlog = await blogService.createBlog(blogObject)
      createdBlog.user = {
        id: user.id,
        name: user.name,
        username: user.username
      }
      setBlogs(blogs.concat(createdBlog))

      dispatch(
        handleAlert(
          `A new blog ${createdBlog.title} by ${createdBlog.author} was added.`,
          false
        )
      )
    } catch (e) {
      dispatch(handleAlert('Failed to post blog', true))
    }
  }

  const handleDelete = async (blogId) => {
    try {
      await blogService.deleteBlog(blogId)
      const newBlogs = blogs.filter((blog) => blog.id !== blogId)
      setBlogs(newBlogs)
    } catch (e) {
      dispatch(handleAlert('Failed to delete', true))
    }
  }

  return (
    <div>
      <Alert />
      <h2>{user ? 'Blogs' : 'Log In to Application'}</h2>
      {!user && (
        <Login
          username={username}
          password={password}
          setUsername={setUsername}
          setPassword={setPassword}
          onSubmit={handleLogin}
        />
      )}

      {user && (
        <div>
          <p>
            {user.name} is currently logged in
            {user && <button onClick={handleLogout}>Log out</button>}
          </p>
          {reduxBlogs.map((blog) => (
            <Blog
              key={blog.id}
              blog={blog}
              isCreator={user.username === blog.user.username}
              onLike={handleLike}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      {user && (
        <Togglable buttonLabel="New Note" ref={blogFormRef}>
          <BlogForm create={createBlog} />
        </Togglable>
      )}
    </div>
  )
}

export default App
