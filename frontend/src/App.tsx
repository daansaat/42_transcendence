import { SettingsProvider } from './contexts'
import { Router } from './router'
import './main.css'
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';

export function App() {
  return (
    // <UserProvider>
    <SettingsProvider>
      <Router />
    </SettingsProvider>
    // </UserProvider>
  )
}
