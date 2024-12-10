export interface Deliverable {
    // type: string; 
    quantity: number;
    rate: number; 
    rateIncrease: number, 
    role: string;
    project: string; 
    sign: string; 
    seif: string;
    total: number;
}

export interface MyReport {
    _id: number
    employeeId: number;
    date: String,
    deliverables: Deliverable[]; 
    common: string; 
}
