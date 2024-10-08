// קונטרולר קובץ, כרגע לא נוגעים בו
// import React, { useState } from 'react';
// import fileService from '../../../services/file.service';
// import { FileData } from '../../../interfaces/file.interface';

// const FileUpload: React.FC = () => {
//   const [file, setFile] = useState<File | null>(null);
//   const [uploadedBy, setUploadedBy] = useState<string>('1'); // אתה יכול לשנות את הערך הזה למזהה המשתמש המתאים
//   const [assignedTo, setAssignedTo] = useState<string>('2'); // אתה יכול לשנות את הערך הזה למזהה המשתמש המתאים

//   const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
//     if (event.target.files) {
//       setFile(event.target.files[0]);
//     }
//   };

//   const handleUpload = async () => {
//     if (file) {
//       const formData = new FormData();
//       formData.append('file', file);
//       const fileData: FileData = {
//         uploadedBy,
//         assignedTo,
//         fileName: file.name,
//         filePath: '', // זה יתמלא לאחר ההעלאה
//       };

//       try {
//         const response = await fileService.uploadFile(fileData, formData);
//         console.log('File uploaded successfully:', response);
//       } catch (error) {
//         console.error('Error uploading file:', error);
//       }
//     }
//   };

//   return (
//     <div>
//       <input type="file" onChange={handleFileChange} />
//       <button onClick={handleUpload}>Upload</button>
//     </div>
//   );
// };

// export default FileUpload;
