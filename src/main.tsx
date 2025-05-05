import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import App from './App'
import { VideoPositionEngine } from './services/videoPositionEngine'

// Enable global debugging
(window as any).debugVideoPositions = () => {
  const engine = VideoPositionEngine.getInstance()
  engine.debug()
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
 