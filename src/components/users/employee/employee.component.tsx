// // import React, { useEffect, useState } from 'react';
// // import { useNavigate } from 'react-router-dom';
// // import ReportService from '../../../services/report.service';
// // import { useUser } from '../../../contexts/user.context';
// // import { MyReport } from '../../../interfaces/report.interface';

// // const Employee: React.FC = () => {
// //     const [reports, setReports] = useState<MyReport[]>([]);
// //     const [loading, setLoading] = useState<boolean>(true);
// //     const [seeReports, setSeeReports] = useState<boolean>(false);
// //     const navigate = useNavigate();
// //     const { user } = useUser();

// //     const loadReports = async () => {        
// //         try {
// //             const token = localStorage.getItem('token');
// //             if (!token) {
// //                 throw new Error('No token found. User is not authenticated.');
// //             }
// //             let employeeId = user?.employeeId;

// //             if (!employeeId) {
// //                 throw new Error('Employee ID not found.');
// //             }

// //             const data = await ReportService.getReportByEmployee(employeeId);
// //             setReports(data);
// //         } catch (error) {
// //             console.error('Error loading reports:', error);
// //         } finally {
// //             setLoading(false);
// //         }
// //     };

// //     useEffect(() => {
// //         loadReports();
// //     }, [user, navigate]);

// //     const handleLogout = () => {
// //         localStorage.removeItem('token');
// //         localStorage.removeItem('isAdmin');
// //         sessionStorage.removeItem('token');
// //         sessionStorage.removeItem('isAdmin');

// //         navigate('/login');
// //     };
// //     const handleReport = () => {
// //         navigate('/report');
// //     };
// //     const seeReportFunc = () => {
// //         console.log(seeReports);

// //         setSeeReports(true)
// //     }

// //     return (
// //         <div>
// //             <div className="development-banner">האתר בשלבי פיתוח</div>

// //             <header className="navbar navbar-expand-lg navbar-light bg-light">
// //                 <div className="container">
// //                     <span className="navbar-brand"> {user?.name ? ` שלום ${user.name} ` : ''}
// //                     </span>
// //                     <div className="collapse navbar-collapse d-flex justify-content-between align-items-center">
// //                         <ul className="navbar-nav mr-auto">
// //                             <li className="nav-item">
// //                                 <span className="nav-link" onClick={handleReport}>למילוי דוח</span>
// //                             </li>
// //                             <li className="nav-item">
// //                                 <span className="nav-link" onClick={seeReportFunc}>הדוחות שלי</span>
// //                             </li>
// //                         </ul>
// //                         <div className="d-flex align-items-center">
// //                             <a onClick={handleLogout} className="logout-link">התנתק</a>
// //                         </div>
// //                     </div>
// //                 </div>
// //             </header>

// //             <div className="container mt-5">
// //                 <h1>עמוד עובד</h1>
// //                 {loading && seeReports? (
// //                     <p>טוען דוחות...</p>
// //                 ) : (
// //                     <div className="reports-container">
// //                         <h2 className="reports-title">כל הדוחות</h2>
// //                         {reports.length > 0 ? (
// //                             <div className="row">
// //                                 {reports.map((report, index) => {
// //                                     const totalSum = report.deliverables.reduce((sum, item) => sum + item.total, 0);

// //                                     return (
// //                                         <div className="col-md-4 mb-4" key={index}>
// //                                             <div className="card report-card">
// //                                                 <div className="card-header">
// //                                                     <h5 className="card-title">דוח מיום {report.date}</h5>
// //                                                 </div>
// //                                                 <div className="card-body">
// //                                                     <h6 className="mb-3">הספקים:</h6>
// //                                                     <ul className="list-group mb-3">
// //                                                         {report.deliverables.map((item, idx) => (
// //                                                             <li className="list-group-item" key={`${item.type}-${idx}`}>
// //                                                                 <div className="list-item">
// //                                                                     <p><strong>סוג:</strong> {item.type}</p>
// //                                                                     <p><strong>כמות:</strong> {item.quantity}</p>
// //                                                                     <p><strong>תעריף:</strong> {item.rate}</p>
// //                                                                     <p><strong>תפקיד:</strong> {item.role}</p>
// //                                                                     <p><strong>פרוייקט:</strong> {item.project}</p>
// //                                                                     <p><strong>מדור:</strong> {item.section}</p>
// //                                                                     <p><strong>סימן/סעיף:</strong> {item.sign}</p>
// //                                                                     <p><strong>סכום סה"כ:</strong> {item.total}</p>
// //                                                                 </div>
// //                                                             </li>
// //                                                         ))}
// //                                                     </ul>

// //                                                     {report.common && (
// //                                                         <p className="card-text">
// //                                                             <strong>הערה:</strong> {report.common}
// //                                                         </p>
// //                                                     )}

// //                                                     <p className="card-text total-sum">
// //                                                         <strong>סה"כ:</strong> {totalSum}
// //                                                     </p>
// //                                                 </div>
// //                                             </div>
// //                                         </div>
// //                                     );
// //                                 })}
// //                             </div>
// //                         ) : (
// //                             <p className="no-reports">אין דוחות לעובד זה.</p>
// //                         )}
// //                     </div>

// //                 )}
// //             </div>
// //         </div>

// //     );
// // };

// // export default Employee;

// import React, { useEffect, useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import ReportService from '../../../services/report.service';
// import { useUser } from '../../../contexts/user.context';
// import { MyReport } from '../../../interfaces/report.interface';

// const Employee: React.FC = () => {
//     const [reports, setReports] = useState<MyReport[]>([]);
//     const [loading, setLoading] = useState<boolean>(true);
//     const [showReports, setShowReports] = useState<boolean>(false); // מצב להצגת הדוחות
//     const navigate = useNavigate();
//     const { user } = useUser();

//     const loadReports = async () => {
//         try {
//             const token = localStorage.getItem('token') || sessionStorage.getItem('token');

//             if (!token) {
//                 throw new Error('No token found. User is not authenticated.');
//             }

//             let employeeId = user?.employeeId;

//             if (!employeeId) {
//                 throw new Error('Employee ID not found.');
//             }

//             const data = await ReportService.getReportByEmployee(employeeId);
//             setReports(data);
//         } catch (error) {
//             console.error('Error loading reports:', error);
//         } finally {
//             setLoading(false);
//         }
//     };

//     useEffect(() => {
//         loadReports();
//     }, [user,navigate]);

//     const handleLogout = () => {
//         localStorage.removeItem('token');
//         localStorage.removeItem('isAdmin');
//         sessionStorage.removeItem('token');
//         sessionStorage.removeItem('isAdmin');
//         navigate('/login');
//     };

//     const handleReport = () => {
//         navigate('/report');
//     };

//     const toggleShowReports = () => {
//         setShowReports((prevShowReports) => !prevShowReports); // הופך את המצב
//     };

//     return (
//         <div>
//             <div className="development-banner">האתר בשלבי פיתוח</div>

//             <header className="navbar navbar-expand-lg navbar-light bg-light">
//                 <div className="container">
//                     <span className="navbar-brand">
//                         {user?.name ? `שלום ${user.name}` : ''}
//                     </span>
//                     <div className="collapse navbar-collapse d-flex justify-content-between align-items-center">
//                         <ul className="navbar-nav mr-auto">
//                             <li className="nav-item">
//                                 <button className="nav-link btn" onClick={toggleShowReports}>
//                                     הדוחות שלי
//                                 </button>
//                             </li>
//                             <li className="nav-item">
//                                 <span className="nav-link" onClick={handleReport}>
//                                     למילוי דוח
//                                 </span>
//                             </li>
//                         </ul>
//                         <div className="d-flex align-items-center">
//                             <a onClick={handleLogout} className="logout-link">התנתק</a>
//                         </div>
//                     </div>
//                 </div>
//             </header>

//             <div className="container mt-5">
//                 <h1>עמוד עובד</h1>
//                 {showReports && ( // הצגת הדוחות רק אם showReports הוא true
//                     loading ? (
//                         <p>טוען דוחות...</p>
//                     ) : (
//                         <div className="reports-container">
//                             <h2 className="reports-title">הדוחות שלי</h2>
//                             {reports.length > 0 ? (
//                                 <div className="row">
//                                     {reports.map((report, index) => {
//                                         const totalSum = report.deliverables.reduce((sum, item) => sum + item.total, 0);
//                                         return (
//                                             <div className="col-md-4 mb-4" key={index}>
//                                                 <div className="card report-card">
//                                                     <div className="card-header">
//                                                         <h5 className="card-title">דוח מיום {report.date}</h5>
//                                                     </div>
//                                                     <div className="card-body">
//                                                         <h6 className="mb-3">הספקים:</h6>
//                                                         <ul className="list-group mb-3">
//                                                             {report.deliverables.map((item, idx) => (
//                                                                 <li className="list-group-item" key={`${item.type}-${idx}`}>
//                                                                     <div className="list-item">
//                                                                         <p><strong>סוג:</strong> {item.type}</p>
//                                                                         <p><strong>כמות:</strong> {item.quantity}</p>
//                                                                         <p><strong>תעריף:</strong> {item.rate}</p>
//                                                                         <p><strong>תפקיד:</strong> {item.role}</p>
//                                                                         <p><strong>פרוייקט:</strong> {item.project}</p>
//                                                                         <p><strong>סכום סה"כ:</strong> {item.total}</p>
//                                                                     </div>
//                                                                 </li>
//                                                             ))}
//                                                         </ul>
//                                                         {report.common && (
//                                                             <p className="card-text">
//                                                                 <strong>הערה:</strong> {report.common}
//                                                             </p>
//                                                         )}
//                                                         <p className="card-text total-sum">
//                                                             <strong>סה"כ:</strong> {totalSum}
//                                                         </p>
//                                                     </div>
//                                                 </div>
//                                             </div>
//                                         );
//                                     })}
//                                 </div>
//                             ) : (
//                                 <p className="no-reports">אין דוחות לעובד זה.</p>
//                             )}
//                         </div>
//                     )
//                 )}
//             </div>
//         </div>
//     );
// };

// export default Employee;


// import React, { useEffect, useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import ReportService from '../../../services/report.service';
// import { useUser } from '../../../contexts/user.context';
// import { MyReport } from '../../../interfaces/report.interface';

// const Employee: React.FC = () => {
//   const [reports, setReports] = useState<MyReport[]>([]);
//   const [loading, setLoading] = useState<boolean>(true);
//   const [showReports, setShowReports] = useState<boolean>(false);
//   const navigate = useNavigate();
//   const { user } = useUser();

//   const loadReports = async () => {
//     try {
//       const data = await ReportService.getReportByEmployee(user?.employeeId || 0);
//       setReports(data);
//     } catch (error) {
//       console.error('Error loading reports:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     loadReports();
//   }, [user, navigate]);

//   const handleLogout = () => {
//     localStorage.removeItem('token');
//     sessionStorage.removeItem('token');
//     navigate('/login');
//   };

//   const handleReport = () => {
//     navigate('/report');
//   };

//   const toggleShowReports = () => {
//     setShowReports(!showReports);
//   };

//   // פונקציה למחיקת דוח
//   const handleDelete = async (reportId: number) => {
//     if (confirm('אתה בטוח שברצונך למחוק את הדוח?')){
//       try {
//         await ReportService.deleteReport(reportId);
//         setReports(reports.filter((report) => report._id !== reportId));
//       } catch (error) {
//         console.error('Error deleting report:', error);
//       }
//     }
//   };

//   // פונקציה לעריכת דוח
//   const handleEdit = (reportId: string) => {
//   };

//   return (
//     <div>
//       <div className="development-banner">האתר בשלבי פיתוח</div>

//       <header className="navbar navbar-expand-lg navbar-light bg-light">
//         <div className="container">
//           <span className="navbar-brand">
//             {user?.name ? `שלום ${user.name}` : ''}
//           </span>
//           <div className="collapse navbar-collapse d-flex justify-content-between align-items-center">
//             <ul className="navbar-nav mr-auto">
//               <li className="nav-item">
//                 <button className="nav-link btn" onClick={toggleShowReports}>
//                   הדוחות שלי
//                 </button>
//               </li>
//               <li className="nav-item">
//                 <span className="nav-link" onClick={handleReport}>
//                   למילוי דוח
//                 </span>
//               </li>
//             </ul>
//             <div className="d-flex align-items-center">
//               <a onClick={handleLogout} className="logout-link">התנתק</a>
//             </div>
//           </div>
//         </div>
//       </header>

//       <div className="container mt-5">
//         <h1>עמוד עובד</h1>
//         {showReports && (
//           loading ? (
//             <p>טוען דוחות...</p>
//           ) : (
//             <div className="reports-container">
//               <h2 className="reports-title">הדוחות שלי</h2>
//               {reports.length > 0 ? (
//                 <div className="row">
//                   {reports.map((report, index) => {
//                     const totalSum = report.deliverables.reduce((sum, item) => sum + item.total, 0);
//                     return (
//                       <div className="col-md-4 mb-4" key={index}>
//                         <div className="card report-card">
//                           <div className="card-header">
//                             <h5 className="card-title">דוח מיום {report.date}</h5>
//                           </div>
//                           <div className="card-body">
//                             <h6 className="mb-3">הספקים:</h6>
//                             <ul className="list-group mb-3">
//                               {report.deliverables.map((item, idx) => (
//                                 <li className="list-group-item" key={`${item.type}-${idx}`}>
//                                   <div className="list-item">
//                                     <p><strong>סוג:</strong> {item.type}</p>
//                                     <p><strong>כמות:</strong> {item.quantity}</p>
//                                     <p><strong>תעריף:</strong> {item.rate}</p>
//                                     <p><strong>תפקיד:</strong> {item.role}</p>
//                                     <p><strong>פרוייקט:</strong> {item.project}</p>
//                                     <p><strong>סכום סה"כ:</strong> {item.total}</p>
//                                   </div>
//                                 </li>
//                               ))}
//                             </ul>
//                             {report.common && (
//                               <p className="card-text">
//                                 <strong>הערה:</strong> {report.common}
//                               </p>
//                             )}
//                             <p className="card-text total-sum">
//                               <strong>סה"כ:</strong> {totalSum}
//                             </p>
//                             <div className="d-flex justify-content-between">
//                               <button className="btn btn-primary" onClick={() => handleEdit(report._id)}>
//                                 ערוך
//                               </button>
//                               <button className="btn btn-danger" onClick={() => handleDelete(report._id)}>
//                                 מחק
//                               </button>
//                             </div>
//                           </div>
//                         </div>
//                       </div>
//                     );
//                   })}
//                 </div>
//               ) : (
//                 <p className="no-reports">אין דוחות לעובד זה.</p>
//               )}
//             </div>
//           )
//         )}
//       </div>
//     </div>
//   );
// };

// export default Employee;

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ReportService from '../../../services/report.service';
import { useUser } from '../../../contexts/user.context';
import { Deliverable, MyReport } from '../../../interfaces/report.interface';
import Enums from '../../../interfaces/enums';

const Employee: React.FC = () => {
    const [reports, setReports] = useState<MyReport[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [showReports, setShowReports] = useState<boolean>(false);
    const [editingReportId, setEditingReportId] = useState<string | null>(null);
    const [editedReportData, setEditedReportData] = useState<any>({});
    const [originalReportData, setOriginalReportData] = useState<MyReport | null>(null);

    const navigate = useNavigate();
    const { user } = useUser();

    const loadReports = async () => {
        try {
            const data = await ReportService.getReportByEmployee(user?.employeeId || 0);
            setReports(data);
        } catch (error) {
            console.error('Error loading reports:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadReports();
    }, [user, navigate]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        sessionStorage.removeItem('token');
        navigate('/login');
    };

    const handleReport = () => {
        navigate('/report');
    };

    const toggleShowReports = () => {
        setShowReports(!showReports);
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
        setOriginalReportData(report); // שמירת הנתונים המקוריים
        setEditedReportData(report.deliverables.map((item) => ({
            type: item.type,
            quantity: item.quantity,
            seif: item.seif, // וודא שהשדה הזה קיים
            sign: item.sign,
        })));
    };

    const handleChange = (idx: number, field: keyof Deliverable, value: string | number) => {
        setEditedReportData((prevData: any) => {
            const updatedData = [...prevData];
            updatedData[idx] = { ...updatedData[idx], [field]: value }; // עדכון רק את השדה הנבחר
            return updatedData;
        });
    };

    const handleSaveEdit = () => {
        if (!originalReportData) return;

        const updatedReport: MyReport = {
            ...originalReportData, // קח את כל הנתונים המקוריים
            deliverables: editedReportData, // ושנה את מערך הספקים
        };

        // כאן תבצע את השמירה לשרת או כל פעולה אחרת
        console.log('Updated Report:', updatedReport);
        // Reset the editing state
        setEditingReportId(null);
        setEditedReportData([]);
    };

    // // פונקציה לעריכת דוח
    // const handleEdit = (report: MyReport) => {
    //     setEditingReportId(report._id);
    //     setEditedReportData(report.deliverables.map((item) => ({
    //         type: item.type,
    //         quantity: item.quantity,
    //         seif: item.seif, // וודא שהשדה הזה קיים
    //         sign: item.sign, 
    //     })));
    // };

    // const handleSaveEdit = async (reportId: string) => {
    //     try {
    //         console.log(editedReportData);

    //         await ReportService.updateReport(reportId, { deliverables: editedReportData });
    //         setReports(reports.map(report =>
    //             report._id === reportId ? { ...report, deliverables: editedReportData } : report
    //         ));
    //         setEditingReportId(null);
    //     } catch (error) {
    //         console.error('Error updating report:', error);
    //     }
    // };

    // // const handleChange = (index: number, field: string, value: any) => {
    // //     const updatedDeliverables = [...editedReportData];
    // //     updatedDeliverables[index][field] = value;
    // //     setEditedReportData(updatedDeliverables);
    // // };
    // const handleChange = (idx: number, field: string, value: string | number) => {
    //     setEditedReportData((prevData: any) => {
    //         const updatedData = [...prevData];
    //         updatedData[idx] = { ...updatedData[idx], [field]: value }; // עדכון השדה שנבחר בלבד
    //         return updatedData;
    //     });
    // };


    return (
        <div>
            <div className="development-banner">האתר בשלבי פיתוח</div>

            <header className="navbar navbar-expand-lg navbar-light bg-light">
                <div className="container">
                    <span className="navbar-brand">
                        {user?.name ? `שלום ${user.name}` : ''}
                    </span>
                    <div className="collapse navbar-collapse d-flex justify-content-between align-items-center">
                        <ul className="navbar-nav mr-auto">
                            <li className="nav-item">
                                <button className="nav-link btn" onClick={toggleShowReports}>
                                    הדוחות שלי
                                </button>
                            </li>
                            <li className="nav-item">
                                <span className="nav-link" onClick={handleReport}>
                                    למילוי דוח
                                </span>
                            </li>
                        </ul>
                        <div className="d-flex align-items-center">
                            <a onClick={handleLogout} className="logout-link">התנתק</a>
                        </div>
                    </div>
                </div>
            </header>

            <div className="container mt-5">
                <h1>עמוד עובד</h1>
                {showReports && (
                    loading ? (
                        <p>טוען דוחות...</p>
                    ) : (
                        <div className="reports-container">
                            <h2 className="reports-title">הדוחות שלי</h2>
                            {reports.length > 0 ? (
                                <div className="row">
                                    {reports.map((report, index) => {
                                        const totalSum = report.deliverables.reduce((sum, item) => sum + item.total, 0);
                                        return (
                                            <div className="col-md-4 mb-4" key={index}>
                                                <div className="card report-card">
                                                    <div className="card-header">
                                                        <h5 className="card-title">דוח מיום {report.date}</h5>
                                                    </div>
                                                    <div className="card-body">
                                                        <h6 className="mb-3">הספקים:</h6>
                                                        <ul className="list-group mb-3">
                                                            {report.deliverables.map((item, idx) => (
                                                                <li className="list-group-item" key={`${item.type}-${idx}`}>
                                                                    <div className="list-item">
                                                                        <p><strong>סוג:</strong> {item.type}</p>
                                                                        <p><strong>כמות:</strong> {item.quantity}</p>
                                                                        <p><strong>תפקיד:</strong> {item.role}</p>
                                                                        <p><strong>פרוייקט:</strong> {item.project}</p>
                                                                        <p><strong>סעיף:</strong> {item.seif}</p>
                                                                        <p><strong>סימן:</strong> {item.sign}</p>
                                                                        <p><strong>סכום סה"כ:</strong> {item.total}</p>
                                                                    </div>
                                                                </li>
                                                            ))}
                                                        </ul>
                                                        {report.common && (
                                                            <p className="card-text">
                                                                <strong>הערה:</strong> {report.common}
                                                            </p>
                                                        )}
                                                        <p className="card-text total-sum">
                                                            <strong>סה"כ:</strong> {totalSum}
                                                        </p>
                                                        <div className="d-flex justify-content-between">
                                                            <button className="btn btn-primary" onClick={() => handleEditReport(report)}>
                                                                ערוך
                                                            </button>
                                                            <button className="btn btn-danger" onClick={() => handleDelete(report._id)}>
                                                                מחק
                                                            </button>
                                                        </div>
                                                    </div>
                                                    {/* {editingReportId === report._id && (
                                                        <div className="card-body mt-3">
                                                            <h6>ערוך דוח</h6>
                                                            {editedReportData.map((deliverable: {
                                                                type: string | number | readonly string[] | undefined;
                                                                quantity: string | number | readonly string[] | undefined;
                                                                seif: string | number | readonly string[] | undefined;
                                                                sign: string | number | readonly string[] | undefined;
                                                            }, idx: React.Key | null | undefined) => (
                                                                <div key={idx} className="mb-3">
                                                                    <select id="type" name="type" value={deliverable.type} onChange={(e) => handleChange(idx, 'type', e.target.value)} className="form-control" required>                     <option value="">בחר סוג</option>
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
                                                            <button className="btn btn-success mt-2" onClick={() => handleSaveEdit(report._id)}>
                                                                שמור שינויים
                                                            </button>
                                                            <button className="btn btn-secondary mt-2" onClick={() => setEditingReportId(null)}>
                                                                ביטול
                                                            </button>
                                                        </div>
                                                    )} */}

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
                                                                    {/* הוסף שדות נוספים אם צריך */}
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
                                            </div>
                                        );
                                    })}
                                </div>
                            ) : (
                                <p className="no-reports">אין דוחות לעובד זה.</p>
                            )}
                        </div>
                    )
                )}
            </div>
        </div>
    );
};

export default Employee;

