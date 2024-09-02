import { useState } from 'react'
import { Box, Button, TextField } from '@mui/material'
import PropTypes from 'prop-types'

const BlogForm = ({ create }) => {
  const [author, setAuthor] = useState('')
  const [title, setTitle] = useState('')
  const [url, setUrl] = useState('')

  const handleSubmit = (event) => {
    event.preventDefault()
    const blog = {
      author: author,
      title: title,
      url: url
    }
    create(blog)
    setTitle('')
    setAuthor('')
    setUrl('')
  }

  return (
    <Box>
      <form onSubmit={handleSubmit}>
        <div>
          <TextField
            margin="normal"
            label="Title"
            data-testid="title"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
          />
        </div>
        <div>
          <TextField
            margin="normal"
            label="Author"
            data-testid="author"
            value={author}
            onChange={(event) => setAuthor(event.target.value)}
          />
        </div>
        <div>
          <TextField
            margin="normal"
            label="URL"
            data-testid="url"
            value={url}
            onChange={(event) => setUrl(event.target.value)}
          />
        </div>
        <Button type="submit">Submit</Button>
      </form>
    </Box>
  )
}

BlogForm.propTypes = {
  create: PropTypes.func.isRequired
}

export default BlogForm
