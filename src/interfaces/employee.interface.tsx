export interface Employee {
    _id: Number
    name: string;
    password: string;
    address: string;
    city: string;
    phoneNumber: string;
    bankDetails: {
        bankName: string;
        branchNumber: string;
        accountNumber: string;
    };
}

export interface EmployeeSummary{
    // name: string,
    // netSalary?: number;           // שכר נטו (אופציונלי)
    // grossSalary?: number;         // שכר ברוטו (אופציונלי)
    // deduction?: number;           // סכום להורדה (אופציונלי)
    // addition?: number;            // סכום להוספה (אופציונלי)
    // transferredFrom?: string;     // שם עובד שממנו הועבר (אופציונלי)
    // transferredTo?: string;       // שם עובד שאליו הועבר (אופציונלי)
    _id: number;
    name: string;
    totalNetSalary: number;
    totalGrossSalary: number;
    difference: number;
}