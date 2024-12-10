import axios from 'axios';

const apiUrl = (process.env.NODE_ENV === 'development' 
    ? 'http://localhost:3000/api/' 
    : 'https://report-system-server.onrender.com/api/');

const API_URL = `${apiUrl}employee/`;

const apiRequest = async (method: string, url: string, data?: any) => {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token'); 
    if (!token) {
        throw new Error('No token found. User is not authenticated.');
    }

    try {
        const response = await axios({
            method,
            url: `${API_URL}${url}`,
            data,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`, 
            },
        });

        return response.data;
    } catch (error) {
        console.error(`Error during ${method.toUpperCase()} request to ${url}:`, error);
        throw error;
    }
};


const getAllEmployees = () => apiRequest('get', '');

const createEmployee = (employeeData: any) => apiRequest('post', '', employeeData);

const updateEmployee = (employeeId: any, employeeData: any) => apiRequest('put', employeeId, employeeData);

const deleteEmployee = (employeeId: any) => apiRequest('delete', employeeId);

const getEmployeeById = (employeeId: number) => apiRequest('get', employeeId.toString());

export default {
    getAllEmployees,
    createEmployee,
    updateEmployee,
    deleteEmployee,
    getEmployeeById,
};
