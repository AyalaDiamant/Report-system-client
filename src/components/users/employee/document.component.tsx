import React, { useState, useEffect } from 'react';
import { Document } from '../../../interfaces/file.interface';
import { uploadFile, getAllDocuments, assignReviewerToFile, updateDocumentUploader } from '../../../services/file.service';
import { useUser } from '../../../contexts/user.context';
import { useNavigate } from 'react-router-dom';
import Header from '../../header.component';
import { Employee } from '../../../interfaces/employee.interface';
import employeeService from '../../../services/employee.service';

const DocumentsPage = () => {
    const [file, setFile] = useState<File | null>(null);
    const [documents, setDocuments] = useState<Document[]>([]);
    const [assignedDocument, setAssignedDocument] = useState<Document | null>(null);
    const [message, setMessage] = useState('');
    const [currentDocument, setCurrentDocument] = useState<Document>();
    const [availableReviewer, setAvailableReviewer] = useState<Employee | null>(null);
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [currentEmployee, setCurrentEmployee] = useState<Employee | null>(null);

    const { user } = useUser();
    const navigate = useNavigate();

    const fetchEmployees = async () => {
        try {
            const data = await employeeService.getAllEmployees();
            setEmployees(data);
        } catch (error) {
            console.error('Error fetching employees:', error);
        }
    };

    const fetchCurrentEmployee = async () => {
        try {
            if (user?.employeeId !== undefined) {
                const fetchEmployee = await employeeService.getEmployeeById(user?.employeeId);
                setCurrentEmployee(fetchEmployee);
            }
        } catch (error) {
            console.error('Error updating employee:', error);
        }
    }

    // טעינת כל המסמכים ובדיקת הקצאה
    useEffect(() => {
        fetchEmployees();
        fetchCurrentEmployee()
        const loadDocuments = async () => {
            try {
                const docs = await getAllDocuments();
                setDocuments(docs);
                // בדיקת הקצאה למשתמש הנוכחי
                const assigned = docs.find((doc: Document) => doc.assignedTo === user?.employeeId.toString());
                if (assigned) {
                    setAssignedDocument(assigned);
                    setMessage(`יש לך מסמך שהוקצה: ${assigned.originalName}`);
                }
            } catch (error) {
                console.error('Error loading documents:', error);
            }
        };

        loadDocuments();
    }, [user?.employeeId]);

    // פונקציית העלאת מסמך
    const handleFileUpload = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!file) {
            alert('לא נבחר קובץ להעלאה');
            return;
        }
        try {
            // אם יש מסמך שהוקצה למשתמש הנוכחי
            if (assignedDocument) {
                alert(assignedDocument.originalName)
                if (file.name !== assignedDocument.originalName) {
                    alert('ניתן להעלות רק את המסמך שהוקצה לך!');
                    return;
                }
                // העלאת המסמך
                const uploadResponse = await uploadFile(file, user?.employeeId.toString() || "0", undefined);

                // עדכון המסמך החדש
                await updateDocumentUploader(uploadResponse.file._id, assignedDocument.uploadedBy);

                // עדכון סטטוס `isAvailable` למשתמש המקורי
                const updateEmployee = { ...currentEmployee, isAvailable: true }
                alert(`${updateEmployee.isAvailable} updateEmployee.isAvailable`)

                if (updateEmployee) {
                    try {
                        await employeeService.updateEmployee(user?.employeeId, updateEmployee);
                    } catch (error) {
                        console.error('Error updating employee:', error);
                    }
                }

                // עדכון המסמך
                const idForUploadedBy = updateEmployee._id?.toString();
                const updatedDocument = {
                    ...assignedDocument,
                    assignedTo: assignedDocument.uploadedBy,
                    uploadedBy: idForUploadedBy as Document["uploadedBy"],
                    status: 'חזר מבדיקה' as Document["status"]
                };

                setDocuments(docs =>
                    docs.map(doc => (doc._id === assignedDocument._id ? updatedDocument : doc))
                );

                alert('המסמך הועלה בהצלחה והוקצה למעלה הקודם!');
                alert(currentEmployee?.isAvailable)
                setCurrentDocument(updatedDocument);

            } else {
                const uploadResponse = await uploadFile(file, user?.employeeId.toString() || "0", undefined);
                setCurrentDocument(uploadResponse.file);
                await assignReviewerToDocument(uploadResponse.file._id); // ננסה להקצות מבקר פנוי למסמך החדש
                alert('המסמך הועלה בהצלחה!');
                // alert('לא הוקצה לך מסמך, אינך יכול להעלות מסמך!');
            }
        } catch (error) {
            console.error('Error uploading file:', error);
            alert('שגיאה בהעלאת הקובץ');
        }
    };

    const assignReviewerToDocument = async (documentId: any) => {
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

                {message && (
                    <div className="alert alert-info" role="alert">
                        {message}
                    </div>
                )}

                <div className="card">
                    <div className="card-body">
                        {assignedDocument ? (
                            <>
                                <p><strong>מסמך שהוקצה לך:</strong> {assignedDocument.originalName}</p>
                                <p><strong>סטטוס:</strong> {assignedDocument.status}</p>
                            </>
                        ) : (
                            <p>לא הוקצה לך מסמך.</p>
                        )}
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

