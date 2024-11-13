// import React, { useState, useEffect } from 'react';
// import { Document } from '../../../interfaces/file.interface';
// import { uploadFile, getAssignedDocuments, updateEmployeeAvailability } from '../../../services/file.service';
// import { useUser } from '../../../contexts/user.context';
// import { Employee } from '../../../interfaces/employee.interface';
// import employeeService from '../../../services/employee.service';


// const DocumentsPage = () => {
//     const [file, setFile] = useState<File | null>(null);
//     const [assignedDocuments, setAssignedDocuments] = useState<Document[]>([]);
//     const [employees, setEmployees] = useState<Employee[]>([]);
//     const [availableReviewer, setAvailableReviewer] = useState<Employee>(); // לשמירת התוצאה של הפונקציה
//     const [message, setMessage] = useState('');

//     //   const [userId, setUserId] = useState('1'); // זה המשתמש המחובר (ה-ID שלו)

//     const { user } = useUser();
//     // פונקציה להעלאת קובץ
//     // const handleFileUpload = async (e: React.FormEvent) => {
//     //     e.preventDefault();
//     //     if (!file) {
//     //         alert('לא נבחר קובץ להעלאה');
//     //         return;
//     //     }

//     //     try {
//     //         const response = await uploadFile(file, (user?.employeeId || 0).toString(), null);  // אם לא מייעדים לעובד, לא מעבירים assignedTo
//     //         alert(response.message);
//     //         loadAssignedDocuments(); // טוען שוב את המסמכים לאחר העלאת קובץ חדש
//     //     } catch (error) {
//     //         console.error('Error uploading file:', error);
//     //         alert('שגיאה בהעלאת הקובץ');
//     //     }
//     // };

//     const handleFileUpload = async (e: React.FormEvent) => {
//         e.preventDefault();
//         if (!file) {
//             alert('לא נבחר קובץ להעלאה');
//             return;
//         }

//         try {
//             // העברת ה-ID של העובד שמחובר לצורך העלאה
//             const response = await uploadFile(file, user?.employeeId.toString() || "0", null);  // העבר את ה-ID של המעלה
//             alert(response.message);
//             loadAssignedDocuments(); // טוען שוב את המסמכים לאחר העלאת קובץ חדש
//         } catch (error) {
//             console.error('Error uploading file:', error);
//             alert('שגיאה בהעלאת הקובץ');
//         }
//     };

//     // פונקציה להעלאת המסמכים המוקצים למשתמש
//     const loadAssignedDocuments = async () => {
//         try {
//             const documents = await getAssignedDocuments((user?.employeeId || 0).toString());
//             setAssignedDocuments(documents);
//         } catch (error) {
//             console.error('Error fetching assigned documents:', error);
//             console.log('שגיאה בהבאת המסמכים');
//         }
//     };

//     useEffect(() => {
//         loadAssignedDocuments(); // טוען את המסמכים ברגע שהקומפוננטה נטענת
//         fetchEmployees();
//     }, [user?.employeeId]); // טוען את המסמכים גם אם יש שינוי ב-ID של המשתמש

//     const fetchEmployees = async () => {
//         try {
//             const data = await employeeService.getAllEmployees();
//             setEmployees(data);
//         } catch (error) {
//             console.error('Error fetching employees:', error);
//         }
//     };

//     const findAvailable = async () => {
//         const reviewers = employees.filter(emp => emp.roles.some(role => role.name === 'ביקורת'));
//         const available = reviewers.find(emp => emp.isAvailable);

//         if (available) {
//             await updateEmployeeAvailability(available._id, false);
//             setAvailableReviewer(available);
//             setMessage(`נמצא מבקר פנוי: ${available.name}`);
//         } else {
//             setAvailableReviewer(undefined);
//             setMessage('אין מבקר פנוי');
//         }
//     };

//     return (
//         <div>
//             <h1>ניהול מסמכים</h1>

//             <section>
//                 <h2>העלאת מסמך</h2>
//                 <form onSubmit={handleFileUpload}>
//                     <input type="file" onChange={(e) => setFile(e.target.files ? e.target.files[0] : null)} />
//                     <button type="submit">העלה מסמך</button>
//                 </form>
//             </section>

//             <section>
//                 <h2>המסמכים שבאחריותי</h2>
//                 {assignedDocuments.length > 0 ? (
//                     <ul>
//                         {assignedDocuments.map((doc) => (
//                             <li key={doc._id}>
//                                 <span>{doc.originalName}</span> - <span>{doc.status}</span>
//                             </li>
//                         ))}
//                     </ul>
//                 ) : (
//                     <p>אין מסמכים באחריותך.</p>
//                 )}
//             </section>
//             <div>
//                 <button onClick={findAvailable}>חפש מבקר פנוי</button>
//                 {message && <p>{message}</p>}
//             </div>

//         </div>
//     );
// };

// export default DocumentsPage;

import React, { useState, useEffect } from 'react';
import { Document } from '../../../interfaces/file.interface';
import { uploadFile, getAssignedDocuments, updateEmployeeAvailability } from '../../../services/file.service';
import { useUser } from '../../../contexts/user.context';
import { Employee } from '../../../interfaces/employee.interface';
import employeeService from '../../../services/employee.service';
import { useNavigate } from 'react-router-dom';
import Header from '../../header.component';

const DocumentsPage = () => {
    const [file, setFile] = useState<File | null>(null);
    const [assignedDocuments, setAssignedDocuments] = useState<Document[]>([]);
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [availableReviewer, setAvailableReviewer] = useState<Employee>();
    const [message, setMessage] = useState('');

    const { user } = useUser();
    const navigate = useNavigate();

    const handleFileUpload = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!file) {
            alert('לא נבחר קובץ להעלאה');
            return;
        }

        try {
            const response = await uploadFile(file, user?.employeeId.toString() || "0", null);
            alert(response.message);
            loadAssignedDocuments(); // טוען שוב את המסמכים לאחר העלאת קובץ חדש
        } catch (error) {
            console.error('Error uploading file:', error);
            alert('שגיאה בהעלאת הקובץ');
        }
    };

    const loadAssignedDocuments = async () => {
        try {
            const documents = await getAssignedDocuments((user?.employeeId || 0).toString());
            setAssignedDocuments(documents);
        } catch (error) {
            console.error('Error fetching assigned documents:', error);
            console.log('שגיאה בהבאת המסמכים');
        }
    };

    useEffect(() => {
        loadAssignedDocuments();
        fetchEmployees();
    }, [user?.employeeId]);

    const fetchEmployees = async () => {
        try {
            const data = await employeeService.getAllEmployees();
            setEmployees(data);
        } catch (error) {
            console.error('Error fetching employees:', error);
        }
    };

    const findAvailable = async () => {
        const reviewers = employees.filter(emp => emp.roles.some(role => role.name === 'ביקורת'));
        const available = reviewers.find(emp => emp.isAvailable);

        if (available) {
            await updateEmployeeAvailability(available._id, false);
            setAvailableReviewer(available);
            setMessage(`נמצא מבקר פנוי: ${available.name}`);
        } else {
            setAvailableReviewer(undefined);
            setMessage('אין מבקר פנוי');
        }
    };

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

    return (
        <>
            <Header
                user={user}
                role="employee" // מצב של עובד
                handleLogout={handleLogout}
                handleReport={handleReport}
                toggleShowReports={toggleShowReports} // העברת פונקציה
                handleHome={handleHome}
                handleDocument={handleDocument}
            />

            <div className="container mt-4">
                <h1 className="text-center mb-4">ניהול מסמכים</h1>

                <div className="card mb-4">
                    <div className="card-body">
                        <h5 className="card-title">העלאת מסמך</h5>
                        <form onSubmit={handleFileUpload}>
                            <div className="form-row align-items-center">
                                <div className="col-md-8 mb-3">
                                    <input
                                        type="file"
                                        className="form-control"
                                        onChange={(e) => setFile(e.target.files ? e.target.files[0] : null)}
                                    />
                                </div>
                                <div className="col-md-4 mb-3">
                                    <button type="submit" className="btn btn-primary btn-block">
                                        העלה מסמך
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>

                <div className="card mb-4">
                    <div className="card-body">
                        <h5 className="card-title">המסמכים שבאחריותי</h5>
                        {assignedDocuments.length > 0 ? (
                            <ul className="list-group">
                                {assignedDocuments.map((doc) => (
                                    <li key={doc._id} className="list-group-item d-flex justify-content-between align-items-center">
                                        {doc.originalName}
                                        <span className="badge badge-secondary">{doc.status}</span>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-muted">אין מסמכים באחריותך.</p>
                        )}
                    </div>
                </div>

                <div className="card">
                    <div className="card-body">
                        <button onClick={findAvailable} className="btn btn-secondary btn-block">
                            חפש מבקר פנוי
                        </button>
                        {message && <p className="mt-2 text-muted">{message}</p>}
                    </div>
                </div>
            </div>
        </>
    );
};

export default DocumentsPage;

