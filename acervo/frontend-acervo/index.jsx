import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css'; // Arquivo de estilos globais (opcional)

// Renderização moderna com React 18+
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
