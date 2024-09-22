// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import AuthService from '../../services/auth.service';
// import { useUser } from '../../contexts/user.context';

// const Login: React.FC = () => {
//   const [credentials, setCredentials] = useState<{ name: string; password: string }>({ name: '', password: '' });
//   const [errorMessage, setErrorMessage] = useState<string>('');
//   const navigate = useNavigate();

//   const { setUser, user } = useUser();

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { name, value } = e.target;
//     setCredentials({ ...credentials, [name]: value });
//   };

//   const login = async (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault();
//     try {
//       const res = await AuthService.login(credentials);
//       localStorage.setItem('token', res.data.token);
//       localStorage.setItem('isAdmin', res.data.isAdmin);
//       setUser({
//         employeeId: res.data.employeeId,
//         name: res.data.name,
//       });
//       navigate(res.data.isAdmin ? '/admin' : '/employee');
//     } catch (error) {
//       setErrorMessage('שדות לא חוקיים. אנא נסה שוב.');
//       console.error('Login error:', error);
//     }
//   };

//   return (
//     <div> {/* שים כאן את התג <div> במקום <body> */}
//     <div className="development-banner">האתר בשלבי פיתוח</div>
//     <br />
//     <div className="container mt-5">
//       <div className="row justify-content-center">
//         <div className="col-md-6">
//           <div className="card">
//             <div className="card-header text-center">
//               <h2>התחברות/הרשמה</h2>
//             </div>
//             <div className="card-body">
//               <form onSubmit={login}>
//                 <div className="form-group">
//                   <label htmlFor="name">שם:</label>
//                   <input id="name" name="name" type="text" onChange={handleChange} className="form-control" required />
//                 </div>
//                 <div className="form-group">
//                   <label htmlFor="password">תעודת זהות:</label>
//                   <input id="password" name="password" type="password" onChange={handleChange} className="form-control" required />
//                 </div>
//                 <div className="d-flex justify-content-center align-items-center mt-3">
//                   <button type="submit" className="btn btn-secondary me-2">התחבר</button>
//                   <p className="my-0 mx-2">משתמש חדש?</p>
//                   <button type="button" className="btn btn-secondary ms-2" onClick={() => navigate('/register')}>הירשם</button>
//                 </div>
//                 {errorMessage && <div className="alert alert-danger mt-2">{errorMessage}</div>}
//               </form>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   </div> 
//   );
// };

// export default Login;

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthService from '../../services/auth.service';
import { useUser } from '../../contexts/user.context';

const Login: React.FC = () => {
  const [credentials, setCredentials] = useState<{ name: string; password: string }>({ name: '', password: '' });
  const [rememberMe, setRememberMe] = useState<boolean>(false); // מצב לתיבת הסימון
  const [errorMessage, setErrorMessage] = useState<string>('');
  const navigate = useNavigate();

  const { setUser } = useUser();

  useEffect(() => {
    // בדיקת טוקן ב-localStorage או sessionStorage בעת טעינת האפליקציה
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    const isAdmin = localStorage.getItem('isAdmin') || sessionStorage.getItem('isAdmin');
    if (token) {
      navigate(isAdmin === 'true' ? '/admin' : '/employee');
    } else {
      navigate('/login');
    }
  }, [navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCredentials({ ...credentials, [name]: value });
  };

  const handleRememberMeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRememberMe(e.target.checked); // מעדכן את מצב תיבת הסימון
  };

  const login = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const res = await AuthService.login(credentials);
      
      const storage = rememberMe ? localStorage : sessionStorage; // בוחר בין localStorage ל-sessionStorage
      storage.setItem('token', res.data.token);
      storage.setItem('isAdmin', res.data.isAdmin);
      storage.setItem('user',res.data.employee)
      setUser({
        employeeId: res.data.employeeId,
        name: res.data.name,
      });
      navigate(res.data.isAdmin ? '/admin' : '/employee');
    } catch (error) {
      setErrorMessage('שדות לא חוקיים. אנא נסה שוב.');
      console.error('Login error:', error);
    }
  };

  return (
    <div>
      <div className="development-banner">האתר בשלבי פיתוח</div>
      <br />
      <div className="container mt-5">
        <div className="row justify-content-center">
          <div className="col-md-6">
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
                    <label htmlFor="password">סיסמא:</label>
                    <input id="password" name="password" type="password" onChange={handleChange} className="form-control" required />
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
                  <div className="d-flex justify-content-center align-items-center mt-3">
                    <button type="submit" className="btn btn-secondary me-2">התחבר</button>
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
    </div>
  );
};

export default Login;


