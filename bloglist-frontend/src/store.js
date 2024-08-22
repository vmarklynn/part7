import alertReducer from './reducers/alertReducer'
import blogReducer from './reducers/blogReducer'
import { configureStore } from '@reduxjs/toolkit'

const store = configureStore({
  reducer: {
    alert: alertReducer,
    blog: blogReducer
  }
})

export default store
