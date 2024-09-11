import axios from 'axios';

const API_URL = 'http://localhost:3000/api/employee/';

const getEmployeeById = async (employeeId: number) => {
    try {
        const response = await axios.get(`${API_URL}${employeeId}`);
        
        return response.data;
    } catch (error) {
        console.error('Error fetching employee:', error);
        throw error; // throwing error so it can be caught where the function is called
    }
};


export default { getEmployeeById };
