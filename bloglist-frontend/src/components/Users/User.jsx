import { useState } from 'react'

const User = ({ user }) => {
  if (!user) return null

  const [blogs, setBlogs] = useState(user.blogs)

  return (
    <div>
      <h2>{user.name}</h2>
      <h3>Added Blogs</h3>
      <ul>
        {blogs.map((blog) => (
          <li key={blog.id}>{blog.title}</li>
        ))}
      </ul>
    </div>
  )
}

export default User
