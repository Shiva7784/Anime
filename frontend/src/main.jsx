import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import { AppContextProvider } from './components/context/AppContext.jsx'
import { ToastProvider } from './components/context/ToastContext.jsx'

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <AppContextProvider>
      <ToastProvider>
        <App />
      </ToastProvider>
    </AppContextProvider>
  </BrowserRouter>
)

