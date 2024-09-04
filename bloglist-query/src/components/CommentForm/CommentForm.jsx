import { Box, Button, TextareaAutosize } from '@mui/material'
import { useState } from 'react'

const CommentForm = ({ commentHandler }) => {
  const [comment, setComment] = useState('')

  const handleSubmit = async (event) => {
    event.preventDefault()
    commentHandler(comment)
    setComment('')
  }

  return (
    <Box>
      <form onSubmit={handleSubmit}>
        <TextareaAutosize
          value={comment}
          onChange={(event) => setComment(event.target.value)}
        />
        <Box>
          <Button type="submit">Submit</Button>
        </Box>
      </form>
    </Box>
  )
}

export default CommentForm
