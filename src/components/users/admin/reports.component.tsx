// import React, { useEffect, useState } from 'react';
// import ReportService from '../../../services/report.service';
// import EmployeeService from '../../../services/employee.service';
// import { MyReport } from '../../../interfaces/report.interface';
// import * as XLSX from 'xlsx';
// import { saveAs } from 'file-saver';

// const Reports: React.FC = () => {
//     const [reports, setReports] = useState<MyReport[]>([]);
//     const [originalReports, setOriginalReports] = useState<MyReport[]>([]); // שמירה של הדוחות המקוריים
//     const [loading, setLoading] = useState<boolean>(true);
//     const [employeeNames, setEmployeeNames] = useState<{ [key: number]: string }>({});

//     useEffect(() => {
//         const fetchData = async () => {
//             try {
//                 const token = localStorage.getItem('token');
//                 if (!token) {
//                     throw new Error('No token found. User is not authenticated.');
//                 }

//                 // טעינת הדוחות
//                 const reportData = await ReportService.getAllReports();
//                 setReports(reportData);
//                 setOriginalReports([...reportData]); // שמירה של הדוחות המקוריים
                
//                 // טעינת שמות העובדים
//                 const namesMap: { [key: number]: string } = {};
//                 for (const report of reportData) {
//                     try {
//                         const employee = await EmployeeService.getEmployeeById(report.employeeId);
//                         namesMap[report.employeeId] = employee.name;
//                     } catch (error) {
//                         console.error(`Error loading employee with ID ${report.employeeId}:`, error);
//                         namesMap[report.employeeId] = 'שגיאה';
//                     }
//                 }
//                 setEmployeeNames(namesMap);
                
//             } catch (error) {
//                 console.error('Error loading reports:', error);
//             } finally {
//                 setLoading(false);
//             }
//         };

//         fetchData();
//     }, []);

//     const exportToExcel = () => {
//         const wb = XLSX.utils.book_new();

//         // יצירת גיליון לדוחות מקור
//         const originalWsData = [
//             ["שם עובד", "פרוייקט", "סימן/סעיף", "תפקיד", "תעריף", "סה\"כ", "הערה"],
//             ...originalReports.map(report => [
//                 employeeNames[report.employeeId] || 'טוען...',
//                 report.project,
//                 report.sign,
//                 report.role,
//                 report.rate,
//                 report.total,
//                 report.common
//             ])
//         ];
//         const originalWs = XLSX.utils.aoa_to_sheet(originalWsData);
//         XLSX.utils.book_append_sheet(wb, originalWs, 'דוחות מקור');

//         // יצירת גיליון לדוחות לאחר שינוי
//         const updatedReports = reports.map(report => ({
//             ...report,
//             common: report.common + ' | ' + 'זה לאחר שינוי',
//             rate: report.rate + 100,
//             total: (report.quantity * (report.rate + 100))
//         }));

//         const updatedWsData = [
//             ["שם עובד", "פרוייקט", "סימן/סעיף", "תפקיד", "תעריף", "סה\"כ", "הערה"],
//             ...updatedReports.map(report => [
//                 employeeNames[report.employeeId] || 'טוען...',
//                 report.project,
//                 report.sign,
//                 report.role,
//                 report.rate,
//                 report.total,
//                 report.common
//             ])
//         ];
//         const updatedWs = XLSX.utils.aoa_to_sheet(updatedWsData);
//         XLSX.utils.book_append_sheet(wb, updatedWs, 'דוחות לאחר שינוי');

//         const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
//         const blob = new Blob([wbout], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
//         const today = new Date().toISOString().split('T')[0];
//         const fileName = `דוחות_${today}.xlsx`;
//         saveAs(blob, fileName);
//     };

//     return (
//         <div className="container mt-5">
//             <h1>כל הדוחות</h1>

//             <button 
//                 className="btn btn-primary mt-3"
//                 onClick={exportToExcel}
//             >
//                 יצוא דוחות ל-Excel
//             </button>
            

//             {/* הצגת הדוחות */}
//             {loading ? (
//                 <p>טוען דוחות...</p>
//             ) : (
//                 <div>
//                     {reports.length > 0 ? (
//                         <div className="row">
//                             {reports.map((report, index) => (
//                                 <div className="col-md-4 mb-3" key={index}>
//                                     <div className="card">
//                                         <div className="card-body">
//                                             <h5 className="card-title">דוח {employeeNames[report.employeeId] || 'טוען...'}</h5>
//                                             <p><strong>סוג:</strong> {report.type}</p>
//                                             <p><strong>כמות:</strong> {report.quantity}</p>
//                                             <p><strong>תעריף:</strong> {report.rate}</p>
//                                             <p><strong>תפקיד:</strong> {report.role}</p>
//                                             <p><strong>פרוייקט:</strong> {report.project}</p>
//                                             <p><strong>מדור:</strong> {report.section}</p>
//                                             <p><strong>סימן/סעיף:</strong> {report.sign}</p>
//                                             <p><strong>סכום סה"כ:</strong> {report.total}</p>
//                                             <p><strong>הערה:</strong> {report.common}</p>
//                                         </div>
//                                     </div>
//                                 </div>
//                             ))}
//                         </div>
//                     ) : (
//                         <p>אין דוחות</p>
//                     )}
//                 </div>
//             )}
//         </div>
//     );
// };

// export default Reports;


import React, { useEffect, useState } from 'react';
import ReportService from '../../../services/report.service';
import EmployeeService from '../../../services/employee.service';
import { MyReport } from '../../../interfaces/report.interface';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

const Reports: React.FC = () => {
    const [reports, setReports] = useState<MyReport[]>([]);
    const [originalReports, setOriginalReports] = useState<MyReport[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [employeeNames, setEmployeeNames] = useState<{ [key: number]: string }>({});

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
        const wb = XLSX.utils.book_new();

        // יצוא דוחות מקור
        const originalSheetData = [
            ["שם עובד", "פרוייקט", "סימן/סעיף", "תפקיד", "תעריף", "סה\"כ", "הערה"],
            ...originalReports.map(report => [
                employeeNames[report.employeeId] || 'טוען...',
                report.project,
                report.sign,
                report.role,
                report.rate,
                report.total,
                report.common
            ])
        ];
        const originalWs = XLSX.utils.aoa_to_sheet(originalSheetData);
        XLSX.utils.book_append_sheet(wb, originalWs, 'דוחות מקור');

        // יצוא דוחות לאחר שינוי
        const updatedReports = reports.map(report => ({
            ...report,
            rate: report.rate + 100,
            total: (report.quantity * (report.rate + 100))
        }));

        const updatedSheetData = [
            ["שם עובד", "פרוייקט", "סימן/סעיף", "תפקיד", "תעריף", "סה\"כ", "הערה"],
            ...updatedReports.map(report => [
                employeeNames[report.employeeId] || 'טוען...',
                report.project,
                report.sign,
                report.role,
                report.rate,
                report.total,
                report.common
            ])
        ];
        const updatedWs = XLSX.utils.aoa_to_sheet(updatedSheetData);
        XLSX.utils.book_append_sheet(wb, updatedWs, 'דוחות לאחר שינוי');

        // יצוא טבלת חישובים
        const calculationsData = [
            ["שם עובד", "שכר נטו", "שכר ברוטו", "הפרש 15%", "יתרה"],
            ...reports.map(report => {
                const netSalary = report.total;
                const newRate = report.rate + 100;
                const grossSalary = report.quantity * newRate;
                const deduction = grossSalary * 0.15;
                const balance = grossSalary - netSalary - deduction;

                return [
                    employeeNames[report.employeeId] || 'טוען...',
                    netSalary,
                    grossSalary,
                    deduction,
                    balance
                ];
            })
        ];
        const calculationsWs = XLSX.utils.aoa_to_sheet(calculationsData);
        XLSX.utils.book_append_sheet(wb, calculationsWs, 'טבלת חישובים');

        const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
        const blob = new Blob([wbout], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        const today = new Date().toISOString().split('T')[0];
        const fileName = `דוחות_${today}.xlsx`;
        saveAs(blob, fileName);
    };

    return (
        <div className="container mt-5">
            <h1>כל הדוחות</h1>

            <button 
                className="btn btn-primary mt-3"
                onClick={exportToExcel}
            >
                יצוא דוחות ל-Excel
            </button>

            {/* הצגת הדוחות */}
            {loading ? (
                <p>טוען דוחות...</p>
            ) : (
                <div>
                    {reports.length > 0 ? (
                        <div className="row">
                            {reports.map((report, index) => (
                                <div className="col-md-4 mb-3" key={index}>
                                    <div className="card">
                                        <div className="card-body">
                                            <h5 className="card-title">דוח {employeeNames[report.employeeId] || 'טוען...'}</h5>
                                            <p><strong>סוג:</strong> {report.type}</p>
                                            <p><strong>כמות:</strong> {report.quantity}</p>
                                            <p><strong>תעריף:</strong> {report.rate}</p>
                                            <p><strong>תפקיד:</strong> {report.role}</p>
                                            <p><strong>פרוייקט:</strong> {report.project}</p>
                                            <p><strong>מדור:</strong> {report.section}</p>
                                            <p><strong>סימן/סעיף:</strong> {report.sign}</p>
                                            <p><strong>סכום סה"כ:</strong> {report.total}</p>
                                            <p><strong>הערה:</strong> {report.common}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p>אין דוחות</p>
                    )}
                </div>
            )}
        </div>
    );
};

export default Reports;
