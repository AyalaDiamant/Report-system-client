

import React from 'react';
import Logout from '../../auth/logout.component';
import { useNavigate } from 'react-router-dom';

const Admin: React.FC = () => {

  const navigate = useNavigate();

  const handleSetting = () => {
    navigate('/setting');
  };

  const handleReports = () => {
    navigate('/reports');
  };

  return (
    <div className="container mt-5">
      <h1>עמוד ניהול</h1>
      <Logout />
      <button onClick={handleSetting} className="btn">לדף ההגדרות</button>
      <button onClick={handleReports} className="btn">לדף הדוחות</button>

    </div>
  );
};

export default Admin;
