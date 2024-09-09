import React, { createContext, useContext, useState, ReactNode } from 'react';

// יצירת ה-Context עבור המשתמש
interface UserContextType {
  user: { employeeId: number, name: string } | null;
  setUser: (user: { employeeId: number, name: string } | null) => void;
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
  const [user, setUser] = useState<{ employeeId: number, name: string } | null>(null);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};
