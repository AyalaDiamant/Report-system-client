import React, { useEffect, useState } from 'react';
import ReportService from '../../../services/report.service';
import EmployeeService from '../../../services/employee.service';
import { MyReport } from '../../../interfaces/report.interface';
import { useUser } from '../../../contexts/user.context';
import { useNavigate } from 'react-router-dom';
import Header from '../../header.component';
import ExcelExportService from '../../../services/excelExport.service';


const Reports: React.FC = () => {
    const [reports, setReports] = useState<MyReport[]>([]);
    const [_originalReports, setOriginalReports] = useState<MyReport[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [employeeNames, setEmployeeNames] = useState<{ [key: number]: string }>({});

    const navigate = useNavigate();
    const { user } = useUser();

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const token = localStorage.getItem('token') || sessionStorage.getItem('token');
            if (!token) {
                throw new Error('No token found. User is not authenticated.');
            }

            // טעינת הדוחות
            const reportData = await ReportService.getAllReports();
            setReports(reportData);
            setOriginalReports([...reportData]);
            // טעינת שמות העובדים
            const namesMap: { [key: number]: string } = {};

            for (const report of reportData) {
                try {
                    const employee = await EmployeeService.getEmployeeById(report.employeeId);
                    namesMap[report.employeeId] = employee.name;
                } catch (error) {
                    console.error(`Error loading employee with ID ${report.employeeId}:`, error);
                    namesMap[report.employeeId] = 'שגיאה';
                }
            }
            setEmployeeNames(namesMap);


        } catch (error) {
            console.error('Error loading reports:', error);
        } finally {
            setLoading(false);
        }
    };
    
    const exportToExcel = () => {
        ExcelExportService.exportReportsToExcel(reports, employeeNames)
    }

    // פונקציה למחיקת דוח
    const handleDelete = async (reportId: number) => {
        if (confirm('אתה בטוח שברצונך למחוק את הדוח?')) {
            try {
                await ReportService.deleteReport(reportId);
                setReports(reports.filter((report) => report._id !== reportId));
            } catch (error) {
                console.error('Error deleting report:', error);
            }
        }
    };

    const handleNavigation = (route: string) => {
        navigate(route);
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('isAdmin');
        sessionStorage.removeItem('token');
        sessionStorage.removeItem('isAdmin');

        handleNavigation('/login');
    };

    return (
        <div>
            <Header
                user={user}
                role="manager"
                handleLogout={handleLogout}
                handleReport={() => handleNavigation('/reports')} 
                handleEmployeeManagement={() => handleNavigation('/employee-management')}  
                handleHome={() => handleNavigation('/admin')}  
            />
            <div className="container mt-5">
                {loading ? (
                    <p>טוען דוחות...</p>
                ) : (
                    <div>
                        {reports.length > 0 ? (
                            <div>
                                <h1 className="text-center">כל הדוחות</h1>
                                <div className="d-flex justify-content-end mb-4">
                                    <button className="btn btn-export" onClick={exportToExcel}>
                                        יצוא דוחות ל-Excel
                                    </button>
                                </div>
                                <div className="table-responsive">
                                    <table className="table table-striped table-bordered mt-3">
                                        <thead>
                                            <tr>
                                                <th>שם עובד</th>
                                                <th>תאריך</th>
                                                <th>הספקים</th>
                                                <th>סה"כ</th>
                                                <th>פעולות</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {reports.map((report, index) => {
                                                const totalSum = report.deliverables.reduce((sum, item) => sum + item.total, 0);
                                                return (
                                                    <tr key={index}>
                                                        <td className="employee-name">
                                                            {employeeNames[report.employeeId] || 'טוען...'}
                                                        </td>
                                                        <td className="report-date">{report.date}</td>
                                                        <td>
                                                            <div className="deliverables-list">
                                                                {report.deliverables.map((item, idx) => (
                                                                    <div className="deliverable-item" key={`${item.project}-${idx}`}>
                                                                        <p><strong>פרוייקט:</strong> {item.project}</p>
                                                                        <p><strong>סעיף:</strong> {item.seif}</p>
                                                                        <p><strong>סימן:</strong> {item.sign}</p>
                                                                        <p><strong>כמות:</strong> {item.quantity}</p>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </td>
                                                        <td>{totalSum}</td>
                                                        <td>
                                                            <div className="button-container">
                                                                {/* <button className="btn btn-success" onClick={() => handleEditReport(report)}>
                                                                    ערוך
                                                                </button> */}
                                                                <button className="btn btn-danger" onClick={() => handleDelete(report._id)}>
                                                                    מחק
                                                                </button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        ) : (
                            <p className="no-reports text-center">כרגע אין דוחות.</p>
                        )}
                    </div>
                )}
            </div>
        </div>
    );


};
export default Reports;
