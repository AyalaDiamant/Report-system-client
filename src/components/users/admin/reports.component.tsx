import React, { useEffect, useState } from 'react';
import ReportService from '../../../services/report.service';
import EmployeeService from '../../../services/employee.service';
import { MyReport } from '../../../interfaces/report.interface';
import { EmployeeSummary } from '../../../interfaces/employee.interface';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { getSetting } from '../../../services/setting.service';
import { useUser } from '../../../contexts/user.context';
import { useNavigate } from 'react-router-dom';

import ExcelJS from 'exceljs';

const Reports: React.FC = () => {
    const [reports, setReports] = useState<MyReport[]>([]);
    const [originalReports, setOriginalReports] = useState<MyReport[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [employeeNames, setEmployeeNames] = useState<{ [key: number]: string }>({});
    const [setting, setSetting] = useState<any[]>([]); // התחל עם מערך ריק

    const navigate = useNavigate();
    const { user } = useUser();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    throw new Error('No token found. User is not authenticated.');
                }

                // טעינת הדוחות
                const reportData = await ReportService.getAllReports();
                setReports(reportData);
                setOriginalReports([...reportData]);

                // טעינת ההגדרות
                const settingsData = await getSetting();
                setSetting(settingsData);

                // טעינת שמות העובדים
                const namesMap: { [key: number]: string } = {};

                // צריך לבדוק למה כל דבר פה קורה פעמיים
                for (const report of reportData) {
                    try {
                        const employee = await EmployeeService.getEmployeeById(report.employeeId);
                        namesMap[report.employeeId] = employee.name;
                    } catch (error) {
                        console.error(`Error loading employee with ID ${report.employeeId}:`, error);
                        namesMap[report.employeeId] = 'שגיאה';
                    }
                }
                setEmployeeNames(namesMap);


            } catch (error) {
                console.error('Error loading reports:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const exportToExcel = () => {
        const workbook = new ExcelJS.Workbook();
        const sheet = workbook.addWorksheet('דוחות מקור');
        const sheetUpdated = workbook.addWorksheet('דוחות לאחר שינוי');
        const sheetCalculations = workbook.addWorksheet('טבלת חישובים');
        const sheetSummary = workbook.addWorksheet('התאמות שכר'); // גיליון חדש עבור התאמות שכר

        // עיצוב כותרות עם רקע צבעוני וכיתוב מודגש
        const headerStyle = {
            font: { bold: true },
            fill: {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: 'FFFFFF00' } // צבע רקע צהוב
            },
            alignment: { horizontal: 'center' as ExcelJS.Alignment['horizontal'] }
        };

        // כותרות לדוחות מקור
        const headers = ["שם עובד", "פרוייקט", "סימן/סעיף", "תפקיד", "תעריף", "סה\"כ", "כמות", "הערה"];
        const headerRow = sheet.addRow(headers);
        headerRow.eachCell(cell => {
            cell.font = headerStyle.font;
            cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFFF00' } }; // תיקון כאן
            cell.alignment = headerStyle.alignment;
        });

        // נתונים לדוחות מקור
        originalReports.forEach(report => {
            for (let index = 0; index < report.deliverables.length; index++) {
                const e = report.deliverables[index];
                sheet.addRow([
                    employeeNames[report.employeeId] || 'טוען...',
                    e.project,
                    e.sign,
                    e.role,
                    e.rate,
                    e.total,
                    e.quantity,
                    report.common
                ]);
            }

        });

        // חישוב דוחות לאחר שינוי
        const updatedReports = reports.map(report => {
            // מעתיקים את כל ההספקים המקוריים, ועושים שינויים איפה שצריך
            const updatedDeliverables = report.deliverables.map(e => {
                const settingForRole = setting.find(set => set.role === e.role);
                if (settingForRole) {
                    const newRate = e.rate + settingForRole.rateIncrease;
                    const newTotal = e.quantity * newRate;

                    // מחזירים את ההספק עם השינויים
                    return {
                        ...e,
                        rate: newRate,
                        total: newTotal
                    };
                }
                return e;
            });

            return {
                ...report,
                deliverables: updatedDeliverables
            };
        });


        // כותרות לדוחות לאחר שינוי
        const updatedHeaderRow = sheetUpdated.addRow(headers);
        updatedHeaderRow.eachCell(cell => {
            cell.font = headerStyle.font;
            cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFFF00' } }; // תיקון כאן
            cell.alignment = headerStyle.alignment;
        });

        // נתונים לדוחות לאחר שינוי
        updatedReports.forEach(report => {
            for (let index = 0; index < report.deliverables.length; index++) {
                const e = report.deliverables[index];
                sheetUpdated.addRow([
                    employeeNames[report.employeeId] || 'טוען...',
                    e.project,
                    e.sign,
                    e.role,
                    e.rate,
                    e.total,
                    e.quantity,
                    report.common
                ]);
            }
        });

        // כותרות לטבלת חישובים
        const calcHeaders = ["שם עובד", "שכר נטו", "שכר ברוטו", "הפרש 15%", "יתרה"];
        const calcHeaderRow = sheetCalculations.addRow(calcHeaders);
        calcHeaderRow.eachCell(cell => {
            cell.font = headerStyle.font;
            cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFFF00' } }; // תיקון כאן
            cell.alignment = headerStyle.alignment;
        });

        // נתונים לטבלת חישובים
        reports.forEach(report => {
            for (let index = 0; index < report.deliverables.length; index++) {
                const e = report.deliverables[index];
                const settingForRole = setting.find(set => set.role === e.role);

                const grossSalary = e.quantity * (e.rate + settingForRole.rateIncrease);
                const netSalary = e.total;
                const deduction = grossSalary * 0.15;
                const balance = grossSalary - netSalary - deduction;

                // הוספת השורה לטבלת החישובים
                sheetCalculations.addRow([
                    employeeNames[report.employeeId] || 'טוען...',
                    netSalary,
                    grossSalary,
                    deduction,
                    balance
                ]);
            }
        });
        // הכנת הנתונים לסיכום לכל עובד
        const employeeSummaries: EmployeeSummary[] = [];

        reports.forEach(report => {
            // חישוב שכר נטו ושכר ברוטו
            const totalNetSalary = report.deliverables.reduce((sum, e) => sum + e.total, 0);
            const totalGrossSalary = report.deliverables.reduce((sum, e) => {
                const settingForRole = setting.find(set => set.role === e.role);
                return sum + (e.quantity * (e.rate + (settingForRole?.rateIncrease || 0)));
            }, 0);

            // חישוב ההפרש
            const difference = totalGrossSalary > 3000 ? totalGrossSalary - 3000 : 0;

            // חיפוש או הוספת עובד
            let existingEmployee = employeeSummaries.find(emp => emp._id === report.employeeId);

            if (existingEmployee) {
                // עדכון סכומים אם העובד כבר קיים ברשימה
                existingEmployee.totalNetSalary += totalNetSalary;
                existingEmployee.totalGrossSalary += totalGrossSalary;
                existingEmployee.difference = existingEmployee.totalGrossSalary - 3000 > 0 ? existingEmployee.totalGrossSalary - 3000 : 0; // עדכון ההפרש
            } else {
                // הוספת עובד חדש לרשימה
                employeeSummaries.push({
                    _id: report.employeeId,
                    name: employeeNames[report.employeeId] || 'טוען...',
                    totalNetSalary: totalNetSalary,
                    totalGrossSalary: totalGrossSalary,
                    difference: difference
                });
            }
        });


        // יצירת גיליון עם הנתונים
        const summaryHeaders = ["שם עובד", "שכר נטו", "שכר ברוטו", "הפרש"];
        const summaryHeaderRow = sheetSummary.addRow(summaryHeaders);
        summaryHeaderRow.eachCell(cell => {
            cell.font = headerStyle.font;
            cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFFF00' } }; // צבע רקע
            cell.alignment = headerStyle.alignment;
        });

        // הוספת נתונים לגיליון
        employeeSummaries.forEach(emp => {
            sheetSummary.addRow([
                emp.name,
                emp.totalNetSalary,
                emp.totalGrossSalary,
                emp.difference
            ]);
        });

        // שמירת הקובץ כ-Excel
        workbook.xlsx.writeBuffer().then(buffer => {
            const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
            saveAs(blob, `דוחות_${new Date().toISOString().split('T')[0]}.xlsx`);
        });
    };

    const handleLogout = () => {
        // מחיקת פרטי ההתחברות מ-localStorage ו-sessionStorage
        localStorage.removeItem('token');
        localStorage.removeItem('isAdmin');
        sessionStorage.removeItem('token');
        sessionStorage.removeItem('isAdmin');

        // ניתוב לעמוד התחברות
        navigate('/login');
    };

    return (
        <body>
            <div className="development-banner">האתר בשלבי פיתוח</div>
            <header className="navbar navbar-expand-lg navbar-light bg-light">
                <div className="container">
                    <span className="navbar-brand"> {user?.name ? ` שלום ${user.name} ` : ''}
                    </span>
                    <div className="collapse navbar-collapse d-flex justify-content-between align-items-center">
                        <ul className="navbar-nav mr-auto">
                            <li className="nav-item">
                                <a className="nav-link" href="/admin">עמוד ניהול</a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" href="/settings">הגדרות</a>
                            </li>
                        </ul>
                        <div className="d-flex align-items-center">
                            <a onClick={handleLogout} className="logout-link">התנתק</a>
                        </div>
                    </div>
                </div>
            </header>

            <div className="container mt-5">
                <h1>כל הדוחות</h1>
                <button className="btn btn-primary mt-3" onClick={exportToExcel}>
                    יצוא דוחות ל-Excel
                </button>
                {loading ? (
                    <p>טוען דוחות...</p>
                ) : (
                    <div>
                        {reports.length > 0 ? (
                            <div className="row">
                                {reports.map((report, index) => {
                                    const totalSum = report.deliverables.reduce((sum, item) => sum + item.total, 0);
                                    return (
                                        <div className="col-md-6 mb-4" key={index}>
                                            <div className="card">
                                                <div className="card-body">
                                                    <h5 className="card-title">דוח {employeeNames[report.employeeId] || 'טוען...'}</h5>
                                                    <p>תאריך: {report.date}</p>
                                                    <h6 className="mt-3">הספקים:</h6>
                                                    <ul className="list-group mb-3">
                                                        {report.deliverables.map((item, idx) => (
                                                            <li className="list-group-item" key={`${item.type}-${idx}`}>
                                                                <p><strong>סוג:</strong> {item.type}</p>
                                                                <p><strong>כמות:</strong> {item.quantity}</p>
                                                                <p><strong>תעריף:</strong> {item.rate}</p>
                                                                <p><strong>תפקיד:</strong> {item.role}</p>
                                                                <p><strong>פרוייקט:</strong> {item.project}</p>
                                                                <p><strong>מדור:</strong> {item.section}</p>
                                                                <p><strong>סימן/סעיף:</strong> {item.sign}</p>
                                                                <p><strong>סכום סה"כ:</strong> {item.total}</p>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                    {report.common && (
                                                        <p className="card-text">
                                                            <strong>הערה:</strong> {report.common}
                                                        </p>
                                                    )}
                                                    <p className="card-text mt-3">
                                                        <strong>סה"כ:</strong> {totalSum}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            <p>אין דוחות</p>
                        )}
                    </div>
                )}
            </div>

        </body>
    );

};
export default Reports;


// ---------
// {/* <div className="container mt-5">
// <h1>כל הדוחות</h1>

// <button
//     className="btn btn-primary mt-3"
//     onClick={exportToExcel}
// >
//     יצוא דוחות ל-Excel
// </button>

// {/* הצגת הדוחות */}
// {loading ? (
//     <p>טוען דוחות...</p>
// ) : (
//     <div>
//         {reports.length > 0 ? (
//             <div className="row">
//                 {reports.map((report, index) => {
//                     // חישוב הסכום הכולל של כל ההספקים בדוח
//                     const totalSum = report.deliverables.reduce((sum, item) => sum + item.total, 0);

//                     return (
//                         <div className="col-md-6 mb-4" key={index}>
//                             <div className="card">
//                                 <div className="card-body">
//                                     {/* כותרת הדוח */}
//                                     <h5 className="card-title">
//                                         דוח {employeeNames[report.employeeId] || 'טוען...'}
//                                     </h5>
//                                     <p>תאריך: {report.date}</p>
//                                     {/* הצגת ההספקים */}
//                                     <h6 className="mt-3">הספקים:</h6>
//                                     <ul className="list-group mb-3">
//                                         {report.deliverables.map((item, idx) => (
//                                             <li className="list-group-item" key={`${item.type}-${idx}`}>
//                                                 <p><strong>סוג:</strong> {item.type}</p>
//                                                 <p><strong>כמות:</strong> {item.quantity}</p>
//                                                 <p><strong>תעריף:</strong> {item.rate}</p>
//                                                 <p><strong>תפקיד:</strong> {item.role}</p>
//                                                 <p><strong>פרוייקט:</strong> {item.project}</p>
//                                                 <p><strong>מדור:</strong> {item.section}</p>
//                                                 <p><strong>סימן/סעיף:</strong> {item.sign}</p>
//                                                 <p><strong>סכום סה"כ:</strong> {item.total}</p>
//                                             </li>
//                                         ))}
//                                     </ul>

//                                     {/* הערה לדוח */}
//                                     {report.common && (
//                                         <p className="card-text">
//                                             <strong>הערה:</strong> {report.common}
//                                         </p>
//                                     )}

//                                     {/* סכום כולל */}
//                                     <p className="card-text mt-3">
//                                         <strong>סה"כ:</strong> {totalSum}
//                                     </p>
//                                 </div>
//                             </div>
//                         </div>
//                     );
//                 })}
//             </div>
//         ) : (
//             <p>אין דוחות</p>
//         )}
//     </div>
// )}
// </div> */}