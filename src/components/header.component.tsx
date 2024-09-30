import React from 'react';

interface HeaderProps {
    user: { name: string } | null; // מידע על המשתמש
    role: 'employee' | 'manager'; // סוג המשתמש
    handleLogout: () => void; // פונקציה להתנתקות
    handleReport: () => void; // פונקציה לדף מילוי דוח
    toggleShowReports?: () => void; // אופציונלי לעובד
    handleEmployeeManagement?: () => void; // אופציונלי למנהל
    handleHome: () => void; // פונקציה לדף הבית
    handleSettings?: () => void; // אופציונלי למנהל
}

const Header: React.FC<HeaderProps> = ({
    user,
    role,
    handleLogout,
    handleReport,
    toggleShowReports,
    handleEmployeeManagement,
    handleHome,
    handleSettings
}) => {
    return (
        <div>
            <div className="development-banner">האתר בשלבי פיתוח</div>

            <header className="navbar navbar-expand-lg navbar-light bg-light">
                <div className="container">
                    <span className="navbar-brand">{user?.name ? `שלום ${user.name}` : ''}</span>
                    <div className="collapse navbar-collapse d-flex justify-content-between align-items-center">
                        <ul className="navbar-nav mr-auto">
                            <li className="nav-item">
                                <span className="nav-link" onClick={handleHome}>עמוד הבית</span>
                            </li>
                            <li className="nav-item">
                                {role === 'employee' ? (
                                    <button className="nav-link btn" onClick={toggleShowReports}>
                                        הדוחות שלי
                                    </button>
                                ) : (
                                    <span className="nav-link" onClick={handleReport}>דוחות</span>
                                )}
                            </li>
                            {role === 'employee' && (
                                <li className="nav-item">
                                    <span className="nav-link" onClick={handleReport}>למילוי דוח</span>
                                </li>
                            )}
                            {role === 'manager' && (
                                <>
                                    <li className="nav-item">
                                        <span className="nav-link" onClick={handleEmployeeManagement}>ניהול עובדים</span>
                                    </li>
                                    <li className="nav-item">
                                        <span className="nav-link" onClick={handleSettings}>הגדרות</span>
                                    </li>
                                </>
                            )}
                        </ul>
                        <div className="d-flex align-items-center">
                            <a onClick={handleLogout} className="logout-link">התנתק</a>
                        </div>
                    </div>
                </div>
            </header>
        </div>
    );
};

export default Header;
