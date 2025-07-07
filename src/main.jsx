import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router'
import { router } from './router/router';
import './index.css'

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <div className='bg-slate-50'>
      <RouterProvider router={router} />
    </div>
  </StrictMode>
);
