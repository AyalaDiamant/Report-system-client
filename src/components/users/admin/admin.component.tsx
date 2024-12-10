import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../../../contexts/user.context';
import Header from '../../header.component';

const Admin: React.FC = () => {

  const navigate = useNavigate();
  const { user } = useUser();

  const handleNavigation = (route: string) => {
    navigate(route);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('isAdmin');
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('isAdmin');

    handleNavigation('/login');
  };

  return (
    <div>
      <Header
        user={user}
        role="manager"
        handleLogout={handleLogout}
        handleReport={() => handleNavigation('/reports')} 
        handleEmployeeManagement={() => handleNavigation('/employee-management')}  
        handleHome={() => handleNavigation('/admin')}  
      />
      <div className="container mt-5">
        <h1 className="text-center mb-4">עמוד ניהול - ברוך הבא, {user?.name}</h1>
        <div className="admin-actions">
          <button className="btn btn-main btn-lg" onClick={() => handleNavigation('/reports')}>צפייה בדוחות</button>
          <button className="btn btn-main btn-lg" onClick={() => handleNavigation('/employee-management')}>ניהול עובדים</button>
        </div>
      </div>
    </div>
  );
};

export default Admin;

