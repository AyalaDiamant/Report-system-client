import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { BrowserRouter } from 'react-router-dom';

// ייבוא קומפוננטות לצורך הניווטים
import Login from './components/auth/login.component';
// לאחר השיוני שמנהל רושם עובדים אין צורך בפונקציית רישום כרגע
// import Register from './components/auth/register.comonent';
import Admin from './components/users/admin/admin.component';
import Employee from './components/users/employee/employee.component';
import Setting from './components/users/admin/setting.component';
import EmployeeManagement from './components/users/admin/employeeManagement.component';
import Reports from './components/users/admin/reports.component';
import Report from './components/users/employee/report.component';
import { UserProvider } from './contexts/user.context';
import ReportsEmployee from './components/users/employee/reportsEmployee.component';


const router = createBrowserRouter([
  {
    path: "/login",
    element: <Login />,
  },
  // לאחר השיוני שמנהל רושם עובדים אין צורך בפונקציית רישום כרגע
  // {
  //   path: "/register",
  //   element: <Register />,
  // },
  {
    path: "/admin",
    element: <Admin />,
  },
  {
    path: "/employee-management",
    element: <EmployeeManagement />,
  },
  {
    path: "/employee",
    element: <Employee />,
  },
  {
    path: "/report",
    element: <Report />,
  },
  {
    path: "/settings",
    element: <Setting />,
  },
  {
    path: "/reports",
    element: <Reports />,
  },
  {
    path: "/reports-employee",
    element: <ReportsEmployee />,
  },
  {
    path: "/",
    element: <Login />,
  },
]);

createRoot(document.getElementById('root')!).render(
  <BrowserRouter>

    <StrictMode>
      <UserProvider>
        <RouterProvider router={router} />
      </UserProvider>
    </StrictMode>
  </BrowserRouter>
  ,
);
