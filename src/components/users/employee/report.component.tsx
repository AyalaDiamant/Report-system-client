import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ReportService from '../../../services/report.service';
import Enums from '../../../interfaces/enums';
import { useUser } from '../../../contexts/user.context';
import { MyReport, Deliverable } from '../../../interfaces/report.interface';
// בשביל ההגדרות
// import { Settings } from '../../../interfaces/settings.interface';
// import { getSetting } from '../../../services/setting.service';
// import * as XLSX from 'xlsx';
// import { saveAs } from 'file-saver';
import ExcelJS from 'exceljs';
import employeeService from '../../../services/employee.service';
import { Employee } from '../../../interfaces/employee.interface';
import Header from '../../header.component';

const Report: React.FC = () => {
  const { user } = useUser();
  const [employee, setEmployee] = useState<Employee | null>(null)
  const [deliverable, setDeliverable] = useState<Deliverable>({
    // type: '',
    quantity: 0,
    rate: 0,
    rateIncrease: 0,
    role: employee?.role?.name || '',
    project: employee?.project || '',
    sign: '',
    seif: '',
    total: 0
  });
  const [report, setReport] = useState<MyReport>({
    _id: 0,
    employeeId: user?.employeeId ?? 0,
    date: '',
    deliverables: [],
    common: ''
  });
  const [totalSum, setTotalSum] = useState<number>(0); // הוספת מצב לסכום הכולל
  const [errorMessage, setErrorMessage] = useState<string>('');
  const navigate = useNavigate();

  useEffect(() => {
    // הגדרות - אם יצתרכו להשאיר
    // const fetchSettings = async () => {
    //   try {
    //     const settingsData = await getSetting();
    //     const settings = settingsData[0] || {};
    //     setSetting({
    //       roles: settings.roles || [],
    //       projects: settings.projects || []
    //     });
    //   } catch (error) {
    //     console.error('Error fetching settings:', error);
    //   }
    // };
    getEmployeeById();
    // fetchSettings();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setDeliverable({ ...deliverable, [name]: value });

    const rate = employee?.role.rate;
    if (rate) {
      const total = deliverable.quantity * rate;
      setDeliverable(prev => ({ ...prev, rate, total }));
      setTotalSum(totalSumCalculation({ ...report, deliverables: [...report.deliverables, { ...deliverable, total }] }));
    }
  };

  useEffect(() => {
    const rate = employee?.role?.rate || 0;
    const total = deliverable.quantity * rate;
    setDeliverable((prev) => ({ ...prev, rate, total }));
    setTotalSum(total);
  }, [deliverable.quantity, employee]);

  // חישוב תפקיד לפי הגדרה כרגע לא נצרך
  // function rateCalculation(): number {

  //   if (isOtherSelected) {
  //     return otherType.customRate;
  //   }
  //   const role = deliverable.role;
  //   let rate: number | undefined;
  //   if (setting)
  //     for (let index = 0; index < setting.roles.length; index++) {
  //       const set = setting.roles[index];
  //       console.log(set, 'set');

  //       if (set.name === role) {
  //         rate = set.rate;
  //         console.log(rate, 'rate');

  //         break;
  //       }
  //     }
  //   return rate !== undefined ? rate : 0;
  // }

  const fixDeliverable = () => {
    const rate = employee?.role.rate;
    if (rate) {
      deliverable.rate = rate;
      deliverable.role = employee.role.name;
      deliverable.rateIncrease = employee.role.rateIncrease;
      deliverable.project = employee.project
      deliverable.total = deliverable.quantity * deliverable.rate
    }

  };

  const addDeliverable = () => {
    fixDeliverable();
    if (deliverable.quantity) {
      setReport(prevState => ({
        ...prevState,
        deliverables: [...prevState.deliverables, deliverable]
      }));
      console.log(deliverable, 'd');


      // איפוס ההספק למילוי חדש
      setDeliverable({
        // type: '',
        quantity: 0,
        rate: 0,
        rateIncrease: 0,
        role: '',
        project: '',
        sign: '',
        seif: '',
        total: 0
      });
    }

  };

  const totalSumCalculation = (report: MyReport): number => {
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
    const totalSum: number = totalSumCalculation(report);

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
    worksheet.addRow(['כמות', 'תעריף', 'תפקיד', 'פרויקט', 'סימן', 'סעיף', 'סכום סה"כ'])
      .eachCell({ includeEmpty: true }, (cell) => {
        cell.font = { bold: true };
        cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFF00' } };
      });

    // הוספת הנתונים
    report.deliverables.forEach(deliverable => {
      worksheet.addRow([
        // deliverable.type,
        deliverable.quantity,
        deliverable.rate,
        deliverable.role,
        deliverable.project,
        deliverable.sign,
        deliverable.seif,
        deliverable.total
      ]);
    });

    worksheet.addRow([]); // שורה ריקה
    worksheet.addRow(['הערה כללית', report.common, 'סכום סה"כ', totalSum, '', '', '', '',])
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

    if (deliverable.quantity && deliverable.role && deliverable.project) {
      report.deliverables.push(deliverable);
    }

    report.employeeId = user?.employeeId ?? 0;

    try {
      await ReportService.addReport(report);
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

  const getEmployeeById = async () => {
    let userIdFromSend = user?.employeeId;
    if (userIdFromSend)
      setEmployee(await employeeService.getEmployeeById(userIdFromSend));
  }

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('isAdmin');
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('isAdmin');

    navigate('/login');
  };

  const handleReport = () => {
    navigate('/report');
  };

  const handleHome = () => {
    navigate('/employee');
  };

  const toggleShowReports = () => {

  };

  return (
    <div>
      <Header
        user={user}
        role="employee" // מצב של עובד
        handleLogout={handleLogout}
        handleReport={handleReport}
        toggleShowReports={toggleShowReports} // העברת פונקציה
        handleHome={handleHome}
      />

      <div className="container mt-5">
        <div className="row justify-content-center">
          <div className="col-md-12">
            <div className="card">
              <div className="card-header text-center">
                <h2>מילוי דו"ח</h2>
              </div>
              <div className="card-body">
                <form onSubmit={send}>
                  {/* <div className="form-group">
                    <label htmlFor="type">סוג</label>
                    <select id="type" name="type" value={deliverable.project} onChange={handleChange} className="form-control" required>                     <option value="">בחר סוג</option>
                      {Object.values(Enums.ReportType).map((type) => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                  </div> */}

                  <div className="form-group">
                    <label htmlFor="project">פרוייקט</label>
                    <input
                      id="project"
                      name="project"
                      type="text"
                      value={employee?.project} // מניח שהמידע של העובד קיים כאן
                      readOnly // מאפשר לקרוא אך לא לערוך את השדה
                      className="form-control"
                      style={{ backgroundColor: '#cbcaca', color: 'white', border: '1px solid #cbcaca' }} // צבע רקע כהה עם טקסט לבן
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="role">תפקיד</label>
                    <input
                      id="role"
                      name="role"
                      type="text"
                      value={employee?.role?.name} // מניח שהמידע קיים כאן
                      readOnly // מאפשר לקרוא אך לא לערוך את השדה
                      className="form-control"
                      style={{ backgroundColor: '#cbcaca', color: 'white', border: '1px solid #cbcaca' }} // צבע רקע כהה עם טקסט לבן
                    />
                  </div>

                  {/* שדה שכר */}
                  <div className="form-group">
                    <label htmlFor="rate">שכר</label>
                    <input
                      id="rate"
                      name="rate"
                      type="number"
                      value={employee?.role?.rate} // מניח שהמידע קיים כאן
                      readOnly // מאפשר לקרוא אך לא לערוך את השדה
                      className="form-control"
                      style={{ backgroundColor: '#cbcaca', color: 'white', border: '1px solid #cbcaca' }} // צבע רקע כהה עם טקסט לבן
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="sign">סימן</label>
                    <input id="sign"
                      name="sign" type="text"
                      value={deliverable.sign}
                      onChange={handleChange}
                      placeholder="סימן"
                      className="form-control"
                      required />
                  </div>
                  <div className="form-group">
                    <label htmlFor="sign">סעיף</label>
                    <input id="seif" name="seif" type="text" value={deliverable.seif} onChange={handleChange} placeholder="סעיף" className="form-control" required />
                  </div>
                  <div className="form-group">
                    <label htmlFor="quantity">כמות</label>
                    <input
                      id="quantity"
                      name="quantity"
                      type="number"
                      value={deliverable.quantity !== 0 ? deliverable.quantity : ''} // אם הכמות היא 0, השאר ריק
                      onChange={handleChange}
                      placeholder="כמות"
                      className="form-control"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="common">הערה</label>
                    <input id="common" name="common" type="text" value={report.common} onChange={(e) => setReport({ ...report, common: e.target.value })} placeholder="הערה כללית" className="form-control" />
                  </div>
                  <div className="form-group totalSum">
                    <h4>סה"כ : {totalSum}</h4>
                  </div>
                  <div className='d-flex align-items-center mt-3 gap-2'>
                    <button type="button" className="btn btn-secondary" onClick={addDeliverable}>
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

