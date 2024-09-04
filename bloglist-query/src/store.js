import blogReducer from './reducers/blogReducer'
import userReducer from './reducers/userReducer'
import { configureStore } from '@reduxjs/toolkit'

export default configureStore({
  reducer: {
    blog: blogReducer,
    user: userReducer
  }
})
