import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { ThemeProvider } from './context/ThemeContext'
import { ModalProvider } from './context/ModalContext'
import './index.css'
import './styles/global.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider>
      <BrowserRouter>
        <ModalProvider>
          <App />
        </ModalProvider>
      </BrowserRouter>
    </ThemeProvider>
  </StrictMode>,
)
