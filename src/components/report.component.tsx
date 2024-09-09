// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import AuthService from '../services/auth.service';
// import ReportService from '../services/report.service';


// const Report: React.FC = () => {
//   const [report, setReport] = useState({
//     employeeId: 0,
//     type: '',
//     quantity: '',
//     rate: '',
//     role: '',
//     project: '',
//     section: '',
//     sign: '',
//     total: '',
//     common: ''
//   });
//   const [errorMessage, setErrorMessage] = useState<string>('');
//   const navigate = useNavigate();


//   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { name, value } = e.target;
//     setReport({ ...report, [name]: value });
//   };

//   const fixReport = () => {
//     report.employeeId = 0
//     report.total = (parseFloat(report.quantity) * parseFloat(report.rate)).toString();
//     report.rate = 'לפי התפקיד'
//   }

//   const send = async (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault();
//     fixReport();
//     try {
//       const res = await ReportService.addReport(report);
//       // localStorage.setItem('token', res.data.token);
//       // localStorage.setItem('isAdmin', res.data.newEmployee.isAdmin);
//       navigate('/employee');
//     } catch (error) {
//       setErrorMessage('Sending a report failed. Please try again.');
//       console.error('Sending a report error:', error);
//     }
//   };

//   return (
//     <div className="container mt-5">
//       <div className="row justify-content-center">
//         <div className="col-md-12">
//           <div className="card">
//             <div className="card-header text-center">
//               <h2>מילוי דו"ח</h2>
//             </div>
//             <div className="card-body">
//               <form onSubmit={send}>
//                 <div className="form-group">
//                   <label htmlFor="type">סוג</label>
//                   <input id="type" name="type" type="text" onChange={handleChange} placeholder="סוג תפקיד" className="form-control" required />
//                 </div>
//                 <div className="form-group">
//                   <label htmlFor="quantity">כמות</label>
//                   <input id="quantity" name="quantity" type="text" onChange={handleChange} placeholder="כמות" className="form-control" required />
//                 </div>
//                 <div className="form-group">
//                   <label htmlFor="address">כתובת</label>
//                   <input id="address" name="address" type="text" onChange={handleChange} placeholder="כתובת" className="form-control" required />
//                 </div>
//                 <div className="form-group">
//                   <label htmlFor="role">תפקיד</label>
//                   <input id="role" name="role" type="text" onChange={handleChange} placeholder="תפקיד" className="form-control" required />
//                 </div>
//                 <h2>הספקים</h2>
//                 <div className="form-group">
//                   <label htmlFor="project">פרוייקט</label>
//                   <input id="project" name="project" type="text" onChange={handleChange} placeholder="פרוייקט" className="form-control" required />
//                 </div>
//                 <div className="form-group">
//                   <label htmlFor="section">מדור</label>
//                   <input id="section" name="section" type="text" onChange={handleChange} placeholder="מדור" className="form-control" required />
//                 </div>
//                 <div className="form-group">
//                   <label htmlFor="sign">סימן/סעיף</label>
//                   <input id="sign" name="sign" type="text" onChange={handleChange} placeholder="סימן/סעיף" className="form-control" required />
//                 </div>
//                 <div className="form-group">
//                   <label htmlFor="common">הערה</label>
//                   <input id="common" name="common" type="text" onChange={handleChange} placeholder="הערה מיוחדת להחודש" className="form-control" required />
//                 </div>
//                 <button type="submit" className="btn btn-primary btn-block">שלח</button>
//                 <button type="button" className="btn btn-primary btn-block">יצוא לאקסל</button>

//                 {errorMessage && <div className="alert alert-danger mt-2">{errorMessage}</div>}
//               </form>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>

//   );
// };

// export default Report;

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ReportService from '../services/report.service';
import Enums from '../interfaces/enums';
import { useUser } from '../contexts/user.context'; // נייבא את ה-Context

const Report: React.FC = () => {
  const { user } = useUser(); // שליפת המשתמש המחובר
  const [report, setReport] = useState({
    employeeId: 0,
    type: '',
    quantity: '',
    rate: '',
    role: '',
    project: '',
    section: '',
    sign: '',
    total: '',
    common: ''
  });
  const [errorMessage, setErrorMessage] = useState<string>('');
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setReport({ ...report, [name]: value });
  };

  const fixReport = () => {
    report.employeeId = user?.employeeId ?? 0;
    report.rate = '500';
    report.total = (parseFloat(report.quantity) * parseFloat(report.rate)).toString();
  }

  const send = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    fixReport();
    try {
      const res = await ReportService.addReport(report);
      navigate('/employee');
    } catch (error) {
      setErrorMessage('Sending a report failed. Please try again.');
      console.error('Sending a report error:', error);
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-12">
          <div className="card">
            <div className="card-header text-center">
              <h2>מילוי דו"ח</h2>
            </div>
            <div className="card-body">
              <form onSubmit={send}>
                {/* שדה סוג - select */}
                <div className="form-group">
                  <label htmlFor="type">סוג</label>
                  <select id="type" name="type" onChange={handleChange} className="form-control" required>
                    <option value="">בחר סוג</option>
                    {Object.values(Enums.ReportType).map((type) => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>

                {/* שדה כמות */}
                <div className="form-group">
                  <label htmlFor="quantity">כמות</label>
                  <input id="quantity" name="quantity" type="text" onChange={handleChange} placeholder="כמות" className="form-control" required />
                </div>

                {/* שדה כתובת */}
                <div className="form-group">
                  <label htmlFor="address">כתובת</label>
                  <input id="address" name="address" type="text" onChange={handleChange} placeholder="כתובת" className="form-control" required />
                </div>

                {/* שדה תפקיד - select */}
                <div className="form-group">
                  <label htmlFor="role">תפקיד</label>
                  <select id="role" name="role" onChange={handleChange} className="form-control" required>
                    <option value="">בחר תפקיד</option>
                    {Object.values(Enums.ReportRole).map((role) => (
                      <option key={role} value={role}>{role}</option>
                    ))}
                  </select>
                </div>

                {/* המשך השדות */}
                <div className="form-group">
                  <label htmlFor="project">פרוייקט</label>
                  <input id="project" name="project" type="text" onChange={handleChange} placeholder="פרוייקט" className="form-control" required />
                </div>

                <div className="form-group">
                  <label htmlFor="section">מדור</label>
                  <input id="section" name="section" type="text" onChange={handleChange} placeholder="מדור" className="form-control" required />
                </div>

                <div className="form-group">
                  <label htmlFor="sign">סימן/סעיף</label>
                  <input id="sign" name="sign" type="text" onChange={handleChange} placeholder="סימן/סעיף" className="form-control" required />
                </div>

                <div className="form-group">
                  <label htmlFor="common">הערה</label>
                  <input id="common" name="common" type="text" onChange={handleChange} placeholder="הערה מיוחדת להחודש" className="form-control" required />
                </div>

                <button type="submit" className="btn btn-primary btn-block">שלח</button>
                <button type="button" className="btn btn-primary btn-block">יצוא לאקסל</button>

                {errorMessage && <div className="alert alert-danger mt-2">{errorMessage}</div>}
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Report;
