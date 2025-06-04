import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

// Create a root for React to render the app into the HTML element with id 'root'
const root = ReactDOM.createRoot(document.getElementById('root'));

// Render the App component inside React.StrictMode (helps catch potential problems)
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
