import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import loginService from '../../services/login'
import blogService from '../../services/blogs'
import { setUser } from '../../reducers/userReducer'
import { handleAlert } from '../../reducers/alertReducer'
import Login from '../Login/Login'

const LoginPage = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({ username, password })
      window.localStorage.setItem('loggedBlogUser', JSON.stringify(user))
      dispatch(setUser(user))
      blogService.setToken(user.token)
      setUsername('')
      setPassword('')
      navigate('/blogs')
    } catch (e) {
      dispatch(handleAlert('Wrong credentials', true))
    }
  }

  return (
    <Login
      username={username}
      password={password}
      setUsername={setUsername}
      setPassword={setPassword}
      onSubmit={handleLogin}
    />
  )
}

export default LoginPage
