// סרוייס של קובץ, כרגע לא נוגעים בו.
// import axios from 'axios';
// import { FileData } from '../interfaces/file.interface';
// //
// const API_URL = 'http://localhost:3000/api/files/upload'; // עדכן לכתובת ה-API שלך


// // const uploadFile = async (formData: FormData) => {
// //   console.log(formData);
  
// //   return axios.post('http://localhost:3000/api/files/upload', formData, {
// //     headers: {
// //       'Content-Type': 'multipart/form-data',
// //     },
// //   });

// // }

// // const uploadFile = async (file : File) => {
// //   const formData = new FormData();
// //   formData.append('file', file);
// //   formData.append('uploadedBy', 'שם המעלה'); // או מזהה משתמש
// //   formData.append('assignedTo', 'שם המוקצה'); // או מזהה משתמש אחר

// //   try {
// //       const response = await axios.post('http://localhost:3000/api/files/upload', formData, {
// //           headers: {
// //               'Content-Type': 'multipart/form-data',
// //           },
// //       });
// //       console.log('File uploaded successfully', response.data);
// //   } catch (error) {
// //       console.error('Error uploading file:', error);
// //   }
// // };
// const uploadFile = async (file: File, uploadedById: number ) => {
//     const formData = new FormData();
//     formData.append('file', file);
//     formData.append('uploadedBy', uploadedById.toString()); // הכנס כאן את המזהה של המעלה (מספר)
//     formData.append('assignedTo', uploadedById.toString()); // הכנס כאן את המזהה של המוקצה (מספר)
//     formData.append('status', 'בבדיקה')
  
//     try {
//         const response = await axios.post(`${API_URL}`, formData, {
//             headers: {
//                 'Content-Type': 'multipart/form-data',
//             },
//         });
//         console.log('File uploaded successfully', response.data);
//     } catch (error) {
//         console.error('Error uploading file:', error);
//     }
//   };

// export default {
//   uploadFile,
// };


// services/DocumentService.ts
// import axios from 'axios';
// import { Document } from '../interfaces/file.interface';

// const API_URL = 'http://localhost:3000/api/files/upload';

// export const uploadFile = async (file: File, uploadedBy: string, assignedTo: string | null) => {
//   const formData = new FormData();
//   formData.append('file', file);
//   formData.append('uploadedBy', uploadedBy);
//   if (assignedTo) {
//     formData.append('assignedTo', assignedTo);
//   }

//   try {
//     const response = await axios.post(`${API_URL}`, formData, {
//       headers: { 'Content-Type': 'multipart/form-data' },
//     });
//     return response.data; // מצפה לשוב את המידע על הקובץ שהועלה
//   } catch (error) {
//     throw new Error('Error uploading file');
//   }
// };

// export const getAssignedDocuments = async (userId: string) => {
//   try {
//     const response = await axios.get(`${API_URL}/assigned/${userId}`);
//     return response.data.documents; // מצפה לשוב את רשימת המסמכים
//   } catch (error) {
//     throw new Error('Error fetching assigned documents');
//   }
// };


import axios from 'axios';
import { Document } from '../interfaces/file.interface';

const API_URL = 'http://localhost:3000/api/files';  // עדכון לכתובת ה-API שלך

// פונקציה להעלאת קובץ
export const uploadFile = async (file: File, uploadedBy: string, assignedTo: string | null) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('uploadedBy', uploadedBy);  // מזהה המעלה
  if (assignedTo) {
    formData.append('assignedTo', assignedTo);  // מזהה המוקצה (אם קיים)
  }

  try {
    const response = await axios.post(`${API_URL}/upload`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data; // מצפה לקבל מידע על הקובץ שהועלה
  } catch (error) {
    throw new Error('Error uploading file');
  }
};

// פונקציה לקבלת כל הקבצים המוקצים למשתמש
export const getAssignedDocuments = async (userId: string) => {
  try {
    const response = await axios.get(`${API_URL}/assigned/${userId}`);
    console.log(response.data.documents);
    return response.data.documents; 
    
  } catch (error) {
    throw new Error('Error fetching assigned documents');
  }
};
