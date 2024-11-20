// אינטרפייס של קובץ, כרגע לא נוגעים בו.

// export interface FileData {
//     _id?: string; // ייחודי של הקובץ
//     uploadedBy: string; // מזהה המשתמש שהעלה את הקובץ
//     assignedTo: string; // מזהה המשתמש שהוקצה לקובץ
//     fileName: string; // שם הקובץ
//     filePath: string; // נתיב הקובץ בשרת
// }

export interface Document {
    _id: string;                  // ID של המסמך (הנתיב יוכל להיות מונגוז)
    originalName: string;         // שם הקובץ המקורי
    status: 'התחלה' | 'בבדיקה' | 'מוכן לבדיקה' | 'מושלם' | 'בתור הממתינים'; // סטטוס הקובץ
    uploadedBy: string;           // ID של מי שהעלה את הקובץ
    assignedTo: string | '';    // ID של מי שמוקצה לתיקון (אם יש)
    filePath: string;             // נתיב הקובץ על השרת
    dateUploaded: string;         // תאריך העלאת הקובץ
    isInQueue: boolean;
  }

