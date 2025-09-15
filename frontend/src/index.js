import React from 'react';
import ReactDOM from 'react-dom/client';
import './styles/colors.css';
import './styles/theme.css';
import './index.css';
import './styles/main.css';
// Optional: enable when Tailwind build is active
// import './styles/tailwind.css';

import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
