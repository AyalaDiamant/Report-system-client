// import React, { useState, useEffect } from 'react';
// import { Document } from '../../../interfaces/file.interface';
// import { uploadFile, getAssignedDocuments, updateEmployeeAvailability } from '../../../services/file.service';
// import { useUser } from '../../../contexts/user.context';
// import { Employee } from '../../../interfaces/employee.interface';
// import employeeService from '../../../services/employee.service';
// import { useNavigate } from 'react-router-dom';
// import Header from '../../header.component';

// const DocumentsPage = () => {
//     const [file, setFile] = useState<File | null>(null);
//     const [assignedDocuments, setAssignedDocuments] = useState<Document[]>([]);
//     const [employees, setEmployees] = useState<Employee[]>([]);
//     const [availableReviewer, setAvailableReviewer] = useState<Employee>();
//     const [message, setMessage] = useState('');
//     const [currentDocument, setCurrentDocument] = useState<Document>();


//     const { user } = useUser();
//     const navigate = useNavigate();

//     const handleFileUpload = async (e: React.FormEvent) => {
//         e.preventDefault();
//         if (!file) {
//             alert('לא נבחר קובץ להעלאה');
//             return;
//         }

//         try {
//             const response = await uploadFile(file, user?.employeeId.toString() || "0", null);
//             console.log(response.file);
//             setCurrentDocument(response.file)
//             loadAssignedDocuments(); // טוען שוב את המסמכים לאחר העלאת קובץ חדש
//         } catch (error) {
//             console.error('Error uploading file:', error);
//             alert('שגיאה בהעלאת הקובץ');
//         }
//     };

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
//         loadAssignedDocuments();
//         fetchEmployees();
//     }, [user?.employeeId]);

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

//     const handleLogout = () => {
//         localStorage.removeItem('token');
//         sessionStorage.removeItem('token');
//         navigate('/login');
//     };

//     const handleReport = () => {
//         navigate('/report');
//     };

//     const toggleShowReports = () => {
//         navigate('/reports-employee');
//     };

//     const handleHome = () => {
//         navigate('/employee');
//     };

//     const handleDocument = () => {
//         navigate('/document');
//     };

//     return (
//         <>
//             <Header
//                 user={user}
//                 role="employee" // מצב של עובד
//                 handleLogout={handleLogout}
//                 handleReport={handleReport}
//                 toggleShowReports={toggleShowReports} // העברת פונקציה
//                 handleHome={handleHome}
//                 handleDocument={handleDocument}
//             />

//             <div className="container mt-4">
//                 <h1 className="text-center mb-4">ניהול מסמכים</h1>

//                 <div className="card mb-4">
//                     <div className="card-body">
//                         <h5 className="card-title">העלאת מסמך</h5>
//                         <form onSubmit={handleFileUpload}>
//                             <div className="form-row align-items-center">
//                                 <div className="col-md-8 mb-3">
//                                     <input
//                                         type="file"
//                                         className="form-control"
//                                         onChange={(e) => setFile(e.target.files ? e.target.files[0] : null)}
//                                     />
//                                 </div>
//                                 <div className="col-md-4 mb-3">
//                                     <button type="submit" className="btn btn-primary btn-block">
//                                         העלה מסמך
//                                     </button>
//                                 </div>
//                             </div>
//                         </form>
//                     </div>
//                 </div>

//                 {/* <div className="card mb-4">
//                     <div className="card-body">
//                         <h5 className="card-title">המסמכים שבאחריותי</h5>
//                         {assignedDocuments.length > 0 ? (
//                             <ul className="list-group">
//                                 {assignedDocuments.map((doc) => (
//                                     <li key={doc._id} className="list-group-item d-flex justify-content-between align-items-center">
//                                         {doc.originalName}
//                                         <span className="badge badge-secondary">{doc.status}</span>
//                                     </li>
//                                 ))}
//                             </ul>
//                         ) : (
//                             <p className="text-muted">אין מסמכים באחריותך.</p>
//                         )}
//                     </div>
//                 </div> */}

//                 <div className="card">
//                     <div className="card-body">
//                         <button onClick={findAvailable} className="btn btn-secondary btn-block">
//                             חפש מבקר פנוי
//                         </button>
//                         {message && <p className="mt-2 text-muted">{message}</p>}
//                     </div>
//                 </div>
//                 <div className="card">
//                     <div className="card-body">
//                         {currentDocument ? (
//                             <>
//                                 <p><strong>מספר מזהה:</strong> {currentDocument._id}</p>
//                                 <p><strong>שם הקובץ המקורי:</strong> {currentDocument.originalName}</p>
//                                 <p><strong>סטטוס:</strong> {currentDocument.status}</p>
//                                 <p><strong>מעלה הקובץ:</strong> {currentDocument.uploadedBy}</p>
//                                 <p><strong>מוקצה ל:</strong> {currentDocument.assignedTo || "לא מוקצה"}</p>
//                                 <p><strong>נתיב הקובץ:</strong> {currentDocument.filePath}</p>
//                                 <p><strong>תאריך העלאה:</strong> {currentDocument.dateUploaded}</p>
//                             </>
//                         ) : (
//                             <p>לא נבחר מסמך להצגה</p>
//                         )}
//                     </div>
//                 </div>
//             </div>
//         </>
//     );
// };

// export default DocumentsPage;




import React, { useState, useEffect } from 'react';
import { Document } from '../../../interfaces/file.interface';
import { uploadFile, getAssignedDocuments, assignReviewerToFile } from '../../../services/file.service';
import { useUser } from '../../../contexts/user.context';
import { Employee } from '../../../interfaces/employee.interface';
import employeeService from '../../../services/employee.service';
import { useNavigate } from 'react-router-dom';
import Header from '../../header.component';

const DocumentsPage = () => {
    const [file, setFile] = useState<File | null>(null);
    const [assignedDocuments, setAssignedDocuments] = useState<Document[]>([]);
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [availableReviewer, setAvailableReviewer] = useState<Employee | null>(null);
    const [message, setMessage] = useState('');
    const [currentDocument, setCurrentDocument] = useState<Document | null>(null);

    const { user } = useUser();
    const navigate = useNavigate();

    const handleFileUpload = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!file) {
            alert('לא נבחר קובץ להעלאה');
            return;
        }

        try {
            const response = await uploadFile(file, user?.employeeId.toString() || "0", undefined);
            setCurrentDocument(response.file);
            await assignReviewerToDocument(response.file._id); // ננסה להקצות מבקר פנוי למסמך החדש
            // loadAssignedDocuments(); // טוען שוב את המסמכים לאחר העלאת קובץ חדש
        } catch (error) {
            console.error('Error uploading file:', error);
            alert('שגיאה בהעלאת הקובץ');
        }
    };

    const assignReviewerToDocument = async (documentId: any) => {
        // try {
        //     const reviewer = employees.find(emp => emp.roles.some(role => role.name === 'ביקורת') && emp.isAvailable);
        //     if (reviewer) {
        //         await assignReviewerToFile(documentId, reviewer._id.toString());
        //         reviewer.isAvailable = false;
        //         setAvailableReviewer(reviewer);
        //         setMessage(`נמצא מבקר פנוי: ${reviewer.name}`);
        //     } else {
        //         setAvailableReviewer(null);
        //         setMessage('אין מבקר פנוי');
        //     }
        // } catch (error) {
        //     console.error('Error assigning reviewer to document:', error);
        // }
        try {
            const reviewer = employees.find(emp => emp.roles.some(role => role.name === 'ביקורת') && emp.isAvailable);
            if (reviewer) {
                await assignReviewerToFile(documentId, reviewer._id.toString());
                reviewer.isAvailable = false;
                setAvailableReviewer(reviewer);
                setMessage(`נמצא מבקר פנוי: ${reviewer.name}`);
            } else {
                setAvailableReviewer(null);
                setMessage('המסמך הועבר לתור ממתינים');
            }
        } catch (error) {
            console.error('Error assigning reviewer to document:', error);
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
        // loadAssignedDocuments();
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
                role="employee"
                handleLogout={handleLogout}
                handleReport={handleReport}
                toggleShowReports={toggleShowReports}
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

                <div className="card">
                    <div className="card-body">
                        {message && <p className="mt-2 text-muted">{message}</p>}
                    </div>
                </div>
                <div className="card">
                    <div className="card-body">
                        {currentDocument ? (
                            <>
                                <p><strong>מספר מזהה:</strong> {currentDocument._id}</p>
                                <p><strong>שם הקובץ המקורי:</strong> {currentDocument.originalName}</p>
                                <p><strong>סטטוס:</strong> {currentDocument.status}</p>
                                <p><strong>מעלה הקובץ:</strong> {currentDocument.uploadedBy}</p>
                                <p><strong>מוקצה ל:</strong> {currentDocument.assignedTo || "לא מוקצה"}</p>
                                <p><strong>נתיב הקובץ:</strong> {currentDocument.filePath}</p>
                                <p><strong>תאריך העלאה:</strong> {currentDocument.dateUploaded}</p>
                            </>
                        ) : (
                            <p>לא נבחר מסמך להצגה</p>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default DocumentsPage;
