
// import React from 'react';
// import Logout from '../auth/logout.component'; 
// import { useNavigate } from 'react-router-dom';

// const Employee: React.FC = () => {
//     const navigate = useNavigate();

//     const handleReport = () => {
//         navigate('/report');
//     };

//     return (
//         <div className="container mt-5">
//             <h1>עמוד עובד</h1>
//             {/* הוספת כפתור התנתקות */}
//             <Logout />
//             <button onClick={handleReport} className="btn">
//                 למילוי דו"ח
//             </button>
//         </div>
//     );
// };

// export default Employee;

import React, { useEffect, useState } from 'react';
import Logout from '../auth/logout.component'; 
import { useNavigate } from 'react-router-dom';
import ReportService from '../../services/report.service'; 
import { useUser } from '../../contexts/user.context';

const Employee: React.FC = () => {
    const [reports, setReports] = useState<Report[]>([]); 
    const [loading, setLoading] = useState<boolean>(true); 
    const navigate = useNavigate();
    const { user } = useUser();

    const loadReports = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('No token found. User is not authenticated.');
            }
// עושה בעיה על השורה משום מה לא מגיע ID לבדוק את זה
            let employeeId = user?.employeeId;

            const data = await ReportService.getReportByEmployee(employeeId);
            setReports(data);
        } catch (error) {
            console.error('Error loading reports:', error);
        } finally {
            setLoading(false);
        }
    };

    // קריאה לטעינת הדוחות כשמתבצע render ראשון של הקומפוננטה
    useEffect(() => {
        loadReports();
    }, []);

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

            {/* הצגת הדוחות */}
            {loading ? (
                <p>טוען דוחות...</p>
            ) : (
                <div>
                    <h2>דוחות:</h2>
                    {reports.length > 0 ? (
                        <ul>
                            {reports.map((report, index) => (
                                <li key={index}>{report.title}</li> // שינוי לפי השדה המתאים
                            ))}
                        </ul>
                    ) : (
                        <p>אין דוחות לעובד זה.</p>
                    )}
                </div>
            )}
        </div>
    );
};

export default Employee;

