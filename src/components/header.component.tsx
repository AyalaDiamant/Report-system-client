import React from 'react';

interface HeaderProps {
    user: { name: string } | null;
    role: 'employee' | 'manager';
    handleLogout: () => void;
    handleReport: () => void;
    toggleShowReports?: () => void; // אופציונלי לעובד
    handleEmployeeManagement?: () => void; // אופציונלי למנהל
    handleHome: () => void;
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
    // handleSettings
}) => {
    return (
        <div>
            <div className="development-banner">האתר בשלבי פיתוח</div>

            <header className="navbar navbar-expand-lg navbar-light header-container">
                <div className="container">
                    {/* הצגת "לא מחובר" אם אין יוזר */}
                    <span className="navbar-brand">{user ? `שלום ${user.name}` : 'לא מחובר'}</span>

                    <div className="collapse navbar-collapse d-flex justify-content-between align-items-center">
                        {/* הצגת הכפתורים אם יש יוזר */}
                        {user && (
                            <ul className="navbar-nav">
                                <li className="nav-item">
                                    <button className="nav-link btn" onClick={handleHome}>עמוד הבית</button>
                                </li>
                                <li className="nav-item">
                                    {role === 'employee' ? (
                                        <button className="nav-link btn" onClick={toggleShowReports}>
                                            הדוחות שלי
                                        </button>
                                    ) : (
                                        <button className="nav-link btn" onClick={handleReport}>דוחות</button>
                                    )}
                                </li>
                                {role === 'employee' && (
                                    <li className="nav-item">
                                        <button className="nav-link btn" onClick={handleReport}>למילוי דוח</button>
                                    </li>
                                )}
                                {role === 'manager' && (
                                    <>
                                        <li className="nav-item">
                                            <button className="nav-link btn" onClick={handleEmployeeManagement}>ניהול עובדים</button>
                                        </li>
                                        {/* <li className="nav-item">
                                            <button className="nav-link btn" onClick={handleSettings}>הגדרות</button>
                                        </li> */}
                                    </>
                                )}
                                <div className="d-flex align-items-center">
                                    <button onClick={handleLogout} className="logout-link btn">התנתק</button>
                                </div>
                            </ul>

                        )}
                    </div>
                </div>
            </header>
        </div>
    );
};

export default Header;

