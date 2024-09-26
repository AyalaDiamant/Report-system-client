// import axios from 'axios';

// const API_URL = 'http://localhost:3000/api/employee/';

// const getEmployeeById = async (employeeId: number) => {
//     try {
//         const response = await axios.get(`${API_URL}${employeeId}`);

//         return response.data;
//     } catch (error) {
//         console.error('Error fetching employee:', error);
//         throw error;
//     }
// };


// export default { getEmployeeById };

import axios from 'axios';

const API_URL = 'http://localhost:3000/api/employee/';

// קבלת כל העובדים
const getAllEmployees = async () => {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token'); // שליפת הטוקן מה-LocalStorage
    if (!token) {
        throw new Error('No token found. User is not authenticated.');
    }
    try {
        const response = await axios.get(API_URL, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`, // שליחת הטוקן תחת Authorization
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching employees:', error);
        throw error;
    }
};

// הוספת עובד חדש
const createEmployee = async (employeeData: any) => {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token'); // שליפת הטוקן מה-LocalStorage
    if (!token) {
        throw new Error('No token found. User is not authenticated.');
    }
    try {
        const response = await axios.post(API_URL, employeeData, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`, // שליחת הטוקן תחת Authorization
            },
        });

        return response.data;
    } catch (error) {
        console.error('Error creating employee:', error);
        throw error;
    }
};

// עדכון עובד
// const updateEmployee = async (employeeId: any, employeeData: any) => {
//     const token = localStorage.getItem('token') || sessionStorage.getItem('token'); // שליפת הטוקן מה-LocalStorage
//     if (!token) {
//         throw new Error('No token found. User is not authenticated.');
//     }
//     try {
//         const response = await axios.put(`${API_URL}${employeeId}`, employeeData, {
//             headers: {
//                 'Content-Type': 'application/json',
//                 'Authorization': `Bearer ${token}`, // שליחת הטוקן תחת Authorization
//             },
//         });
//         alert(response.data);
        
//         return response.data;
//     } catch (error) {
//         console.error('Error updating employee:', error);
//         throw error;
//     }
// };
const updateEmployee = async (employeeId: any, employeeData: any) => {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    if (!token) {
        throw new Error('No token found. User is not authenticated.');
    }
    try {
        console.log('Updating employee with ID:', employeeId);
        console.log('Employee Data:', employeeData);

        const response = await axios.put(`${API_URL}${employeeId}`, employeeData, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        });

        return response.data;
    } catch (error) {
        console.error('Error updating employee:', error);
        throw error;
    }
};


// מחיקת עובד
const deleteEmployee = async (employeeId: any) => {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token'); // שליפת הטוקן מה-LocalStorage
    if (!token) {
        throw new Error('No token found. User is not authenticated.');
    }
    try {
        await axios.delete(`${API_URL}${employeeId}`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`, // שליחת הטוקן תחת Authorization
            },
        });
    } catch (error) {
        console.error('Error deleting employee:', error);
        throw error;
    }
};

const getEmployeeById = async (employeeId: number) => {
    try {
        const response = await axios.get(`${API_URL}${employeeId}`);

        return response.data;
    } catch (error) {
        console.error('Error fetching employee:', error);
        throw error;
    }
};

export default {
    getAllEmployees,
    createEmployee,
    updateEmployee,
    deleteEmployee,
    getEmployeeById
};

