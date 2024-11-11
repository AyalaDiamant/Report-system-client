// // components/DocumentsUpload.js
// import React, { useState } from 'react';
// import axios from 'axios';

// const DocumentsUpload = () => {
//     const [file, setFile] = useState(null);
//     const [assignedTo, setAssignedTo] = useState('');
//     const [uploadStatus, setUploadStatus] = useState('');

//     // פונקציה לעדכון הקובץ שנבחר
//     const handleFileChange = (e: any) => {
//         setFile(e.target.files[0]);
//     };

//     // פונקציה לשליחת הקובץ לשרת
//     const handleSubmit = async (e: any) => {
//         e.preventDefault();

//         if (!file) {
//             setUploadStatus('בחר קובץ להעלאה.');
//             return;
//         }

//         const formData = new FormData();
//         formData.append('file', file);
//         formData.append('uploadedBy', '12345'); // פה צריך לשים את מזהה העובד שמעלה את הקובץ
//         formData.append('assignedTo', assignedTo);

//         try {
//             const response = await axios.post('/api/files/upload', formData, {
//                 headers: {
//                     'Content-Type': 'multipart/form-data'
//                 }
//             });
//             setUploadStatus('הקובץ הועלה בהצלחה!');
//             setFile(null); // איפוס הקובץ לאחר ההעלאה
//             setAssignedTo(''); // איפוס שדה ההקצאה
//         } catch (error) {
//             console.error('Error uploading file:', error);
//             setUploadStatus('שגיאה בהעלאת הקובץ.');
//         }
//     };

//     return (
//         <div>
//             <h2>העלאת מסמך</h2>
//             <form onSubmit={handleSubmit}>
//                 <div>
//                     <label>בחר קובץ:</label>
//                     <input type="file" onChange={handleFileChange} />
//                 </div>
//                 <div>
//                     <label>הקצה למגיהה:</label>
//                     <input
//                         type="text"
//                         value={assignedTo}
//                         onChange={(e) => setAssignedTo(e.target.value)}
//                         placeholder="הכנס מזהה של המגיהה"
//                     />
//                 </div>
//                 <button type="submit">העלה מסמך</button>
//             </form>
//             {uploadStatus && <p>{uploadStatus}</p>}
//         </div>
//     );
// };

// export default DocumentsUpload;

// // components/DocumentsPage.tsx
// import React, { useState, useEffect } from 'react';
// import { Document } from '../../../interfaces/file.interface';
// import { uploadFile, getAssignedDocuments } from '../../../services/file.service';

// const DocumentsPage = () => {
//   const [file, setFile] = useState<File | null>(null);
//   const [assignedDocuments, setAssignedDocuments] = useState<Document[]>([]);
//   const [userId, setUserId] = useState('user123'); // זה המשתמש המחובר (ה-ID שלו)

//   const handleFileUpload = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!file) {
//       alert('לא נבחר קובץ להעלאה');
//       return;
//     }

//     try {
//       const response = await uploadFile(file, userId, null);  // אם לא מייעדים לעובד, לא מעבירים assignedTo
//       alert(response.message);
//       loadAssignedDocuments(); // טוען שוב את המסמכים לאחר העלאת קובץ חדש
//     } catch (error) {
//       console.error('Error uploading file:', error);
//       alert('Error uploading file');
//     }
//   };

//   const loadAssignedDocuments = async () => {
//     try {
//       const documents = await getAssignedDocuments(userId);
//       setAssignedDocuments(documents);
//     } catch (error) {
//       console.error('Error fetching assigned documents:', error);
//     }
//   };

//   useEffect(() => {
//     loadAssignedDocuments();
//   }, [userId]); // טוען את המסמכים גם אם יש שינוי ב-ID של המשתמש

//   return (
//     <div>
//       <h1>ניהול מסמכים</h1>

//       <section>
//         <h2>העלאת מסמך</h2>
//         <form onSubmit={handleFileUpload}>
//           <input type="file" onChange={(e) => setFile(e.target.files ? e.target.files[0] : null)} />
//           <button type="submit">העלה מסמך</button>
//         </form>
//       </section>

//       <section>
//         <h2>המסמכים שבאחריותי</h2>
//         {assignedDocuments.length > 0 ? (
//           <ul>
//             {assignedDocuments.map((doc) => (
//               <li key={doc._id}>
//                 <span>{doc.originalName}</span> - <span>{doc.status}</span>
//               </li>
//             ))}
//           </ul>
//         ) : (
//           <p>אין מסמכים באחריותך.</p>
//         )}
//       </section>
//     </div>
//   );
// };

// export default DocumentsPage;


import React, { useState, useEffect } from 'react';
import { Document } from '../../../interfaces/file.interface';
import { uploadFile, getAssignedDocuments } from '../../../services/file.service';
import { useUser } from '../../../contexts/user.context';

const DocumentsPage = () => {
    const [file, setFile] = useState<File | null>(null);
    const [assignedDocuments, setAssignedDocuments] = useState<Document[]>([]);
    //   const [userId, setUserId] = useState('1'); // זה המשתמש המחובר (ה-ID שלו)

    const { user } = useUser();
    // פונקציה להעלאת קובץ
    const handleFileUpload = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!file) {
            alert('לא נבחר קובץ להעלאה');
            return;
        }

        try {
            const response = await uploadFile(file, (user?.employeeId || 0).toString(), null);  // אם לא מייעדים לעובד, לא מעבירים assignedTo
            alert(response.message);
            loadAssignedDocuments(); // טוען שוב את המסמכים לאחר העלאת קובץ חדש
        } catch (error) {
            console.error('Error uploading file:', error);
            alert('שגיאה בהעלאת הקובץ');
        }
    };

    // פונקציה להעלאת המסמכים המוקצים למשתמש
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
        loadAssignedDocuments(); // טוען את המסמכים ברגע שהקומפוננטה נטענת
    }, [user?.employeeId]); // טוען את המסמכים גם אם יש שינוי ב-ID של המשתמש

    return (
        <div>
            <h1>ניהול מסמכים</h1>

            <section>
                <h2>העלאת מסמך</h2>
                <form onSubmit={handleFileUpload}>
                    <input type="file" onChange={(e) => setFile(e.target.files ? e.target.files[0] : null)} />
                    <button type="submit">העלה מסמך</button>
                </form>
            </section>

            <section>
                <h2>המסמכים שבאחריותי</h2>
                {assignedDocuments.length > 0 ? (
                    <ul>
                        {assignedDocuments.map((doc) => (
                            <li key={doc._id}>
                                <span>{doc.originalName}</span> - <span>{doc.status}</span>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>אין מסמכים באחריותך.</p>
                )}
            </section>
        </div>
    );
};

export default DocumentsPage;
