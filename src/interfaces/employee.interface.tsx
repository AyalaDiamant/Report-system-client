export interface Employee {
    _id: number
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
    role:
    {
        name: string,
        rate: number,
        rateIncrease: number,
    },
    project: string,
}

export interface EmployeeSummary{
    _id: number;
    name: string;
    totalNetSalary: number;
    totalGrossSalary: number;
    difference: number;
}