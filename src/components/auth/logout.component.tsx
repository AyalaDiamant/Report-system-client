import React from 'react';
import { useNavigate } from 'react-router-dom';

const Logout: React.FC = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // מחיקת פרטי ההתחברות מ-localStorage ו-sessionStorage
    localStorage.removeItem('token');
    localStorage.removeItem('isAdmin');
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('isAdmin');

    // ניתוב לעמוד התחברות
    navigate('/login');
  };

  return (
    <button onClick={handleLogout} className="btn btn-danger">
      התנתק
    </button>
  );
};

export default Logout;
