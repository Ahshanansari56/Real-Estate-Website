import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { AuthProvider } from './context/AuthContext';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import './index.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
        <Toaster position="top-right" toastOptions={{
          style: { background: '#1a1a2e', color: '#e8d5b7', border: '1px solid #c9a84c' },
          success: { iconTheme: { primary: '#c9a84c', secondary: '#1a1a2e' } }
        }} />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
