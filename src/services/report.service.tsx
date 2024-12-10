import axios from 'axios';
import { MyReport } from '../interfaces/report.interface';

const apiUrl = (process.env.NODE_ENV === 'development'
  ? 'http://localhost:3000/api/'
  : 'https://report-system-server.onrender.com/api/');

const serverUrl = `${apiUrl}report`;

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
