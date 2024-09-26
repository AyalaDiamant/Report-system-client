export interface Deliverable {
    type: string; // סוג
    quantity: number; // כמות
    rate: number; // תעריף
    role: string; // תפקיד
    project: string; // פרוייקט
    sign: string; // סימן/סעיף
    seif: string;
    total: number; // סכום סה"כ
}

export interface MyReport {
    _id: number
    employeeId: number; // מספר עובד
    date: String,
    deliverables: Deliverable[]; // מערך של הספקים
    common: string; // הערה כללית
}
