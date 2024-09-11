// import React, { useEffect, useState } from 'react';
// import Logout from '../../auth/logout.component';
// import { useNavigate } from 'react-router-dom';
// import ReportService from '../../../services/report.service';
// import { useUser } from '../../../contexts/user.context';

// const Employee: React.FC = () => {
//     const [reports, setReports] = useState<Report[]>([]);
//     const [loading, setLoading] = useState<boolean>(true);
//     const navigate = useNavigate();
//     const { user } = useUser();

//     const loadReports = async () => {
//         try {
//             const token = localStorage.getItem('token');
//             if (!token) {
//                 throw new Error('No token found. User is not authenticated.');
//             }
//             // עושה בעיה על השורה משום מה לא מגיע ID לבדוק את זה
//             let employeeId = user?.employeeId;

//             const data = await ReportService.getReportByEmployee(employeeId);
//             setReports(data);
//         } catch (error) {
//             console.error('Error loading reports:', error);
//         } finally {
//             setLoading(false);
//         }
//     };

//     // קריאה לטעינת הדוחות כשמתבצע render ראשון של הקומפוננטה
//     useEffect(() => {
//         loadReports();
//     }, []);

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

//             {/* הצגת הדוחות */}
//             {loading ? (
//                 <p>טוען דוחות...</p>
//             ) : (
//                 <div>
//                     <h2>דוחות:</h2>
//                     {reports.length > 0 ? (
//                         <ul>
//                             {reports.map((report, index) => (
//                                 <li key={index}>{report.type}</li> // שינוי לפי השדה המתאים
//                             ))}
//                         </ul>
//                     ) : (
//                         <p>אין דוחות לעובד זה.</p>
//                     )}
//                 </div>
//             )}
//         </div>
//     );
// };

// export default Employee;


import React, { useEffect, useState } from 'react';
import Logout from '../../auth/logout.component';
import { useNavigate } from 'react-router-dom';
import ReportService from '../../../services/report.service';
import { useUser } from '../../../contexts/user.context';
import { MyReport } from '../../../interfaces/report.interface';

const Employee: React.FC = () => {
    const [reports, setReports] = useState<MyReport[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const navigate = useNavigate();
    const { user } = useUser();

    const loadReports = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('No token found. User is not authenticated.');
            }
            let employeeId = user?.employeeId;

            if (!employeeId) {
                throw new Error('Employee ID not found.');
            }

            const data = await ReportService.getReportByEmployee(employeeId);
            setReports(data);
        } catch (error) {
            console.error('Error loading reports:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadReports();
    }, []);

    const handleReport = () => {
        navigate('/report');
    };

    return (
        <div className="container mt-5">
            <h1>עמוד עובד</h1>
            <Logout />
            <button onClick={handleReport} className="btn btn-primary mt-3">
                למילוי דו"ח
            </button>

            {loading ? (
                <p>טוען דוחות...</p>
            ) : (
                <div>
                    <h2>כל הדוחות</h2>
                    {reports.length > 0 ? (
                        <div className="row">
                            {reports.map((report, index) => (
                                <div className="col-md-4 mb-3" key={index}>
                                    <div className="card">
                                        <div className="card-body">
                                            <h5 className="card-title">דוח</h5>
                                            <p><strong>סוג:</strong> {report.type}</p>
                                            <p><strong>כמות:</strong> {report.quantity}</p>
                                            <p><strong>תעריף:</strong> {report.rate}</p>
                                            <p><strong>תפקיד:</strong> {report.role}</p>
                                            <p><strong>פרוייקט:</strong> {report.project}</p>
                                            <p><strong>מדור:</strong> {report.section}</p>
                                            <p><strong>סימן/סעיף:</strong> {report.sign}</p>
                                            <p><strong>סכום סה"כ:</strong> {report.total}</p>
                                            <p><strong>הערה:</strong> {report.common}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p>אין דוחות לעובד זה.</p>
                    )}
                </div>
            )}
        </div>
    );
};

export default Employee;
