import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ReportService from '../../../services/report.service';
import Enums from '../../../interfaces/enums';
import { useUser } from '../../../contexts/user.context';
import { getSetting } from '../../../services/setting.service';

const Report: React.FC = () => {
  const { user } = useUser();
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
  const [setting, setSetting] = useState<any[]>([]); 

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const settingsData = await getSetting(); 
        setSetting(settingsData); 
      } catch (error) {
        console.error('Error fetching settings:', error);
      }
    };
    fetchSettings();
  }, []); 

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setReport({ ...report, [name]: value });
  };

  function rateCalculation(): string {
    const role = report.role;
    let rate: number | undefined; 
  
    for (let index = 0; index < setting.length; index++) {
      const set = setting[index];
      if (set.role === role) {
        rate = set.rate;
        break; 
      }
    }
    if (rate !== undefined) {
      return rate.toString();
    } else {
      return 'תעריף לא נמצא'; 
    }    
  }
  

  const fixReport = () => {
    report.employeeId = user?.employeeId ?? 0
    report.rate = rateCalculation();
    report.total = (parseFloat(report.quantity) * parseFloat(report.rate)).toString();
  }

  const send = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    fixReport();
    try {
      const res = await ReportService.addReport(report);
      if (window.confirm('תרצה להוריד את הדוח לאקסל?')) {
        alert('כרגע עוד אין הורדה לאקסל אתה מועבר לעמודהבית שלך,')
        navigate('/employee');
      } else {
        navigate('/employee');
      }
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
                  <input id="common" name="common" type="text" onChange={handleChange} placeholder="הערה מיוחדת להחודש" className="form-control" />
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
