import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ReportService from '../../../services/report.service';
import { useUser } from '../../../contexts/user.context';
import { MyReport } from '../../../interfaces/report.interface';
import Header from '../../header.component';

const Employee: React.FC = () => {
    const [_reports, setReports] = useState<MyReport[]>([]);
    const [_loading, setLoading] = useState<boolean>(true);

    const navigate = useNavigate();
    const { user } = useUser();

    const loadReports = async () => {
        try {
            const data = await ReportService.getReportByEmployee(user?.employeeId || 0);
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

    
  const handleNavigation = (route: string) => {
    navigate(route);
  };

    const handleLogout = () => {
        localStorage.removeItem('token');
        sessionStorage.removeItem('token');
        handleNavigation('/login');
    };

    return (
        <div>
            <Header
                user={user}
                role="employee" // מצב של עובד
                handleLogout={handleLogout}
                handleReport={() => handleNavigation('/report')} 
                toggleShowReports={() => handleNavigation('/reports-employee')} 
                handleHome={() => handleNavigation('/employee')} 
            />
            <div className="container mt-5">
                <h1 className="text-center mb-4">עמוד עובד - ברוך הבא, {user?.name}</h1>
                <div className="employee-actions">
                <button onClick={() => handleNavigation('/reports-employee')} >הדוחות שלי</button>
                <button onClick={() => handleNavigation('/report')} >למילוי דוח</button>
                </div>
            </div>
        </div>
    );
};

export default Employee;

