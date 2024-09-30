import axios from 'axios';

const serverUrl = `${process.env.REACT_APP_API_URL}`
interface Credentials {
  name: string;
  password: string;
}
// לאחר השיוני שמנהל רושם עובדים אין צורך בפונקציית רישום כרגע
// const register = (employee: Employee) => {
//   return axios.post(`${API_URL}register`, employee);
// };

const login = (credentials: Credentials) => {
  return axios.post(`${serverUrl}login`, credentials);
};

const AuthService = {
  // register,
  login,
};

export default AuthService;
