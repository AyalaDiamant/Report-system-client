// import axios from 'axios';
// import { MyReport } from '../interfaces/report.interface';

// const serverUrl = `${process.env.REACT_APP_API_URL}report`;

// const addReport = async (reportData: MyReport) => {
//   const token = localStorage.getItem('token') || sessionStorage.getItem('token'); // שליפת הטוקן מה-LocalStorage
//   if (!token) {
//     throw new Error('No token found. User is not authenticated.');
//   }

//   try {
//     const response = await axios.post(serverUrl, reportData, {
//       headers: {
//         'Content-Type': 'application/json',
//         'Authorization': `Bearer ${token}`, // שליחת הטוקן תחת Authorization
//       },
//     });
//     return response.data;
//   } catch (error: any) {
//     console.error('Error adding report:', error.response ? error.response.data : error.message);
//     throw new Error(`Error adding report: ${error.response ? error.response.data : error.message}`);
//   }
// };

// const getReportByEmployee = async (employeeId: number) => {
//   try {
//     const response = await axios.get(`${serverUrl}/${employeeId}`, {
//       headers: {
//         'Authorization': `Bearer ${localStorage.getItem('token') || sessionStorage.getItem('token')}`, // שליחת הטוקן עם הבקשה
//       },
//     });
//     console.log(response);
//     return response.data;
//   } catch (error: any) {
//     console.error('Error getting reports:', error.response ? error.response.data : error.message);
//     throw error;
//   }
// };

// const getAllReports = async () => {
//   try {
//     const response = await axios.get(serverUrl, {
//       headers: {
//         'Authorization': `Bearer ${localStorage.getItem('token') || sessionStorage.getItem('token')}`, // שליחת הטוקן עם הבקשה
//       },
//     });
//     return response.data;
//   } catch (error: any) {
//     console.error('Error getting reports:', error.response ? error.response.data : error.message);
//     throw error;
//   }
// };

// const deleteReport = async (id: number) => {
//   try {
//     const response = await axios.delete(`${serverUrl}/${id}`, {
//       headers: {
//         'Authorization': `Bearer ${localStorage.getItem('token') || sessionStorage.getItem('token')}`, // שליחת הטוקן עם הבקשה
//       },
//     });
//     return response.data;
//   } catch (error: any) {
//     console.error('Error delete reports:', error.response ? error.response.data : error.message);
//     throw error;
//   }
// }

// const updateReport = async (id: any, updatedData: any) => {
//   try {
//     const response = await axios.put(`${serverUrl}/${id}`, updatedData, {
//       headers: {
//         'Authorization': `Bearer ${localStorage.getItem('token') || sessionStorage.getItem('token')}`, 
//       },
//     });

//     return response.data;
//   } catch (error: any) {
//     console.error('Error updating report:', error.response ? error.response.data : error.message);
//     throw error;
//   }
// };


// const ReportService = {
//   addReport,
//   getReportByEmployee,
//   getAllReports,
//   deleteReport,
//   updateReport
// };

// export default ReportService;

import axios from 'axios';
import { MyReport } from '../interfaces/report.interface';

const serverUrl = `${process.env.REACT_APP_API_URL}report`;

const apiRequest = async (method: string, url: string, data?: any) => {
  const token = localStorage.getItem('token') || sessionStorage.getItem('token');
  if (!token) {
    throw new Error('No token found. User is not authenticated.');
  }

  try {
    const response = await axios({
      method,
      url: `${serverUrl}/${url}`,
      data,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error: any) {
    console.error(`Error during ${method.toUpperCase()} request to ${url}:`, error.response ? error.response.data : error.message);
    throw new Error(`Error during ${method.toUpperCase()} request to ${url}: ${error.response ? error.response.data : error.message}`);
  }
};

const addReport = (reportData: MyReport) => apiRequest('post', '', reportData);
const getReportByEmployee = (employeeId: number) => apiRequest('get', employeeId.toString());
const getAllReports = () => apiRequest('get', '');
const deleteReport = (id: number) => apiRequest('delete', id.toString());
const updateReport = (id: number, updatedData: any) => apiRequest('put', id.toString(), updatedData);

const ReportService = {
  addReport,
  getReportByEmployee,
  getAllReports,
  deleteReport,
  updateReport,
};

export default ReportService;
