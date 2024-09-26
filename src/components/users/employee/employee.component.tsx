// import React, { useEffect, useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import ReportService from '../../../services/report.service';
// import { useUser } from '../../../contexts/user.context';
// import { MyReport } from '../../../interfaces/report.interface';

// const Employee: React.FC = () => {
//     const [reports, setReports] = useState<MyReport[]>([]);
//     const [loading, setLoading] = useState<boolean>(true);
//     const [seeReports, setSeeReports] = useState<boolean>(false);
//     const navigate = useNavigate();
//     const { user } = useUser();

//     const loadReports = async () => {        
//         try {
//             const token = localStorage.getItem('token');
//             if (!token) {
//                 throw new Error('No token found. User is not authenticated.');
//             }
//             let employeeId = user?.employeeId;

//             if (!employeeId) {
//                 throw new Error('Employee ID not found.');
//             }

//             const data = await ReportService.getReportByEmployee(employeeId);
//             setReports(data);
//         } catch (error) {
//             console.error('Error loading reports:', error);
//         } finally {
//             setLoading(false);
//         }
//     };

//     useEffect(() => {
//         loadReports();
//     }, [user, navigate]);

//     const handleLogout = () => {
//         localStorage.removeItem('token');
//         localStorage.removeItem('isAdmin');
//         sessionStorage.removeItem('token');
//         sessionStorage.removeItem('isAdmin');

//         navigate('/login');
//     };
//     const handleReport = () => {
//         navigate('/report');
//     };
//     const seeReportFunc = () => {
//         console.log(seeReports);
        
//         setSeeReports(true)
//     }

//     return (
//         <div>
//             <div className="development-banner">האתר בשלבי פיתוח</div>

//             <header className="navbar navbar-expand-lg navbar-light bg-light">
//                 <div className="container">
//                     <span className="navbar-brand"> {user?.name ? ` שלום ${user.name} ` : ''}
//                     </span>
//                     <div className="collapse navbar-collapse d-flex justify-content-between align-items-center">
//                         <ul className="navbar-nav mr-auto">
//                             <li className="nav-item">
//                                 <span className="nav-link" onClick={handleReport}>למילוי דוח</span>
//                             </li>
//                             <li className="nav-item">
//                                 <span className="nav-link" onClick={seeReportFunc}>הדוחות שלי</span>
//                             </li>
//                         </ul>
//                         <div className="d-flex align-items-center">
//                             <a onClick={handleLogout} className="logout-link">התנתק</a>
//                         </div>
//                     </div>
//                 </div>
//             </header>

//             <div className="container mt-5">
//                 <h1>עמוד עובד</h1>
//                 {loading && seeReports? (
//                     <p>טוען דוחות...</p>
//                 ) : (
//                     <div className="reports-container">
//                         <h2 className="reports-title">כל הדוחות</h2>
//                         {reports.length > 0 ? (
//                             <div className="row">
//                                 {reports.map((report, index) => {
//                                     const totalSum = report.deliverables.reduce((sum, item) => sum + item.total, 0);

//                                     return (
//                                         <div className="col-md-4 mb-4" key={index}>
//                                             <div className="card report-card">
//                                                 <div className="card-header">
//                                                     <h5 className="card-title">דוח מיום {report.date}</h5>
//                                                 </div>
//                                                 <div className="card-body">
//                                                     <h6 className="mb-3">הספקים:</h6>
//                                                     <ul className="list-group mb-3">
//                                                         {report.deliverables.map((item, idx) => (
//                                                             <li className="list-group-item" key={`${item.type}-${idx}`}>
//                                                                 <div className="list-item">
//                                                                     <p><strong>סוג:</strong> {item.type}</p>
//                                                                     <p><strong>כמות:</strong> {item.quantity}</p>
//                                                                     <p><strong>תעריף:</strong> {item.rate}</p>
//                                                                     <p><strong>תפקיד:</strong> {item.role}</p>
//                                                                     <p><strong>פרוייקט:</strong> {item.project}</p>
//                                                                     <p><strong>מדור:</strong> {item.section}</p>
//                                                                     <p><strong>סימן/סעיף:</strong> {item.sign}</p>
//                                                                     <p><strong>סכום סה"כ:</strong> {item.total}</p>
//                                                                 </div>
//                                                             </li>
//                                                         ))}
//                                                     </ul>

//                                                     {report.common && (
//                                                         <p className="card-text">
//                                                             <strong>הערה:</strong> {report.common}
//                                                         </p>
//                                                     )}

//                                                     <p className="card-text total-sum">
//                                                         <strong>סה"כ:</strong> {totalSum}
//                                                     </p>
//                                                 </div>
//                                             </div>
//                                         </div>
//                                     );
//                                 })}
//                             </div>
//                         ) : (
//                             <p className="no-reports">אין דוחות לעובד זה.</p>
//                         )}
//                     </div>

//                 )}
//             </div>
//         </div>

//     );
// };

// export default Employee;

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ReportService from '../../../services/report.service';
import { useUser } from '../../../contexts/user.context';
import { MyReport } from '../../../interfaces/report.interface';

const Employee: React.FC = () => {
    const [reports, setReports] = useState<MyReport[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [showReports, setShowReports] = useState<boolean>(false); // מצב להצגת הדוחות
    const navigate = useNavigate();
    const { user } = useUser();

    const loadReports = async () => {
        try {
            const token = localStorage.getItem('token') || sessionStorage.getItem('token');

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
    }, [user,navigate]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('isAdmin');
        sessionStorage.removeItem('token');
        sessionStorage.removeItem('isAdmin');
        navigate('/login');
    };

    const handleReport = () => {
        navigate('/report');
    };

    const toggleShowReports = () => {
        setShowReports((prevShowReports) => !prevShowReports); // הופך את המצב
    };

    return (
        <div>
            <div className="development-banner">האתר בשלבי פיתוח</div>

            <header className="navbar navbar-expand-lg navbar-light bg-light">
                <div className="container">
                    <span className="navbar-brand">
                        {user?.name ? `שלום ${user.name}` : ''}
                    </span>
                    <div className="collapse navbar-collapse d-flex justify-content-between align-items-center">
                        <ul className="navbar-nav mr-auto">
                            <li className="nav-item">
                                <button className="nav-link btn" onClick={toggleShowReports}>
                                    הדוחות שלי
                                </button>
                            </li>
                            <li className="nav-item">
                                <span className="nav-link" onClick={handleReport}>
                                    למילוי דוח
                                </span>
                            </li>
                        </ul>
                        <div className="d-flex align-items-center">
                            <a onClick={handleLogout} className="logout-link">התנתק</a>
                        </div>
                    </div>
                </div>
            </header>

            <div className="container mt-5">
                <h1>עמוד עובד</h1>
                {showReports && ( // הצגת הדוחות רק אם showReports הוא true
                    loading ? (
                        <p>טוען דוחות...</p>
                    ) : (
                        <div className="reports-container">
                            <h2 className="reports-title">הדוחות שלי</h2>
                            {reports.length > 0 ? (
                                <div className="row">
                                    {reports.map((report, index) => {
                                        const totalSum = report.deliverables.reduce((sum, item) => sum + item.total, 0);
                                        return (
                                            <div className="col-md-4 mb-4" key={index}>
                                                <div className="card report-card">
                                                    <div className="card-header">
                                                        <h5 className="card-title">דוח מיום {report.date}</h5>
                                                    </div>
                                                    <div className="card-body">
                                                        <h6 className="mb-3">הספקים:</h6>
                                                        <ul className="list-group mb-3">
                                                            {report.deliverables.map((item, idx) => (
                                                                <li className="list-group-item" key={`${item.type}-${idx}`}>
                                                                    <div className="list-item">
                                                                        <p><strong>סוג:</strong> {item.type}</p>
                                                                        <p><strong>כמות:</strong> {item.quantity}</p>
                                                                        <p><strong>תעריף:</strong> {item.rate}</p>
                                                                        <p><strong>תפקיד:</strong> {item.role}</p>
                                                                        <p><strong>פרוייקט:</strong> {item.project}</p>
                                                                        <p><strong>סכום סה"כ:</strong> {item.total}</p>
                                                                    </div>
                                                                </li>
                                                            ))}
                                                        </ul>
                                                        {report.common && (
                                                            <p className="card-text">
                                                                <strong>הערה:</strong> {report.common}
                                                            </p>
                                                        )}
                                                        <p className="card-text total-sum">
                                                            <strong>סה"כ:</strong> {totalSum}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            ) : (
                                <p className="no-reports">אין דוחות לעובד זה.</p>
                            )}
                        </div>
                    )
                )}
            </div>
        </div>
    );
};

export default Employee;
