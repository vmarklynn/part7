import alertReducer from './reducers/alertReducer'
import { configureStore } from '@reduxjs/toolkit'

const store = configureStore({
  reducer: {
    alert: alertReducer
  }
})

export default store
