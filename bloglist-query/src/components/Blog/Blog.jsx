import { useNavigate } from 'react-router-dom'
import { handleAlert } from '../../reducers/alertReducer'
import { useState, useEffect } from 'react'
import CommentForm from '../CommentForm/CommentForm'
import blogService from '../../services/blogs'
import { Box, List, ListItem } from '@mui/material'
import { useMutation, useQueryClient } from '@tanstack/react-query'

const Blog = ({ blog, user }) => {
  const alert = handleAlert()
  const navigate = useNavigate()
  const [comments, setComments] = useState(null)

  const queryClient = useQueryClient()

  const deleteMutation = useMutation({
    mutationFn: blogService.deleteBlog,
    onSuccess: (data, variables) => {
      const blogs = queryClient.getQueryData(['blogs'])
      const newBlogs = blogs.filter((blog) => {
        return blog.id !== variables
      })
      queryClient.setQueryData(['blogs'], newBlogs)
    },
    onError: () => {
      alert({ alert: 'Failed to delete', error: true })
    }
  })

  const updateMutation = useMutation({
    mutationFn: blogService.updateBlog,
    onSuccess: (updatedBlog) => {
      const blogs = queryClient.getQueryData(['blogs'])
      const newBlogs = blogs.map((blog) =>
        blog.id === updatedBlog.id ? updatedBlog : blog
      )
      queryClient.setQueryData(['blogs'], newBlogs)
    },
    onError: () => {
      alert({ alert: 'Failed to update', error: true })
    }
  })

  useEffect(() => {
    if (blog) {
      blogService.getComments(blog.id).then((comments) => {
        setComments(comments)
      })
    }
  }, [blog])

  const handleLike = () => {
    const newLike = blog.likes + 1
    const updatedBlog = { ...blog, likes: newLike }
    updateMutation.mutate(updatedBlog)
  }

  const handleDelete = () => {
    if (window.confirm(`Remove ${blog.title} by ${blog.author}?`)) {
      const id = blog.id
      deleteMutation.mutate(id)
      navigate('/blogs')
    }
  }

  const handleCommentPost = async (comment) => {
    const newComment = await blogService.postComments(blog.id, {
      comment
    })
    setComments(comments.concat(newComment))
  }

  if (!blog) return null

  return (
    <Box>
      <Box style={blogStyle}>
        <p>
          {blog.title} - {blog.author}{' '}
        </p>

        <Box data-testid="hidden" color="inherit">
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
        </Box>
      </Box>
      <Box>
        <h2>Comments</h2>
        <CommentForm commentHandler={handleCommentPost} />
        <List>
          {comments &&
            comments.map((comment) => (
              <ListItem key={comment.id}>{comment.comment}</ListItem>
            ))}
        </List>
      </Box>
    </Box>
  )
}

const blogStyle = {
  paddingTop: 10,
  paddingLeft: 2,
  border: 'solid',
  borderWidth: 1,
  marginBottom: 5
}
export default Blog
