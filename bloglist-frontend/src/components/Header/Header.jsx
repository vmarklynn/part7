import { AppBar, Toolbar, Button } from '@mui/material'
import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { setUser } from '../../reducers/userReducer'

const Header = ({ user }) => {
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const linkStyle = {
    padding: 5,
    margin: 0
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogUser')
    dispatch(setUser(null))
    navigate('/login')
  }

  return (
    user && (
      <div>
        <AppBar position="static">
          <Toolbar>
            <Button color="inherit" component={Link} to="/blogs">
              Blogs
            </Button>
            <Button color="inherit" component={Link} to="/users">
              Users
            </Button>
            <p style={linkStyle}>
              {user.name} is currently logged in
              {user && (
                <Button color="inherit" onClick={handleLogout}>
                  Log out
                </Button>
              )}
            </p>
          </Toolbar>
        </AppBar>
      </div>
    )
  )
}

export default Header
