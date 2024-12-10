import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthService from '../../services/auth.service';
import { useUser } from '../../contexts/user.context';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import Header from '../header.component';

const Login: React.FC = () => {
  const [credentials, setCredentials] = useState<{ name: string; password: string }>({ name: '', password: '' });
  const [rememberMe, setRememberMe] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  const navigate = useNavigate();
  const { setUser } = useUser();

  useEffect(() => {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    const isAdmin = localStorage.getItem('isAdmin') || sessionStorage.getItem('isAdmin');
    if (token) {
      navigate(isAdmin === 'true' ? '/admin' : '/employee');
    }
  }, [navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCredentials({ ...credentials, [name]: value });
  };

  const handleChangePassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    handleChange(e);
  };

  const handleRememberMeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRememberMe(e.target.checked);
  };

  const login = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const res = await AuthService.login(credentials);

      const storage = rememberMe ? localStorage : sessionStorage;
      storage.setItem('token', res.data.token);
      storage.setItem('isAdmin', res.data.isAdmin);
      storage.setItem('user', res.data.employee);

      setUser({
        employeeId: res.data.employeeId,
        name: res.data.name,
      });

      navigate(res.data.isAdmin ? '/admin' : '/employee');
    } catch (error) {
      setErrorMessage('שם או סיסמא לא נכונים. אנא נסה שוב.');
      console.error('Login error:', error);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div>
      <Header
        user={null}  
        role="employee"  
        handleLogout={() => { }}
        handleHome={() => { }}
        handleReport={() => { }}
        handleEmployeeManagement={() => { }}
      />
      <div className="development-banner">האתר בשלבי פיתוח</div>
      <div className="login-container">
        <div className="login-card">
          <h2 className="login-title">ברוכים הבאים</h2>
          <p className="login-subtitle">אנא התחבר כדי להמשיך</p>
          <form onSubmit={login}>
            <div className="form-group">
              <label htmlFor="name" className="form-label">שם:</label>
              <input
                id="name"
                name="name"
                type="text"
                onChange={handleChange}
                className="form-control"
                placeholder="הכנס שם משתמש"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="password" className="form-label">סיסמא:</label>
              <div className="input-group">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  onChange={handleChangePassword}
                  value={password}
                  className="form-control"
                  placeholder="הכנס סיסמא"
                  required
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={togglePasswordVisibility}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>
            <div className="form-group">
              <input
                type="checkbox"
                id="rememberMe"
                className="form-check-input"
                onChange={handleRememberMeChange}
              />
              <label className="form-check-label" htmlFor="rememberMe">זכור אותי</label>
            </div>
            {errorMessage && <div className="error-message">{errorMessage}</div>}
            <button type="submit" className="btn btn-primary">התחבר</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;

