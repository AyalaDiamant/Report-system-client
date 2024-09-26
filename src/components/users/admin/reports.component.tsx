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
import { Settings } from '../../../interfaces/settings.interface';

const Reports: React.FC = () => {
    const [reports, setReports] = useState<MyReport[]>([]);
    const [originalReports, setOriginalReports] = useState<MyReport[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [employeeNames, setEmployeeNames] = useState<{ [key: number]: string }>({});
    const [setting, setSetting] = useState<Settings | null>(null);

    const navigate = useNavigate();
    const { user } = useUser();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem('token') || sessionStorage.getItem('token');
                if (!token) {
                    throw new Error('No token found. User is not authenticated.');
                }

                // טעינת הדוחות
                const reportData = await ReportService.getAllReports();
                setReports(reportData);
                setOriginalReports([...reportData]);

                // טעינת ההגדרות
                const settingsData = await getSetting();
                const settings = settingsData[0] || {};
                setSetting({
                    roles: settings.roles || [],
                    projects: settings.projects || []
                });

                // טעינת שמות העובדים
                const namesMap: { [key: number]: string } = {};

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
        const sheetSummary = workbook.addWorksheet('התאמות שכר');

        const headerStyle = {
            font: { bold: true },
            fill: {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: 'FFFFFF00' }
            },
            alignment: { horizontal: 'center' as ExcelJS.Alignment['horizontal'] }
        };

        const headers = ["שם עובד", "פרוייקט", "סימן/סעיף", "תפקיד", "תעריף", "סה\"כ", "כמות", "הערה"];
        const headerRow = sheet.addRow(headers);
        headerRow.eachCell(cell => {
            cell.font = headerStyle.font;
            cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFFF00' } };
            cell.alignment = headerStyle.alignment;
        });

        originalReports.forEach(report => {
            report.deliverables.forEach(e => {
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
            });
        });

        const updatedReports = reports.map(report => {
            const updatedDeliverables = report.deliverables.map(e => {
                const settingForRole = setting?.roles.find(set => set.name === e.role);

                if (e.type === 'אחר') {
                    return e; // לא משנה כלום אם type הוא "אחר"
                }

                if (settingForRole) {
                    const newRate = e.rate + settingForRole.rateIncrease;
                    const newTotal = e.quantity * newRate;
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

        const updatedHeaderRow = sheetUpdated.addRow(headers);
        updatedHeaderRow.eachCell(cell => {
            cell.font = headerStyle.font;
            cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFFF00' } };
            cell.alignment = headerStyle.alignment;
        });

        updatedReports.forEach(report => {
            report.deliverables.forEach(e => {
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
            });
        });

        const calcHeaders = ["שם עובד", "שכר נטו", "שכר ברוטו", "הפרש 15%", "יתרה"];
        const calcHeaderRow = sheetCalculations.addRow(calcHeaders);
        calcHeaderRow.eachCell(cell => {
            cell.font = headerStyle.font;
            cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFFF00' } };
            cell.alignment = headerStyle.alignment;
        });

        reports.forEach(report => {
            report.deliverables.forEach(e => {
                const settingForRole = setting?.roles.find(set => set.name === e.role);
                let grossSalary = 0;
                let netSalary = 0;
                let deduction = 0;
                let balance = 0;

                if (e.type === 'אחר') {
                    grossSalary = e.quantity * e.rate;
                    netSalary = grossSalary;
                } else if (settingForRole) {
                    grossSalary = e.quantity * (e.rate + settingForRole.rateIncrease);
                    netSalary = e.total;
                    deduction = grossSalary * 0.15;
                    balance = grossSalary - netSalary - deduction;
                }

                sheetCalculations.addRow([
                    employeeNames[report.employeeId] || 'טוען...',
                    netSalary,
                    grossSalary,
                    deduction,
                    balance
                ]);
            });
        });

        const employeeSummaries: { _id: number; name: string; totalNetSalary: number; totalGrossSalary: number; difference: number; }[] = [];

        // שינוי: קבלת הנטו והברוטו מתוך טבלת החישובים
        sheetCalculations.eachRow((row, rowIndex) => {
            if (rowIndex > 1) {  // דילוג על שורת הכותרת
                const employeeName = row.getCell(1).value;
                const netSalary = row.getCell(2).value;
                const grossSalary = row.getCell(3).value;

                let existingEmployee = employeeSummaries.find(emp => emp.name === employeeName);

                if (existingEmployee) {
                    existingEmployee.totalNetSalary += Number(netSalary);
                    existingEmployee.totalGrossSalary += Number(grossSalary);
                    existingEmployee.difference = existingEmployee.totalGrossSalary - 3000 > 0 ? existingEmployee.totalGrossSalary - 3000 : 0;
                } else {
                    employeeSummaries.push({
                        _id: rowIndex,
                        name: String(employeeName),
                        totalNetSalary: netSalary as number,
                        totalGrossSalary: grossSalary as number,
                        difference: (grossSalary as number) > 3000 ? (grossSalary as number) - 3000 : 0
                    });
                }
            }
        });
        // בשביל ההפרש
        // const summaryHeaders = ["שם עובד", "שכר נטו", "שכר ברוטו", "הפרש"];
        const summaryHeaders = ["שם עובד", "שכר נטו", "שכר ברוטו"];

        const summaryHeaderRow = sheetSummary.addRow(summaryHeaders);
        summaryHeaderRow.eachCell(cell => {
            cell.font = headerStyle.font;
            cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFFF00' } };
            cell.alignment = headerStyle.alignment;
        });

        employeeSummaries.forEach(emp => {
            sheetSummary.addRow([
                emp.name,
                emp.totalNetSalary,
                emp.totalGrossSalary,
                // בשביל ההפרש
                // emp.difference
            ]);
        });

        workbook.xlsx.writeBuffer().then(buffer => {
            const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
            saveAs(blob, `דוחות_${new Date().toISOString().split('T')[0]}.xlsx`);
        });
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('isAdmin');
        sessionStorage.removeItem('token');
        sessionStorage.removeItem('isAdmin');

        navigate('/login');
    };

    const handleHome = () => {
        navigate('/admin');
    };

    const handleSetting = () => {
        navigate('/settings');
    };
    // const removeReport = async (index: number) => {

    // };

    // const editReport = (index: number) => {

    // };


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
                                <span className="nav-link" onClick={handleHome}>עמוד הבית</span>
                            </li>
                            <li className="nav-item">
                                <span className="nav-link" onClick={handleSetting}>הגדרות</span>
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
                <button className="btn btn-secondary marginBottun mt-3" onClick={exportToExcel}>
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
                                            <div className="card report-card">
                                                <div className="card-header">
                                                    <h5 className="card-title">דוח {employeeNames[report.employeeId] || 'טוען...'}</h5>
                                                </div>
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
                                                            <p><strong>סימן/סעיף:</strong> {item.sign}</p>
                                                            <p><strong>סכום סה"כ:</strong> {item.total}</p>
                                                        </li>
                                                    ))}
                                                    {/* <div>
                                                        <button type="button" className="btn btn-sm btn-warning btn-padding" onClick={() => editReport(index)}>ערוך</button>
                                                        <button type="button" className="btn btn-sm btn-danger btn-padding" onClick={() => removeReport(index)}>מחק</button>
                                                    </div> */}
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
                                    );
                                })}
                            </div>
                        ) : (
                            <p>אין דוחות</p>
                        )}
                    </div>
                )}
            </div>

        </div>
    );

};
export default Reports;