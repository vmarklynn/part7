import { createSlice } from '@reduxjs/toolkit'
import blogService from '../services/blogs'

const getExistingUser = () => {
  const loggedUserJSON = window.localStorage.getItem('loggedBlogUser')
  if (loggedUserJSON) {
    const user = JSON.parse(loggedUserJSON)
    blogService.setToken(user.token)
    return user
  } else {
    return null
  }
}

const userSlice = createSlice({
  name: 'user',
  initialState: getExistingUser(),
  reducers: {
    setUser(state, action) {
      return action.payload
    }
  }
})

export const { setUser } = userSlice.actions

export default userSlice.reducer
