import ReactDOM from 'react-dom/client'
import App from './App'
import { Provider } from 'react-redux'
import store from './store'
import { AlertContextProvider } from './reducers/alertReducer'
import { UserContextProvider } from './reducers/userReducer'
import { BrowserRouter as Router } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
const queryClient = new QueryClient()

ReactDOM.createRoot(document.getElementById('root')).render(
  <QueryClientProvider client={queryClient}>
    <AlertContextProvider>
      <UserContextProvider>
        <Provider store={store}>
          <Router>
            <App />
          </Router>
        </Provider>
      </UserContextProvider>
    </AlertContextProvider>
  </QueryClientProvider>
)
