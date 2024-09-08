


// import React from 'react';
// import Logout from '../auth/logout.component'; // ייבוא הקומפוננטה של Logout

// const Employee: React.FC = () => {
//   return (
//     <div className="container mt-5">
//       <h1>עמוד עובד</h1>

//       {/* הוספת כפתור התנתקות */}
//       <Logout />
//       {/* שאר התוכן של עמוד העובד */}
//     </div>
//   );
// };

// export default Employee;


// src/pages/Employee.tsx
import React from 'react';
import Logout from '../auth/logout.component'; // ייבוא הקומפוננטה של Logout
import AddReportForm from '../report.component'; // ייבוא הקומפוננטה של הוספת דוח
import { useNavigate } from 'react-router-dom';

const Employee: React.FC = () => {
    const navigate = useNavigate();

    const handleReport = () => {
        navigate('/report');
    };

    return (
        <div className="container mt-5">
            <h1>עמוד עובד</h1>

            {/* הוספת כפתור התנתקות */}
            <Logout />

            <button onClick={handleReport} className="btn">
                למילוי דו"ח
            </button>
        </div>
    );
};

export default Employee;
