// src/services/reportService.ts
import axios from 'axios';
// import { Report } from '../interfaces/report.interface';

const API_URL = 'http://localhost:3000/api/report';

const addReport = async (reportData: any) => {
    try {
        const response = await axios.post(API_URL, reportData, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`, // Use token from localStorage
            },
        });
        return response.data;
    } catch (error: any) {
        throw new Error(`Error adding report: ${error.message}`);
    }
};

const ReportService = {
    addReport,
};

export default ReportService;

