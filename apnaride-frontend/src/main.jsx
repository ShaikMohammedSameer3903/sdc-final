import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
// Global styles
import './global-fonts.css'
import './styles/global.css'
import './App.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
