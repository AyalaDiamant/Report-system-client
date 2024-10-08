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
