import axios from 'axios';

const apiUrl = (process.env.NODE_ENV === 'development' 
  ? 'http://localhost:3000/api/' 
  : 'https://report-system-server.onrender.com/api/');

const serverUrl = `${apiUrl}`
interface Credentials {
  name: string;
  password: string;
}
// לאחר השיוני שמנהל רושם עובדים אין צורך בפונקציית רישום כרגע
// const register = (employee: Employee) => {
//   return axios.post(`${API_URL}register`, employee);
// };

const login = (credentials: Credentials) => {
  alert(serverUrl)
  return axios.post(`${serverUrl}login`, credentials);
};

const AuthService = {
  // register,
  login,
};

export default AuthService;
