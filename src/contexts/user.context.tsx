import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// יצירת ה-Context עבור המשתמש
interface UserContextType {
  user: { employeeId: number, name: string, roles: any } | null;
  setUser: (user: { employeeId: number, name: string, roles: any } | null) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

// ה-Hook לשימוש ב-Context
export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};

// הקומפוננטה שמספקת את המידע של המשתמש לכל האפליקציה
export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  
  const [user, setUser] = useState<{ employeeId: number, name: string,  roles:any } | null>(null);

  // טעינת המשתמש מה-localStorage כאשר הקומפוננטה נטענת
  useEffect(() => {
    try {
      const savedUser = localStorage.getItem('user');
      if (savedUser) {
        setUser(JSON.parse(savedUser));
      }
    } catch (error) {
      console.error("Error parsing user data from localStorage:", error);
      // במקרה שיש שגיאה בהמרה, אפשרי למחוק את הפריט מה-localStorage או לטפל בזה בצורה אחרת
      localStorage.removeItem('user');
    }
  }, []);

  // שמירת המשתמש ב-localStorage כאשר הוא משתנה
  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
  }, [user]);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

