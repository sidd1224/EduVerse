// ALTERNATIVE QUICK FIX - Updated index.js (Remove StrictMode)
// This is the fastest solution but removes development benefits

import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));

// SOLUTION 1: Remove StrictMode completely (Quick Fix)
root.render(<App />);

// SOLUTION 2: Conditional StrictMode (Development vs Production)
// root.render(
//   process.env.NODE_ENV === 'development' ? (
//     <App />
//   ) : (
//     <React.StrictMode>
//       <App />
//     </React.StrictMode>
//   )
// );

// ORIGINAL CODE (CAUSING THE ISSUE):
// root.render(
//   <React.StrictMode>
//     <App />
//   </React.StrictMode>
// );