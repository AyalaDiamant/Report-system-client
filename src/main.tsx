import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css'; // סגנונות אישיים שלך
import 'bootstrap/dist/css/bootstrap.min.css'; // ייבוא Bootstrap CSS
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import React from 'react';

// ייבוא קומפוננטות לצורך הניווטים
import Login from './components/auth/login.component';
import Register from './components/auth/register.comonent';
import Admin from './components/users/admin.component';
import Employee from './components/users/employee.component';
import Logout from './components/auth/logout.component';

const router = createBrowserRouter([
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/admin", 
    element: <Admin />,
  },
  {
    path: "/employee", 
    element: <Employee />,
  },
  {
    path: "/logout", 
    element: <Logout />,
  },
  {
    path: "/", 
    element: <Login />,
  },
]);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);
