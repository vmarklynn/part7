import { createSlice } from '@reduxjs/toolkit'

const alertSlice = createSlice({
  name: 'alert',
  initialState: { alert: '', error: false },
  reducers: {
    setAlert(state, action) {
      return { alert: action.payload.alert, error: action.payload.error }
    },
    removeAlert(state, action) {
      return { alert: '', error: false }
    }
  }
})

export const handleAlert = (alert, error) => {
  return (dispatch) => {
    dispatch(setAlert({ alert: alert, error: error }))
    setTimeout(() => {
      dispatch(removeAlert())
    }, 5000)
  }
}

export const { setAlert, removeAlert } = alertSlice.actions

export default alertSlice.reducer
