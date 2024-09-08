


import React from 'react';
import Logout from '../auth/logout.component'; // ייבוא הקומפוננטה של Logout

const Employee: React.FC = () => {
  return (
    <div className="container mt-5">
      <h1>עמוד עובד</h1>
      {/* הוספת כפתור התנתקות */}
      <Logout />
      {/* שאר התוכן של עמוד העובד */}
    </div>
  );
};

export default Employee;
