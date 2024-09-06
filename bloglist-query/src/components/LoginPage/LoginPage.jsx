import Login from '../Login/Login'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { handleAlert } from '../../reducers/alertReducer'
import { handleUser } from '../../reducers/userReducer'
import blogService from '../../services/blogs'
import loginService from '../../services/login'

const LoginPage = () => {
  const navigate = useNavigate()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const alert = handleAlert()
  const userData = handleUser()

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({ username, password })
      window.localStorage.setItem('loggedBlogUser', JSON.stringify(user))
      userData(user)
      blogService.setToken(user.token)
      setUsername('')
      setPassword('')
      navigate('/blogs')
    } catch (e) {
      alert({
        alert: 'Wrong credentials',
        error: true
      })
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
