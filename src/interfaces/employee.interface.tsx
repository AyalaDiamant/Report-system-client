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