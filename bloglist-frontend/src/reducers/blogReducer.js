import { createSlice } from '@reduxjs/toolkit'
import blogService from '../services/blogs'

const blogSlice = createSlice({
  name: 'blog',
  initialState: [],
  reducers: {
    create(state, action) {
      state.push(action.payload)
    },
    setAllBlogs(state, action) {
      return action.payload
    }
  }
})

export const { create, setAllBlogs } = blogSlice.actions

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

export default blogSlice.reducer
