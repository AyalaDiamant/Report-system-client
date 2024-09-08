export interface Employee {
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