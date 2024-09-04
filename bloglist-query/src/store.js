import blogReducer from './reducers/blogReducer'
import { configureStore } from '@reduxjs/toolkit'

export default configureStore({
  reducer: {
    blog: blogReducer
  }
})
