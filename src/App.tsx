import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const App: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // בדיקת טוקן ב-localStorage או sessionStorage בעת טעינת האפליקציה
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    const isAdmin = localStorage.getItem('isAdmin') || sessionStorage.getItem('isAdmin');
    if (token) {
      navigate(isAdmin === 'true' ? '/admin' : '/employee');
    } else {
      navigate('/login');
    }
  }, [navigate]);

  return (
    <div>
    </div>
  );
};

export default App;

