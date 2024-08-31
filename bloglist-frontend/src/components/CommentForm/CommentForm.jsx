import { useState } from 'react'

const CommentForm = ({ commentHandler }) => {
  const [comment, setComment] = useState('')

  const handleSubmit = async (event) => {
    event.preventDefault()
    commentHandler(comment)
    setComment('')
  }

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <textarea
          value={comment}
          onChange={(event) => setComment(event.target.value)}
        />
        <button type="submit">Submit</button>
      </form>
    </div>
  )
}

export default CommentForm
