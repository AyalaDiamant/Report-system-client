import axios from 'axios';
import { MyReport } from '../interfaces/report.interface';

const API_URL = 'http://localhost:3000/api/report';

// פונקציה להוספת דוח
const addReport = async (reportData: MyReport) => {
  const token = localStorage.getItem('token'); // שליפת הטוקן מה-LocalStorage
  if (!token) {
    throw new Error('No token found. User is not authenticated.');
  }

  try {    
    const response = await axios.post(API_URL, reportData, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`, // שליחת הטוקן תחת Authorization
      },
    });
    return response.data;
  } catch (error: any) {
    console.error('Error adding report:', error.response ? error.response.data : error.message);
    throw new Error(`Error adding report: ${error.response ? error.response.data : error.message}`);
  }
};

// פונקציה לקבלת דוחות לפי מזהה עובד
const getReportByEmployee = async (employeeId: number) => {
  try {
    const response = await axios.get(`${API_URL}/${employeeId}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`, // שליחת הטוקן עם הבקשה
      },
    });
    return response.data;
  } catch (error: any) {
    console.error('Error getting reports:', error.response ? error.response.data : error.message);
    throw error;
  }
};

const getAllReports = async () => {
  try {
    const response = await axios.get(API_URL, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`, // שליחת הטוקן עם הבקשה
      },
    });
    return response.data;
  } catch (error: any) {
    console.error('Error getting reports:', error.response ? error.response.data : error.message);
    throw error;
  }
};

const ReportService = {
  addReport,
  getReportByEmployee,
  getAllReports
};

export default ReportService;
