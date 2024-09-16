// export interface MyReport {
//     employeeId: number, // מספר עובד
//     type: string, // סוג
//     quantity: number, // כמות
//     rate: number, // תעריף
//     role: string, // תפקיד
//     project: string, // פרוייקט
//     section: string, // מדור
//     sign: string, // סימן/סעיף
//     total: number, // סכום סה"כ
//     common: string // ערך משותף
// }

export interface Deliverable {
    type: string; // סוג
    quantity: number; // כמות
    rate: number; // תעריף
    role: string; // תפקיד
    project: string; // פרוייקט
    section: string; // מדור
    sign: string; // סימן/סעיף
    total: number; // סכום סה"כ
}

export interface MyReport {
    employeeId: number; // מספר עובד
    deliverables: Deliverable[]; // מערך של הספקים
    common: string; // הערה כללית
}
