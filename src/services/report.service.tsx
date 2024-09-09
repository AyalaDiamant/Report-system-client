// // import axios from 'axios';

// // const API_URL = 'http://localhost:3000/api/report';

// // const addReport = async (reportData: any) => {
// //     try {
// //         const response = await axios.post(API_URL, reportData, {
// //             headers: {
// //                 'Content-Type': 'application/json',
// //                 'Authorization': `Bearer ${localStorage.getItem('token')}`, 
// //             },
// //         });
// //         return response.data;
// //     } catch (error: any) {
// //         throw new Error(`Error adding report: ${error.message}`);
// //     }
// // };

// // const ReportService = {
// //     addReport,
// // };

// // export default ReportService;

// import axios from 'axios';

// const API_URL = 'http://localhost:3000/api/report';

// // פונקציה להוספת דוח
// const addReport = async (reportData: any) => {
//     const token = localStorage.getItem('token'); // שליפת הטוקן מה-LocalStorage
//     if (!token) {
//         throw new Error('No token found. User is not authenticated.');
//     }

//     try {
//         const response = await axios.post(API_URL, reportData, {
//             headers: {
//                 'Content-Type': 'application/json',
//                 'Authorization': `Bearer ${token}`, // שולח את הטוקן תחת Authorization
//             },
//         });
//         return response.data;
//     } catch (error: any) {
//         console.error('Error adding report:', error.response ? error.response.data : error.message);
//         throw new Error(`Error adding report: ${error.response ? error.response.data : error.message}`);
//     }
// };

// const getReportByEmployee = async (employeeId: any) => {
//     try {
//         const response = await axios.get(`${API_URL}/${employeeId}`);
//         console.log(response);   
//         return response.data;
//     } catch (error) {
//         console.error('Error get reports:', error);
//         throw error;
//     }
// };

// const ReportService = {
//     addReport,
//     getReportByEmployee
// };

// export default ReportService;


import axios from 'axios';

const API_URL = 'http://localhost:3000/api/report';

// פונקציה להוספת דוח
const addReport = async (reportData: any) => {
    const token = localStorage.getItem('token'); // שליפת הטוקן מה-LocalStorage
    if (!token) {
        throw new Error('No token found. User is not authenticated.');
    }

    try {
        const response = await axios.post(API_URL, reportData, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`, // שולח את הטוקן תחת Authorization
            },
        });
        return response.data;
    } catch (error: any) {
        console.error('Error adding report:', error.response ? error.response.data : error.message);
        throw new Error(`Error adding report: ${error.response ? error.response.data : error.message}`);
    }
};

// פונקציה לקבלת דוחות לפי מזהה עובד
const getReportByEmployee = async (employeeId: any) => {
    try {
        const response = await axios.get(`${API_URL}/${employeeId}`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`, // שליחת הטוקן עם הבקשה
            },
        });
        return response.data;
    } catch (error: any) {
        console.error('Error getting reports:', error.response ? error.response.data : error.message);
        throw error;
    }
};

const ReportService = {
    addReport,
    getReportByEmployee
};

export default ReportService;
