import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './App.css';
import 'locomotive-scroll/dist/locomotive-scroll.css';
import App from './App.jsx';

import { ThemeProvider } from './contexts/ThemeContext';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </StrictMode>
);
