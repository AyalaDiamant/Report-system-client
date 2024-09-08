import axios from 'axios';
import { Employee } from '../interfaces/employee.interface';
const API_URL = 'http://localhost:3000/api/';

interface Credentials {
  name: string;
  password: string;
}

const register = (employee: Employee) => {
  return axios.post(`${API_URL}register`, employee);
};

const login = (credentials: Credentials) => {
  return axios.post(`${API_URL}login`, credentials);
};

const AuthService = {
  register,
  login,
};

export default AuthService;
