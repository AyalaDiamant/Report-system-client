

// import React from 'react';
// import { useNavigate } from 'react-router-dom';
// import { useUser } from '../../../contexts/user.context';
// import Header from '../../header.component';

// const Admin: React.FC = () => {

//   const navigate = useNavigate();
//   const { user } = useUser();

//   const handleLogout = () => {
//     localStorage.removeItem('token');
//     localStorage.removeItem('isAdmin');
//     sessionStorage.removeItem('token');
//     sessionStorage.removeItem('isAdmin');

//     navigate('/login');
//   };

//   const handleSetting = () => {
//     navigate('/settings');
//   };

//   const handleReport = () => {
//     navigate('/reports');
//   };

//   const handleEmployeeManagement = () => {
//     navigate('/employee-management');
//   };

//   const handleHome = () => {
//     navigate('/admin');
//   };


//   return (
//     <div>
//       <Header
//         user={user}
//         role="manager" // מצב של מנהל
//         handleLogout={handleLogout}
//         handleReport={handleReport}
//         handleEmployeeManagement={handleEmployeeManagement}
//         handleHome={handleHome}
//         handleSettings={handleSetting}
//       />
//       <div className="container mt-5">
//         <h1>עמוד ניהול</h1>
//       </div>
//     </div>

//   );
// };

// export default Admin;

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../../../contexts/user.context';
import Header from '../../header.component';

const Admin: React.FC = () => {

  const navigate = useNavigate();
  const { user } = useUser();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('isAdmin');
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('isAdmin');

    navigate('/login');
  };

  const handleReport = () => {
    navigate('/reports');
  };

  const handleEmployeeManagement = () => {
    navigate('/employee-management');
  };

  const handleHome = () => {
    navigate('/admin');
  };

  return (
    <div>
      <Header
        user={user}
        role="manager"
        handleLogout={handleLogout}
        handleReport={handleReport}
        handleEmployeeManagement={handleEmployeeManagement}
        handleHome={handleHome}
      />
      <div className="container mt-5">
        <h1 className="text-center mb-4">עמוד ניהול - ברוך הבא, {user?.name}</h1>
        <div className="admin-actions">
          <button className="btn btn-main btn-lg" onClick={handleReport}>צפייה בדוחות</button>
          <button className="btn btn-main btn-lg" onClick={handleEmployeeManagement}>ניהול עובדים</button>
        </div>
      </div>
    </div>
  );
};

export default Admin;

