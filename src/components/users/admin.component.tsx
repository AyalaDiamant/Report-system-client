

import React from 'react';
import Logout from '../auth/logout.component'; 

const Admin: React.FC = () => {
  return (
    <div className="container mt-5">
      <h1>עמוד ניהול</h1>
      {/* הוספת כפתור התנתקות */}
      <Logout />
      {/* שאר התוכן של עמוד המנהל */}
    </div>
  );
};

export default Admin;
