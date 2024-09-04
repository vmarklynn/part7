import { useReducer, createContext, useContext } from 'react'

const alertReducer = (state, action) => {
  switch (action.type) {
    case 'SET':
      return { alert: action.payload.alert, error: action.payload.error }
    case 'REMOVE':
      return { alert: '', error: false }
    default:
      return state
  }
}

const AlertContext = createContext()

export const AlertContextProvider = (props) => {
  const [alert, alertDispatch] = useReducer(alertReducer, {
    alert: '',
    error: false
  })

  return (
    <AlertContext.Provider value={[alert, alertDispatch]}>
      {props.children}
    </AlertContext.Provider>
  )
}

export const useAlertValue = () => {
  const alertContext = useContext(AlertContext)
  return alertContext[0]
}

export const handleAlert = () => {
  const alertValueContext = useContext(AlertContext)
  const alertDispatch = alertValueContext[1]
  return (payload) => {
    alertDispatch({ type: 'SET', payload })
    setTimeout(() => {
      alertDispatch({ type: 'REMOVE' })
    }, 5000)
  }
}
