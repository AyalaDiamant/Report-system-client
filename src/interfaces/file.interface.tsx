export interface FileData {
    _id?: string; // ייחודי של הקובץ
    uploadedBy: string; // מזהה המשתמש שהעלה את הקובץ
    assignedTo: string; // מזהה המשתמש שהוקצה לקובץ
    fileName: string; // שם הקובץ
    filePath: string; // נתיב הקובץ בשרת
}