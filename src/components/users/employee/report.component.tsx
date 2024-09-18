import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ReportService from '../../../services/report.service';
import Enums from '../../../interfaces/enums';
import { useUser } from '../../../contexts/user.context';
import { getSetting } from '../../../services/setting.service';
import { MyReport, Deliverable } from '../../../interfaces/report.interface';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import ExcelJS from 'exceljs';

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
    date: '',
    deliverables: [],
    common: ''
  });

  const [otherType, setOtherType] = useState({ customType: '', customRate: 0 });
  const [isOtherSelected, setIsOtherSelected] = useState(false);

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

    if (name === "type" && value === "אחר") {
      setIsOtherSelected(true);
    } else if (name === "type") {
      setIsOtherSelected(false);
    }
  };

  function rateCalculation(): number {
    console.log(isOtherSelected, ' ', otherType.customRate, ' ertyuiop');

    if (isOtherSelected) {
      return otherType.customRate;
    }
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
    deliverable.rate = rateCalculation(); // מחשב את התעריף לפי התפקיד

    if (isOtherSelected) {
      deliverable.total = deliverable.quantity * otherType.customRate;
    } else {
      deliverable.total = deliverable.quantity * deliverable.rate;
    }
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

  const totalSumCalculation = (report: MyReport) : number => {
    let count = 0
    for (let index = 0; index < report.deliverables.length; index++) {
      count += report.deliverables[index].total;
    }
    return count;
  }

  async function exportStyledReportToExcel(report: MyReport) {    
    const today = new Date();
    const month = (today.getMonth() + 1).toString().padStart(2, '0'); 
    const year = today.getFullYear().toString().slice(-2); 
    
    const formattedDate = `${month}-${year}`;
    console.log(formattedDate); 
    
    const date = formattedDate
    const totalSum:number = totalSumCalculation(report);

    const fileName = `דוח_${user?.name}_${date}.xlsx`;
  
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('דוח');
  
    // עיצוב כותרות
    worksheet.addRow([
      `${formattedDate}`,
      `${user?.name}`
    ]).eachCell({ includeEmpty: true }, (cell) => {
      cell.font = { bold: true };
      cell.alignment = { vertical: 'middle', horizontal: 'center' };
    });
  
    worksheet.addRow([]);
    worksheet.addRow(['סוג', 'כמות', 'תעריף', 'תפקיד', 'פרויקט', 'מדור', 'סימן/סעיף', 'סכום סה"כ'])
      .eachCell({ includeEmpty: true }, (cell) => {
        cell.font = { bold: true };
        cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFF00' } };
      });
  
    // הוספת הנתונים
    report.deliverables.forEach(deliverable => {
      worksheet.addRow([
        deliverable.type,
        deliverable.quantity,
        deliverable.rate,
        deliverable.role,
        deliverable.project,
        deliverable.section,
        deliverable.sign,
        deliverable.total
      ]);
    });
  
    worksheet.addRow([]); // שורה ריקה
    worksheet.addRow(['הערה כללית',report.common, 'סכום סה"כ', totalSum, '', '', '', '', ])
      // .eachCell({ includeEmpty: true }, (cell) => {
      //   cell.alignment = { horizontal: 'right', vertical: 'middle', textRotation: 0, wrapText: true };
      // });
  
    await workbook.xlsx.writeBuffer().then((buffer) => {
      // יצירת אובייקט Blob ושמירה לקובץ
      const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName;
      link.click();
      window.URL.revokeObjectURL(url);
    });
  }

  const send = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    addDeliverable();

    if (deliverable.type && deliverable.quantity && deliverable.role && deliverable.project) {
      report.deliverables.push(deliverable);
    }

    report.employeeId = user?.employeeId ?? 0;

    try {
      const res = await ReportService.addReport(report);
      if (window.confirm('תרצה להוריד את הדוח לאקסל?')) {
        exportStyledReportToExcel(report);
        navigate('/employee');
      } else {
        navigate('/employee');
      }
    } catch (error) {
      setErrorMessage('שליחת הדוח נכשלה. אנא נסה שוב.');
      console.error('שגיאה בשליחת הדוח:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('isAdmin');
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('isAdmin');

    navigate('/login');
  };

  return (
    <div>
      <div className="development-banner">האתר בשלבי פיתוח</div>
      <header className="navbar navbar-expand-lg navbar-light bg-light">
        <div className="container">
          <span className="navbar-brand"> {user?.name ? ` שלום ${user.name} ` : ''}
          </span>
          <div className="collapse navbar-collapse d-flex justify-content-between align-items-center">
            <ul className="navbar-nav mr-auto">
              <li className="nav-item">
                <a className="nav-link" href="/employee">לעמוד הבית שלך</a>
              </li>
            </ul>
            <div className="d-flex align-items-center">
              <a onClick={handleLogout} className="logout-link">התנתק</a>
            </div>
          </div>
        </div>
      </header>

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
                    <select id="type" name="type" value={deliverable.type} onChange={handleChange} className="form-control" required>                     <option value="">בחר סוג</option>
                      {Object.values(Enums.ReportType).map((type) => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                      <option value="אחר">אחר</option>
                    </select>
                  </div>

                  {/* שדות 'אחר' */}
                  {isOtherSelected && (
                    <>
                      <div className="form-group">
                        <label htmlFor="customRate">תעריף</label>
                        <input id="customRate" name="customRate" type="number" value={otherType.customRate} onChange={(e) => setOtherType({ ...otherType, customRate: parseFloat(e.target.value) })} className="form-control" required />
                      </div>
                    </>
                  )}

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
                  <div className='d-flex align-items-center mt-3 gap-2'>
                    <button type="button" className="btn btn-secondary"  onClick={addDeliverable}>
                      הוסף הספק
                    </button>

                    <button type="submit" className="btn btn-secondary">
                      שלח
                    </button>
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

export default Report;
