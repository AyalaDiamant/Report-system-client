// לאחר השינוי שמנהל רושם עובדים כרגע אין צורך בקומפוננטת רישום
// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import AuthService from '../../services/auth.service';
// import { useUser } from '../../contexts/user.context';

// const Register: React.FC = () => {
//   const [employee, setEmployee] = useState({
//     name: '',
//     password: '',
//     address: '',
//     city: '',
//     phoneNumber: '',
//     bankDetails: {
//       bankName: '',
//       branchNumber: '',
//       accountNumber: ''
//     }
//   });
//   const [errorMessage, setErrorMessage] = useState<string>('');
//   const navigate = useNavigate();
//   const { setUser } = useUser();

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { name, value } = e.target;
//     setEmployee({ ...employee, [name]: value });
//   };

//   const register = async (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault();
//     try {
//       // Perform registration
//       const res = await AuthService.register(employee);
//       // Login after registration
//       const loginRes = await AuthService.login({ name: employee.name, password: employee.password });
//       localStorage.setItem('token', loginRes.data.token);
//       localStorage.setItem('isAdmin', loginRes.data.isAdmin);
//       setUser({
//         employeeId: loginRes.data.employeeId,
//         name: loginRes.data.name,
//       });
//       navigate(loginRes.data.isAdmin ? '/admin' : '/employee');
//     } catch (error) {
//       setErrorMessage('ההרשמה נכשלה. אנא נסה שוב.');
//       console.error('Registration error:', error);
//     }
//   };

//   return (
//     <div>
//       <div className="development-banner">האתר בשלבי פיתוח</div>
//       <br />
//       <div className="container mt-5">
//         <div className="row justify-content-center">
//           <div className="col-md-12">
//             <div className="card">
//               <div className="card-header text-center">
//                 <h2>הרשמה</h2>
//               </div>
//               <div className="card-body">
//                 <form onSubmit={register}>
//                   <div className="form-group">
//                     <label htmlFor="name">שם</label>
//                     <input id="name" name="name" type="text" onChange={handleChange} placeholder="שם מלא" className="form-control" required />
//                   </div>
//                   <div className="form-group">
//                     <label htmlFor="password">סיסמא</label>
//                     <input id="password" name="password" type="password" onChange={handleChange} placeholder="סיסמא" className="form-control" required />
//                   </div>
//                   <div className="form-group">
//                     <label htmlFor="address">כתובת</label>
//                     <input id="address" name="address" type="text" onChange={handleChange} placeholder="כתובת" className="form-control" required />
//                   </div>
//                   <div className="form-group">
//                     <label htmlFor="city">עיר</label>
//                     <input id="city" name="city" type="text" onChange={handleChange} placeholder="עיר" className="form-control" required />
//                   </div>
//                   <div className="form-group">
//                     <label htmlFor="phoneNumber">מספר טלפון</label>
//                     <input id="phoneNumber" name="phoneNumber" type="text" onChange={handleChange} placeholder="מספר טלפון" className="form-control" required />
//                   </div>
//                   <div className="form-group">
//                     <label htmlFor="bankName">שם הבנק</label>
//                     <input id="bankName" name="bankName" type="text" onChange={handleChange} placeholder="שם הבנק" className="form-control" required />
//                   </div>
//                   <div className="form-group">
//                     <label htmlFor="branchNumber">מספר סניף</label>
//                     <input id="branchNumber" name="branchNumber" type="number" onChange={handleChange} placeholder="מספר סניף" className="form-control" required />
//                   </div>
//                   <div className="form-group">
//                     <label htmlFor="accountNumber">מספר חשבון</label>
//                     <input id="accountNumber" name="accountNumber" type="text" onChange={handleChange} placeholder="מספר חשבון" className="form-control" required />
//                   </div>
//                   <div className='d-flex align-items-center mt-3'>
//                     <button type="submit" className="btn btn-secondary btn-block">הרשם</button>
//                     {errorMessage && <div className="alert alert-danger mt-2">{errorMessage}</div>}
//                   </div>
//                 </form>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Register;

