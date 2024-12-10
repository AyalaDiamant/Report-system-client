import axios from "axios";

const apiUrl = (process.env.NODE_ENV === 'development' 
  ? 'http://localhost:3000/api/' 
  : 'https://report-system-server.onrender.com/api/');

const serverUrl = `${apiUrl}setting`;

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

// פונקציות ספציפיות
export const saveSetting = (setting: any) => apiRequest('post', '', setting);
export const getSetting = () => apiRequest('get', '');
export const updateRole = (index: any, updatedRole: any) => apiRequest('patch', 'update-role', { index, updatedRole });
export const removeRole = (index: any) => apiRequest('delete', 'delete-role', { index });
export const removeProject = (index: any) => apiRequest('delete', 'delete-project', { index });

