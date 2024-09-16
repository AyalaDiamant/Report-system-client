import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ReportService from '../../../services/report.service';
import Enums from '../../../interfaces/enums';
import { useUser } from '../../../contexts/user.context';
import { getSetting } from '../../../services/setting.service';
import { MyReport, Deliverable } from '../../../interfaces/report.interface';

const Report: React.FC = () => {
  const { user } = useUser();
  const [deliverable, setDeliverable] = useState<Deliverable>({
    type: '',
    quantity: 0,
    rate: 0,
    role: '',
    project: '',
    section: '',
    sign: '',
    total: 0
  });
  const [report, setReport] = useState<MyReport>({
    employeeId: user?.employeeId ?? 0,
    deliverables: [],
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
    setDeliverable({ ...deliverable, [name]: value });
  };

  function rateCalculation(): number {
    const role = deliverable.role;
    let rate: number | undefined;

    for (let index = 0; index < setting.length; index++) {
      const set = setting[index];
      if (set.role === role) {
        rate = set.rate;
        break;
      }
    }
    return rate !== undefined ? rate : 0;
  }

  const fixDeliverable = () => {
    deliverable.rate = rateCalculation();
    deliverable.total = deliverable.quantity * deliverable.rate;
  };

  const addDeliverable = () => {
    fixDeliverable();
    if (deliverable.type && deliverable.quantity && deliverable.role && deliverable.project) {
      setReport(prevState => ({
        ...prevState,
        deliverables: [...prevState.deliverables, deliverable]
      }));

      // איפוס ההספק למילוי חדש
      setDeliverable({
        type: '',
        quantity: 0,
        rate: 0,
        role: '',
        project: '',
        section: '',
        sign: '',
        total: 0
      });
    }
  };
  
  const send = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // אם יש הספק אחרון שמולא ולא נוסף, נוסיף אותו למערך בצורה סינכרונית
    if (deliverable.type && deliverable.quantity && deliverable.role && deliverable.project) {
      report.deliverables.push(deliverable);  // הוספת ההספק ישירות למערך לפני שליחה
    }

    report.employeeId = user?.employeeId ?? 0;

    try {
      const res = await ReportService.addReport(report);
      if (window.confirm('תרצה להוריד את הדוח לאקסל?')) {
        alert('כרגע עוד אין הורדה לאקסל אתה מועבר לעמוד הבית שלך');
        navigate('/employee');
      } else {
        navigate('/employee');
      }
    } catch (error) {
      setErrorMessage('שליחת הדוח נכשלה. אנא נסה שוב.');
      console.error('שגיאה בשליחת הדוח:', error);
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
                <div className="form-group">
                  <label htmlFor="type">סוג</label>
                  <select id="type" name="type" value={deliverable.type} onChange={handleChange} className="form-control" required>
                    <option value="">בחר סוג</option>
                    {Object.values(Enums.ReportType).map((type) => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="quantity">כמות</label>
                  <input id="quantity" name="quantity" type="number" value={deliverable.quantity} onChange={handleChange} placeholder="כמות" className="form-control" required />
                </div>

                <div className="form-group">
                  <label htmlFor="role">תפקיד</label>
                  <select id="role" name="role" value={deliverable.role} onChange={handleChange} className="form-control" required>
                    <option value="">בחר תפקיד</option>
                    {Object.values(Enums.ReportRole).map((role) => (
                      <option key={role} value={role}>{role}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="project">פרוייקט</label>
                  <input id="project" name="project" type="text" value={deliverable.project} onChange={handleChange} placeholder="פרוייקט" className="form-control" required />
                </div>

                <div className="form-group">
                  <label htmlFor="section">מדור</label>
                  <input id="section" name="section" type="text" value={deliverable.section} onChange={handleChange} placeholder="מדור" className="form-control" required />
                </div>

                <div className="form-group">
                  <label htmlFor="sign">סימן/סעיף</label>
                  <input id="sign" name="sign" type="text" value={deliverable.sign} onChange={handleChange} placeholder="סימן/סעיף" className="form-control" required />
                </div>

                <div className="form-group">
                  <label htmlFor="common">הערה</label>
                  <input id="common" name="common" type="text" value={report.common} onChange={(e) => setReport({ ...report, common: e.target.value })} placeholder="הערה כללית" className="form-control" />
                </div>

                <button type="button" className="btn btn-secondary btn-block" onClick={addDeliverable}>
                  הוסף הספק
                </button>

                <button type="submit" className="btn btn-primary btn-block mt-2">
                  שלח
                </button>

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
