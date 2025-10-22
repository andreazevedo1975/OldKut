import React from 'react';
import ReactDOM from 'react-dom/client';
// Fix: Correctly import the App component from App.tsx, which is now a valid module.
import App from './App';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);