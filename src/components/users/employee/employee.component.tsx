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
    }, [user, navigate]);

    const handleReport = () => {
        navigate('/report');
    };

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
        <body>
            <div className="development-banner">האתר בשלבי פיתוח</div>

            <header className="navbar navbar-expand-lg navbar-light bg-light">
                <div className="container">
                    <span className="navbar-brand"> {user?.name ? ` שלום ${user.name} ` : ''}
                    </span>
                    <div className="collapse navbar-collapse d-flex justify-content-between align-items-center">
                        <ul className="navbar-nav mr-auto">
                            <li className="nav-item">
                                <a className="nav-link" href="/report">למילוי דוח</a>
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
                                                {/* <p><strong>סוג:</strong> {report.type}</p>
                                            <p><strong>כמות:</strong> {report.quantity}</p>
                                            <p><strong>תעריף:</strong> {report.rate}</p>
                                            <p><strong>תפקיד:</strong> {report.role}</p>
                                            <p><strong>פרוייקט:</strong> {report.project}</p>
                                            <p><strong>מדור:</strong> {report.section}</p>
                                            <p><strong>סימן/סעיף:</strong> {report.sign}</p>
                                            <p><strong>סכום סה"כ:</strong> {report.total}</p>
                                            <p><strong>הערה:</strong> {report.common}</p> */}
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
        </body>

    );
};

export default Employee;
