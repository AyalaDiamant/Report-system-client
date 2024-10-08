import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ReportService from '../../../services/report.service';
import { useUser } from '../../../contexts/user.context';
import { Deliverable, MyReport } from '../../../interfaces/report.interface';
import Enums from '../../../interfaces/enums';
import Header from '../../header.component';

const Employee: React.FC = () => {
    const [reports, setReports] = useState<MyReport[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [showReports, setShowReports] = useState<boolean>(false);
    const [editingReportId, setEditingReportId] = useState<number | null>(null);
    const [editedReportData, setEditedReportData] = useState<any>({});
    const [originalReportData, setOriginalReportData] = useState<MyReport | null>(null);

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

    const handleLogout = () => {
        localStorage.removeItem('token');
        sessionStorage.removeItem('token');
        navigate('/login');
    };

    const handleReport = () => {
        navigate('/report');
    };

    const toggleShowReports = () => {
        setShowReports(!showReports);
    };

    const handleHome = () => {
        navigate('/employee');
    };

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

    const handleEditReport = (report: MyReport) => {
        setEditingReportId(report._id);
        setOriginalReportData(report); // שמירת הנתונים המקוריים
        setEditedReportData(report.deliverables.map((item) => ({
            type: item.type,
            quantity: item.quantity,
            seif: item.seif || '', // וודא שהשדה הזה קיים
            sign: item.sign || '',
        })));
    };

    const handleChange = (idx: number, field: keyof Deliverable, value: string | number) => {
        setEditedReportData((prevData: any) => {
            const updatedData = [...prevData];
            updatedData[idx] = { ...updatedData[idx], [field]: value }; // עדכון רק את השדה הנבחר

            return updatedData;
        });
    };

    const handleSaveEdit = async () => {
        if (!originalReportData) return;

        const updatedReport: MyReport = {
            ...originalReportData, // Copy original data
            deliverables: editedReportData.map((deliverable: any, idx: string | number) => ({
                ...originalReportData.deliverables[Number(idx)], // Keep the original fields
                ...deliverable, // Update only changed fields
            })),
        };

        try {
            const response = await ReportService.updateReport(originalReportData._id, updatedReport);
            console.log('Updated Report:', response); // Log the response from the server
        } catch (error) {
            console.error('Error saving changes:', error);
        }

        // Reset the editing state
        setEditingReportId(null);
        setEditedReportData([]);
        loadReports();
    };

    return (
        <div>
            <Header
                user={user}
                role="employee" // מצב של עובד
                handleLogout={handleLogout}
                handleReport={handleReport}
                toggleShowReports={toggleShowReports} // העברת פונקציה
                handleHome={handleHome}
            />
            <div className="container mt-5">
                <h1>עמוד עובד</h1>
                {showReports && (
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
                                                                        <p><strong>תפקיד:</strong> {item.role}</p>
                                                                        <p><strong>פרוייקט:</strong> {item.project}</p>
                                                                        <p><strong>סעיף:</strong> {item.seif}</p>
                                                                        <p><strong>סימן:</strong> {item.sign}</p>
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
                                                        <div className="d-flex justify-content-between">
                                                            <button className="btn btn-primary" onClick={() => handleEditReport(report)}>
                                                                ערוך
                                                            </button>
                                                            <button className="btn btn-danger" onClick={() => handleDelete(report._id)}>
                                                                מחק
                                                            </button>
                                                        </div>
                                                    </div>

                                                    {editingReportId === report._id && (
                                                        <div className="card-body mt-3">
                                                            <h6>ערוך דוח</h6>
                                                            {editedReportData.map((deliverable: Deliverable, idx: number) => (
                                                                <div key={idx} className="mb-3">
                                                                    <select
                                                                        id="type"
                                                                        name="type"
                                                                        value={deliverable.type}
                                                                        onChange={(e) => handleChange(idx, 'type', e.target.value)}
                                                                        className="form-control"
                                                                        required
                                                                    >
                                                                        <option value="">בחר סוג</option>
                                                                        {Object.values(Enums.ReportType).map((type) => (
                                                                            <option key={type} value={type}>{type}</option>
                                                                        ))}
                                                                    </select>
                                                                    <input
                                                                        type="number"
                                                                        className="form-control mt-2"
                                                                        placeholder="כמות"
                                                                        value={deliverable.quantity}
                                                                        onChange={(e) => handleChange(idx, 'quantity', e.target.value)}
                                                                    />
                                                                    <input
                                                                        type="text"
                                                                        className="form-control mt-2"
                                                                        placeholder="סעיף"
                                                                        value={deliverable.seif}
                                                                        onChange={(e) => handleChange(idx, 'seif', e.target.value)}
                                                                    />
                                                                    <input
                                                                        type="text"
                                                                        className="form-control mt-2"
                                                                        placeholder="סימן"
                                                                        value={deliverable.sign}
                                                                        onChange={(e) => handleChange(idx, 'sign', e.target.value)}
                                                                    />
                                                                </div>
                                                            ))}
                                                            <button className="btn btn-success mt-2" onClick={handleSaveEdit}>
                                                                שמור שינויים
                                                            </button>
                                                            <button className="btn btn-secondary mt-2" onClick={() => setEditingReportId(null)}>
                                                                ביטול
                                                            </button>
                                                        </div>
                                                    )}
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

