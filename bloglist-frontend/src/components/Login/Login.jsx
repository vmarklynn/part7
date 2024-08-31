import PropTypes from 'prop-types'
import { Box, TextField, Button } from '@mui/material'

const Login = ({ username, password, setPassword, setUsername, onSubmit }) => {
  return (
    <Box display="flex" justifyContent={'center'} alignItems={'center'}>
      <form onSubmit={onSubmit}>
        <h2>Log In to Blog App</h2>
        <div>
          <TextField
            margin="normal"
            label="Username"
            data-testid="username"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
          />
        </div>
        <div>
          <TextField
            margin="normal"
            label="Password"
            type="password"
            data-testid="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
        </div>
        <Button type="submit">Login</Button>
      </form>
    </Box>
  )
}

Login.propTypes = {
  username: PropTypes.string.isRequired,
  password: PropTypes.string.isRequired,
  setPassword: PropTypes.func.isRequired,
  setUsername: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired
}

export default Login
