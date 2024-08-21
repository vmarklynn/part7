import { useSelector } from 'react-redux'

const Alert = () => {
  const alert = useSelector((state) => state.alert)

  return (
    <div>
      {alert.alert.length > 0 && (
        <h2 className={alert.error ? 'error' : 'success'}>{alert.alert}</h2>
      )}
    </div>
  )
}

export default Alert
