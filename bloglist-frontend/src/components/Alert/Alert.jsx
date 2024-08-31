import { useSelector } from 'react-redux'
import { Alert as MuiAlert } from '@mui/material'

const Alert = () => {
  const alert = useSelector((state) => state.alert)

  return (
    <div>
      {alert.alert.length > 0 && (
        <MuiAlert severity={alert.error ? 'error' : 'success'}>
          {alert.alert}
        </MuiAlert>
      )}
    </div>
  )
}

export default Alert
