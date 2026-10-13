import React, { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import { AuthProvider } from './context/AuthContext.jsx';
import './index.css';

const container = document.getElementById('root');

if (!container) {
  throw new Error("Target container '#root' was not found in the document.");
}

const root = createRoot(container);

root.render(
  <AuthProvider>
    <App />
  </AuthProvider>
);
