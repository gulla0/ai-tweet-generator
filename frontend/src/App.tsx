// src/App.tsx
import React from 'react';
import { createGlobalStyle } from 'styled-components';
import { AppProvider, useAppContext } from './context/AppContext';
import LoginPage from './components/LoginPage';
import Dashboard from './components/Dashboard';

// Global styles
const GlobalStyle = createGlobalStyle`
  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  :root {
    --color-primary: #3182ce;
    --color-primary-dark: #2c5282;
    --color-secondary: #718096;
    --color-background: #f7fafc;
    --color-text: #2d3748;
    --color-text-light: #718096;
    --color-border: #e2e8f0;
    --color-error: #e53e3e;
    --color-success: #38a169;
    --radius: 6px;
    --shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    --shadow-hover: 0 4px 6px rgba(0, 0, 0, 0.1);
  }

  body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
    font-size: 16px;
    line-height: 1.5;
    color: var(--color-text);
    background-color: var(--color-background);
  }

  button {
    cursor: pointer;
  }

  a {
    color: var(--color-primary);
    text-decoration: none;
  }
`;

// App container
const AppContent = () => {
  const { state } = useAppContext();
  
  return (
    <>
      <GlobalStyle />
      {state.isAuthenticated ? <Dashboard /> : <LoginPage />}
    </>
  );
};

// Main App component with context
const App = () => {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
};

export default App;