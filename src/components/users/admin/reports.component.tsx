import React, { useEffect, useState } from 'react';
import ReportService from '../../../services/report.service';
import EmployeeService from '../../../services/employee.service';
import { Deliverable, MyReport } from '../../../interfaces/report.interface';
import { saveAs } from 'file-saver';
import { useUser } from '../../../contexts/user.context';
import { useNavigate } from 'react-router-dom';
import ExcelJS from 'exceljs';
import Enums from '../../../interfaces/enums';
import Header from '../../header.component';

const Reports: React.FC = () => {
    const [reports, setReports] = useState<MyReport[]>([]);
    const [originalReports, setOriginalReports] = useState<MyReport[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [employeeNames, setEmployeeNames] = useState<{ [key: number]: string }>({});
    // const [setting, setSetting] = useState<Settings | null>(null);
    const [editingReportId, setEditingReportId] = useState<number | null>(null);
    const [editedReportData, setEditedReportData] = useState<any>({});
    const [originalReportData, setOriginalReportData] = useState<MyReport | null>(null);
    
    const navigate = useNavigate();
    const { user } = useUser();

    useEffect(() => {
        fetchData();
    }, []);

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

            // // טעינת ההגדרות
            // const settingsData = await getSetting();
            // const settings = settingsData[0] || {};
            // setSetting({
            //     roles: settings.roles || [],
            //     projects: settings.projects || []
            // });

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

        const headers = ["שם עובד", "פרוייקט", "סימן", "סעיף", "תפקיד", "תעריף", "סה\"כ", "כמות", "הערה"];
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
                    e.seif,
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
                const newRate = e.rate + (e.rateIncrease || 0);
                const newTotal = e.quantity * newRate;

                return {
                    ...e,
                    rate: newRate,
                    total: newTotal
                };
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
                    e.seif,
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
                let grossSalary = 0;
                let netSalary = 0;
                let deduction = 0;
                let balance = 0;

                netSalary = e.quantity * e.rate;

                const newRate = e.rate + (e.rateIncrease || 0);
                grossSalary = e.quantity * newRate;

                deduction = grossSalary * 0.15;

                balance = grossSalary - netSalary - deduction;

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
            if (rowIndex > 1) {
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

    // פונקציה למחיקת דוח
    const handleDelete = async (reportId: number) => {
        if (confirm('אתה בטוח שברצונך למחוק את הדוח?')) {
            try {
                await ReportService.deleteReport(reportId);
                setReports(reports.filter((report) => report._id !== reportId));
            } catch (error) {
                console.error('Error deleting report:', error);
            }
        }
    };

    const handleEditReport = (report: MyReport) => {
        setEditingReportId(report._id);
        setOriginalReportData(report);
        setEditedReportData(report.deliverables.map((item) => ({
            type: item.type,
            quantity: item.quantity,
            seif: item.seif || '',
            sign: item.sign || '',
        })));
    };

    const handleChange = (idx: number, field: keyof Deliverable, value: string | number) => {
        setEditedReportData((prevData: any) => {
            const updatedData = [...prevData];
            updatedData[idx] = { ...updatedData[idx], [field]: value };

            return updatedData;
        });
    };

    const handleSaveEdit = async () => {
        if (!originalReportData) return;

        const updatedReport: MyReport = {
            ...originalReportData,
            deliverables: editedReportData.map((deliverable: any, idx: string | number) => ({
                ...originalReportData.deliverables[Number(idx)],
                ...deliverable,
            })),
        };

        try {
            const response = await ReportService.updateReport(originalReportData._id, updatedReport);
            await fetchData();
            console.log('Updated Report:', response);
        } catch (error) {
            console.error('Error saving changes:', error);
        }

        setEditingReportId(null);
        setEditedReportData([]);
        // loadReports();
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

    const handleReport = () => {
        navigate('/reports');
    }
    const handleEmployeeManagement = () => {
        navigate('/employee-management');
    };

    return (
        <div>
            <Header
                user={user}
                role="manager" // מצב של מנהל
                handleLogout={handleLogout}
                handleReport={handleReport}
                handleEmployeeManagement={handleEmployeeManagement}
                handleHome={handleHome}
                handleSettings={handleSetting}
            />
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
                                                </ul>
                                                {report.common && (
                                                    <p className="card-text">
                                                        <strong>הערה:</strong> {report.common}
                                                    </p>
                                                )}
                                                <p className="card-text mt-3">
                                                    <strong>סה"כ:</strong> {totalSum}
                                                </p>
                                                <div className='d-flex justify-content-between'>
                                                    <button className="btn btn-primary" onClick={() => handleEditReport(report)}>
                                                        ערוך
                                                    </button>
                                                    <button className="btn btn-danger" onClick={() => handleDelete(report._id)}>
                                                        מחק
                                                    </button>
                                                </div>
                                            </div>
                                            {editingReportId === report._id && (
                                                <div className="card-body mt-3">
                                                    <h6>ערוך דוח</h6>
                                                    {editedReportData.map((deliverable: Deliverable, idx: number) => (
                                                        <div key={idx} className="mb-3">
                                                            <select
                                                                id="type"
                                                                name="type"
                                                                value={deliverable.type}
                                                                onChange={(e) => handleChange(idx, 'type', e.target.value)}
                                                                className="form-control"
                                                                required
                                                            >
                                                                <option value="">בחר סוג</option>
                                                                {Object.values(Enums.ReportType).map((type) => (
                                                                    <option key={type} value={type}>{type}</option>
                                                                ))}
                                                            </select>
                                                            <input
                                                                type="number"
                                                                className="form-control mt-2"
                                                                placeholder="כמות"
                                                                value={deliverable.quantity}
                                                                onChange={(e) => handleChange(idx, 'quantity', e.target.value)}
                                                            />
                                                            <input
                                                                type="text"
                                                                className="form-control mt-2"
                                                                placeholder="סעיף"
                                                                value={deliverable.seif}
                                                                onChange={(e) => handleChange(idx, 'seif', e.target.value)}
                                                            />
                                                            <input
                                                                type="text"
                                                                className="form-control mt-2"
                                                                placeholder="סימן"
                                                                value={deliverable.sign}
                                                                onChange={(e) => handleChange(idx, 'sign', e.target.value)}
                                                            />
                                                        </div>
                                                    ))}
                                                    <button className="btn btn-success mt-2" onClick={handleSaveEdit}>
                                                        שמור שינויים
                                                    </button>
                                                    <button className="btn btn-secondary mt-2" onClick={() => setEditingReportId(null)}>
                                                        ביטול
                                                    </button>
                                                </div>
                                            )}
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