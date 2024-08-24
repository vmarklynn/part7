import alertReducer from './reducers/alertReducer'
import blogReducer from './reducers/blogReducer'
import userReducer from './reducers/userReducer'
import { configureStore } from '@reduxjs/toolkit'

const store = configureStore({
  reducer: {
    alert: alertReducer,
    blog: blogReducer,
    user: userReducer
  }
})

export default store
