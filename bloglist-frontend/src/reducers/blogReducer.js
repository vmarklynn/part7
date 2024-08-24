import { createSlice } from '@reduxjs/toolkit'
import blogService from '../services/blogs'

const blogSlice = createSlice({
  name: 'blog',
  initialState: [],
  reducers: {
    create(state, action) {
      state.push(action.payload)
    },
    remove(state, action) {
      const newBlogs = state.filter((blog) => blog.id !== action.payload)
      return newBlogs
    },
    setAllBlogs(state, action) {
      return action.payload
    },
    update(state, action) {
      const currentBlog = action.payload
      const updatedBlogs = state.map((blog) =>
        blog.id === currentBlog.id ? currentBlog : blog
      )
      return updatedBlogs
    }
  }
})

export const { create, setAllBlogs, update, remove } = blogSlice.actions

export const initializeBlogs = () => {
  return async (dispatch) => {
    const blogs = await blogService.getAll()
    blogs.sort((a, b) => b.likes - a.likes)
    dispatch(setAllBlogs(blogs))
  }
}

export const createBlog = (blog) => {
  return async (dispatch) => {
    const newBlog = await blogService.createBlog(blog)
    dispatch(create(newBlog))
  }
}

export const updateBlog = (blog) => {
  return async (dispatch) => {
    const updatedBlog = await blogService.updateBlog(blog)
    dispatch(update(updatedBlog))
  }
}

export const deleteBlog = (blogId) => {
  return async (dispatch) => {
    await blogService.deleteBlog(blogId)
    dispatch(remove(blogId))
  }
}

export default blogSlice.reducer
