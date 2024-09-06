import { createContext, useContext, useReducer } from 'react'
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

export const userReducer = (state, action) => {
  switch (action.type) {
    case 'SET_USER':
      return action.payload
    default:
      return state
  }
}

export const UserContext = createContext()

export const UserContextProvider = (props) => {
  const [user, userDispatch] = useReducer(userReducer, getExistingUser())

  return (
    <UserContext.Provider value={[user, userDispatch]}>
      {props.children}
    </UserContext.Provider>
  )
}

export const getUserValue = () => {
  const userValueDispatch = useContext(UserContext)
  return userValueDispatch[0]
}

export const handleUser = () => {
  const userValueDispatch = useContext(UserContext)
  const userDispatch = userValueDispatch[1]
  return (payload) => {
    userDispatch({ type: 'SET_USER', payload })
  }
}
