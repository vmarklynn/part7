import alertReducer from './reducers/alertReducer'
import blogReducer from './reducers/blogReducer'
import userReducer from './reducers/userReducer'
import { configureStore } from '@reduxjs/toolkit'

export default configureStore({
  reducer: {
    alert: alertReducer,
    blog: blogReducer,
    user: userReducer
  }
})
