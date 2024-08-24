import { useState, useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { handleAlert } from './reducers/alertReducer'
import {
  initializeBlogs,
  createBlog,
  updateBlog,
  deleteBlog
} from './reducers/blogReducer'
import './index.css'
import Blog from './components/Blog/Blog'
import BlogForm from './components/BlogForm/BlogForm'
import Login from './components/Login/Login'
import Togglable from './components/Togglable/Togglable'
import Alert from './components/Alert/Alert'
import { getExistingUser, login, logout } from './reducers/userReducer'

const App = () => {
  const dispatch = useDispatch()
  const reduxBlogs = useSelector((state) => state.blog)
  const user = useSelector((state) => state.user)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const blogFormRef = useRef()

  useEffect(() => {
    dispatch(initializeBlogs())
  }, [dispatch])

  useEffect(() => {
    dispatch(getExistingUser())
  }, [dispatch])

  console.log(reduxBlogs)

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      dispatch(login(username, password))
      setUsername('')
      setPassword('')
    } catch (e) {
      dispatch(handleAlert('Wrong credentials', true))
    }
  }

  const handleLogout = () => {
    dispatch(logout())
  }

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
      )}

      {user && (
        <Togglable buttonLabel="New Note" ref={blogFormRef}>
          <BlogForm create={create} />
        </Togglable>
      )}
    </div>
  )
}

export default App
