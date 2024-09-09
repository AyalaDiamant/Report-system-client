import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import React from 'react';

// ייבוא קומפוננטות לצורך הניווטים
import Login from './components/auth/login.component';
import Register from './components/auth/register.comonent';
import Admin from './components/users/admin.component';
import Employee from './components/users/employee.component';
import Logout from './components/auth/logout.component';
import Report from './components/report.component';
import { UserProvider } from './contexts/user.context';


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
    path: "/report",
    element: <Report />,
  },
  {
    path: "/",
    element: <Login />,
  },
]);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <UserProvider>
      <RouterProvider router={router} />
    </UserProvider>
  </StrictMode>,
);
