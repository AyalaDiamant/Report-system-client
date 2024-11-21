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
    const [message, setMessage] = useState<string | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null); // הודעת שגיאה
    const [currentDocument, setCurrentDocument] = useState<Document>();
    const [availableReviewer, setAvailableReviewer] = useState<Employee | null>(null);
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [currentEmployee, setCurrentEmployee] = useState<Employee | null>(null);

    const { user } = useUser();
    const navigate = useNavigate();

    const showMessage = (msg: string, error: boolean) => {
        const duration = 5000
        if(error){
            setErrorMessage(msg);
            setTimeout(() => setErrorMessage(null), duration);
        }
        else{
            setMessage(msg);
            setTimeout(() => setMessage(null), duration);
        }
    };

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
                    showMessage(`יש לך מסמך שהוקצה: ${assigned.originalName}`, false);
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
            showMessage('לא נבחר קובץ להעלאה', true);
            return;
        }
        try {
            // אם יש מסמך שהוקצה למשתמש הנוכחי
            if (assignedDocument) {
                if (file.name !== assignedDocument.originalName) {
                    showMessage('ניתן להעלות רק את המסמך שהוקצה לך!', true);
                    return;
                }
                // העלאת המסמך
                const uploadResponse = await uploadFile(file, user?.employeeId.toString() || "0", undefined);

                // עדכון המסמך החדש
                await updateDocumentUploader(uploadResponse.file._id, assignedDocument.uploadedBy);

                // עדכון סטטוס `isAvailable` למשתמש המקורי
                const updateEmployee = { ...currentEmployee, isAvailable: true }

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

                showMessage('המסמך הועלה בהצלחה ונשלח לעורך שערך אותו.', false);
                setCurrentDocument(updatedDocument);

            } else {
                const uploadResponse = await uploadFile(file, user?.employeeId.toString() || "0", undefined);
                setCurrentDocument(uploadResponse.file);
                await assignReviewerToDocument(uploadResponse.file._id); // ננסה להקצות מבקר פנוי למסמך החדש
                showMessage('המסמך הועלה בהצלחה!', false);
            }
        } catch (error) {
            console.error('Error uploading file:', error);
            showMessage('שגיאה בהעלאת הקובץ', true);
        }
    };

    const assignReviewerToDocument = async (documentId: any) => {
        try {
            const reviewer = employees.find(emp => emp.roles.some(role => role.name === 'ביקורת') && emp.isAvailable);
            if (reviewer) {
                await assignReviewerToFile(documentId, reviewer._id.toString());
                reviewer.isAvailable = false;
                setAvailableReviewer(reviewer);
                showMessage(`נמצא מבקר פנוי: ${reviewer.name}`, false);
            } else {
                setAvailableReviewer(null);
                showMessage('המסמך הועבר לתור ממתינים', false);
            }
        } catch (error) {
            console.error('Error assigning reviewer to document:', error);
        }
    };

    const navigateTo = (path: string) => navigate(path);

    return (
        <>
            <Header
                user={user}
                role="employee"
                handleLogout={() => navigateTo('/login')}
                handleReport={() => navigateTo('/report')}
                toggleShowReports={() => navigateTo('/reports-employee')}
                handleHome={() => navigateTo('/employee')}
                handleDocument={() => navigateTo('/document')}
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
                {errorMessage && (
                    <div className="alert alert-danger" role="alert">
                        {errorMessage}
                    </div>
                )}
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
