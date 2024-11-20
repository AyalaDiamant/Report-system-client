import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ReportService from '../../../services/report.service';
// import FileService from '../../../services/file.service'; // סרויס לקובץ
import { useUser } from '../../../contexts/user.context';
import { MyReport } from '../../../interfaces/report.interface';
import Header from '../../header.component';

const Employee: React.FC = () => {
    const [reports, setReports] = useState<MyReport[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    // const [showReports, setShowReports] = useState<boolean>(false);
    // const [editingReportId, setEditingReportId] = useState<number | null>(null);
    // const [editedReportData, setEditedReportData] = useState<any>({});
    // const [originalReportData, setOriginalReportData] = useState<MyReport | null>(null);
    // const [file, setFile] = useState<File | null>(null); // מצב לקובץ


    const navigate = useNavigate();
    const { user } = useUser();

    const loadReports = async () => {
        loading
        reports
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
        // זה בהערה רק כי זה עזה מלא בעיות בקונסול לבדוק למה זה בהערה!!!!!!
        // loadReports();
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
        navigate('/reports-employee');
    };

    const handleHome = () => {
        navigate('/employee');
    };

    const handleDocument = () => {
        navigate('/document');
    };


    // פונצקיה להעלאת קובץכרגע לא נוגעים בה
    // const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    //     if (e.target.files && e.target.files.length > 0) {
    //         setFile(e.target.files[0]);
    //     }
    // };


    // const handleUpload = async () => {
    //     if (!file) {
    //         alert('אנא בחר קובץ להעלות.');
    //         return;
    //     }

    //     try {
    //         let id = user?.employeeId || 0;
    //         await FileService.uploadFile(file, id); // ודא שהפונקציה uploadFile מקבלת FormData
    //         alert('הקובץ הועלה בהצלחה!');
    //         setFile(null); // ניקוי מצב הקובץ לאחר ההעלאה
    //     } catch (error) {
    //         console.error('Error uploading file:', error);
    //         alert('שגיאה בהעלאת הקובץ.');
    //     }
    // };


    return (
        <div>
            <Header
                user={user}
                role="employee" // מצב של עובד
                handleLogout={handleLogout}
                handleReport={handleReport}
                toggleShowReports={toggleShowReports} // העברת פונקציה
                handleHome={handleHome}
                handleDocument={handleDocument}
            />
            <div className="container mt-5">
                <h1>עמוד עובד</h1>
                {/* כפתור להעלאת קובץ כרגע לא נוגעים בו */}
                {/* <input type="file" onChange={handleFileChange} />
                <button onClick={handleUpload} disabled={!file}>העלה קובץ</button> */}

            </div>
        </div>
    );
};

export default Employee;

