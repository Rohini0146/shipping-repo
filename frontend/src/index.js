import React from 'react';
import { createRoot } from 'react-dom/client'; // Correct for React 18
import App from './App';

const container = document.getElementById('root');
const root = createRoot(container);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);