

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../../../contexts/user.context';

const Admin: React.FC = () => {

  const navigate = useNavigate();
  const { user } = useUser();

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
    <div>
      <div className="development-banner">האתר בשלבי פיתוח</div>
      <header className="navbar navbar-expand-lg navbar-light bg-light">
        <div className="container">
          <span className="navbar-brand"> {user?.name ? ` שלום ${user.name} ` : ''}
          </span>
          <div className="collapse navbar-collapse d-flex justify-content-between align-items-center">
            <ul className="navbar-nav mr-auto">
              <li className="nav-item">
                <a className="nav-link" href="/settings">הגדרות</a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="/reports">דוחות</a>
              </li>
            </ul>
            <div className="d-flex align-items-center">
              <a onClick={handleLogout} className="logout-link">התנתק</a>
            </div>
          </div>
        </div>
      </header>

      <div className="container mt-5">
        <h1>עמוד ניהול</h1>
      </div>
    </div>

  );
};

export default Admin;
