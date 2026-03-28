import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { ThemeProvider } from './store/themeStore.jsx'
import './index.css'
import App from './App.jsx'
import PreviewPage from './pages/PreviewPage.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <ThemeProvider>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/preview" element={<PreviewPage />} />
        </Routes>
      </ThemeProvider>
    </BrowserRouter>
  </StrictMode>,
)
