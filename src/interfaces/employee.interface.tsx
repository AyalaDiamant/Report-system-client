export interface Employee {
    _id: number;
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
    isAdmin?: boolean; // הוספת השדה isAdmin
    roles: {
        name: string;
        rate: number;
        rateIncrease: number;
    }[];
    project: string;
}
