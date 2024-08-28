import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { updateBlog, deleteBlog } from '../../reducers/blogReducer'
import { handleAlert } from '../../reducers/alertReducer'

const Blog = ({ blog, user }) => {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const handleLike = () => {
    try {
      const newLike = blog.likes + 1
      const updatedBlog = { ...blog, likes: newLike }
      dispatch(updateBlog(updatedBlog))
    } catch (e) {
      dispatch(handleAlert('Failed to update', true))
    }
  }

  const handleDelete = () => {
    try {
      if (window.confirm(`Remove ${blog.title} by ${blog.author}?`)) {
        const id = blog.id
        dispatch(deleteBlog(id))
        navigate('/blogs')
      }
    } catch (e) {
      dispatch(handleAlert('Failed to delete', true))
    }
  }

  return (
    <div style={blogStyle}>
      <p>
        {blog.title} - {blog.author}{' '}
      </p>
      {
        <div data-testid="hidden">
          <p>{blog.url}</p>
          <p data-testid="likes">
            {blog.likes}{' '}
            <button data-testid="like" onClick={handleLike}>
              Like
            </button>
          </p>
          <p>{blog.user ? blog.user.name : ''}</p>
          {blog.user.username === user.username && (
            <button onClick={handleDelete}>Remove</button>
          )}
        </div>
      }
    </div>
  )
}

export default Blog
