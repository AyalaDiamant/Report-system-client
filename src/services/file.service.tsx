
// import axios from 'axios';

// const API_URL = 'http://localhost:3000/api/files';  // עדכון לכתובת ה-API שלך

// // פונקציה להעלאת קובץ
// export const uploadFile = async (file: File, uploadedBy: string, assignedTo: string | null) => {
//   const formData = new FormData();
//   formData.append('file', file);
//   formData.append('uploadedBy', uploadedBy);  // מזהה המעלה
//   if (assignedTo) {
//     formData.append('assignedTo', assignedTo);  // מזהה המוקצה (אם קיים)
//   }

//   try {
//     const response = await axios.post(`${API_URL}/upload`, formData, {
//       headers: { 'Content-Type': 'multipart/form-data' },
//     });
//     return response.data; // מצפה לקבל מידע על הקובץ שהועלה
//   } catch (error) {
//     throw new Error('Error uploading file');
//   }
// };

// // פונקציה לקבלת כל הקבצים המוקצים למשתמש
// export const getAssignedDocuments = async (userId: string) => {
//   try {
//     const response = await axios.get(`${API_URL}/assigned/${userId}`);
//     console.log(response.data.documents);
//     return response.data.documents;

//   } catch (error) {
//     throw new Error('Error fetching assigned documents');
//   }
// };

// export const updateEmployeeAvailability = async (employeeId: number, isAvailable: boolean) => {
//   try {
//     const response = await axios.put(`${API_URL}/${employeeId}/available`, { isAvailable });
//     return response.data;
//   } catch (error) {
//     console.error("Error updating employee availability:", error);
//     throw error;
//   }
// };


import axios from 'axios';

const API_URL = 'http://localhost:3000/api/files';

// פונקציה להעלאת קובץ
export const uploadFile = async (file: File, uploadedBy: string, assignedTo?: string) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('uploadedBy', uploadedBy);
  if (assignedTo) {
    formData.append('assignedTo', assignedTo);
  }

  try {
    const response = await axios.post(`${API_URL}/upload`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  } catch (error) {
    throw new Error('Error uploading file');
  }
};

// פונקציה לקבלת כל הקבצים המוקצים למשתמש
export const getAssignedDocuments = async (userId: string) => {
  try {
    const response = await axios.get(`${API_URL}/assigned/${userId}`);
    return response.data.documents;
  } catch (error) {
    throw new Error('Error fetching assigned documents');
  }
};

// פונקציה לעדכון זמינות עובד
export const updateEmployeeAvailability = async (employeeId: string, isAvailable: boolean) => {
  try {
    const response = await axios.put(`${API_URL}/${employeeId}/available`, { isAvailable });
    return response.data;
  } catch (error) {
    console.error("Error updating employee availability:", error);
    throw error;
  }
};

// פונקציה להקצאת מבקר למסמך
export const assignReviewerToFile = async (documentId: string, reviewerId: string) => {
  try {
    const response = await axios.put(`${API_URL}/${documentId}/assign`, { assignedTo: reviewerId });
    return response.data;
  } catch (error) {
    console.error("Error assigning reviewer to file:", error);
    throw error;
  }
};



// פונקציה שמבצעת בדיקה אם המסמך קיים במסד נתונים לפי שם המסמך
export const checkIfDocumentExists = async (fileName: string) => {
  // debugger
  try {
    const response = await axios.get(`${API_URL}/${fileName}`);
    return response.data || null;
  } catch (error) {
    console.error('Error checking document existence:', error);
    return null;
  }
};

// פונקציה לעדכון המעלה של המסמך
export const updateDocumentUploader = async (documentId: string, newUploader: string) => {
  // debugger
  try {
    await axios.put(`${API_URL}/${documentId}`, { uploadedBy: newUploader });
  } catch (error) {
    console.error('Error updating document uploader:', error);
  }
};

// export const getAllDocuments = async () => {
//   debugger
//   try {
//       const response = await axios.get(`${API_URL}/all-documents`);
//       return response.data;
//   } catch (error) {
//       console.error('Error fetching documents:', error);
//       throw new Error('שגיאה בעת הבאת המסמכים');
//   }
// };
export const getAllDocuments = async () => {
  debugger
  const token = localStorage.getItem('token') || sessionStorage.getItem('token'); 
  if (!token) {
      throw new Error('לא נמצא טוקן. המשתמש לא מאומת.');
  }

  try {
      const response = await axios({
          method: 'get',
          url: `${API_URL}/all-documents`,
          headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
          },
      });
      return response.data;
  } catch (error) {
      console.error('Error fetching documents:', error);
      throw new Error('שגיאה בעת הבאת המסמכים');
  }
};

