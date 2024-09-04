import { useAlertValue } from '../../reducers/alertReducer'
import { Alert as MuiAlert } from '@mui/material'

const Alert = () => {
  const alert = useAlertValue()

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
