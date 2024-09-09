import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthService from '../../services/auth.service';
import { useUser } from '../../contexts/user.context';

const Login: React.FC = () => {
  const [credentials, setCredentials] = useState<{ name: string; password: string }>({ name: '', password: '' });
  const [errorMessage, setErrorMessage] = useState<string>('');
  const navigate = useNavigate();

  const { setUser } = useUser();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCredentials({ ...credentials, [name]: value });
  };

  const login = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const res = await AuthService.login(credentials);
      console.log(res);
      
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('isAdmin', res.data.isAdmin);
      setUser({
        employeeId: res.data.employeeId,
        name: 'בדיקת שם',
      });
      navigate(res.data.isAdmin ? '/admin' : '/employee');
    } catch (error) {
      setErrorMessage('Invalid credentials. Please try again.');
      console.error('Login error:', error);
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-14">
          <div className="card">
            <div className="card-header text-center">
              <h2>התחברות/הרשמה</h2>
            </div>
            <div className="card-body">
              <form onSubmit={login}>
                <div className="form-group">
                  <label htmlFor="name">שם:</label>
                  <input id="name" name="name" type="text" onChange={handleChange} className="form-control" required />
                </div>
                <div className="form-group">
                  <label htmlFor="password">תעודת זהות:</label>
                  <input id="password" name="password" type="password" onChange={handleChange} className="form-control" required />
                </div>
                <div className="d-flex justify-content-center align-items-center mt-8">
                  <button type="submit" className="btn btn-primary me-2">התחבר</button>
                  <p className="my-0 mx-2">משתמש חדש?</p>
                  <button type="button" className="btn btn-secondary ms-2" onClick={() => navigate('/register')}>הירשם</button>
                </div>
                {errorMessage && <div className="alert alert-danger mt-2">{errorMessage}</div>}
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
