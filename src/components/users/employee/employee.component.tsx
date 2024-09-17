import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ReportService from '../../../services/report.service';
import { useUser } from '../../../contexts/user.context';
import { MyReport } from '../../../interfaces/report.interface';
import Logout from '../../auth/logout.component';

const Employee: React.FC = () => {
    const [reports, setReports] = useState<MyReport[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const navigate = useNavigate();
    const { user } = useUser();

    const loadReports = async () => {
        console.log(user, 'pppppppe');

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
                                <span className="nav-link" onClick={handleReport}>למילוי דוח</span>
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
                                            <ul className="list-group mb-3">
                                                        {report.deliverables.map((item, idx) => (
                                                            <li className="list-group-item" key={`${item.type}-${idx}`}>
                                                                <p><strong>סוג:</strong> {item.type}</p>
                                                                <p><strong>כמות:</strong> {item.quantity}</p>
                                                                <p><strong>תעריף:</strong> {item.rate}</p>
                                                                <p><strong>תפקיד:</strong> {item.role}</p>
                                                                <p><strong>פרוייקט:</strong> {item.project}</p>
                                                                <p><strong>מדור:</strong> {item.section}</p>
                                                                <p><strong>סימן/סעיף:</strong> {item.sign}</p>
                                                                <p><strong>סכום סה"כ:</strong> {item.total}</p>
                                                            </li>
                                                        ))}
                                                    </ul>
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
        </div>

    );
};

export default Employee;
