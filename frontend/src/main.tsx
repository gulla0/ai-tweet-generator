// src/main.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// Mount the app to the root element
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);