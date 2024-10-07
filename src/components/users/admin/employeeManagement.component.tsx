import React, { useEffect, useState } from 'react';
import employeeService from '../../../services/employee.service';
import { Employee } from '../../../interfaces/employee.interface'; // נוודא לייבא את הממשק
import { useNavigate } from 'react-router-dom';
import { useUser } from '../../../contexts/user.context';
import Header from '../../header.component';

const EmployeeManagement: React.FC = () => {
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [newEmployee, setNewEmployee] = useState<Employee>({
        _id: 0,
        name: '',
        password: '',
        address: '',
        city: '',
        phoneNumber: '',
        bankDetails: {
            bankName: '',
            branchNumber: '',
            accountNumber: '',
        },
        role: {
            name: '',
            rate: 0,
            rateIncrease: 0,
        },
        project: '',
    });
    const [editEmployee, setEditEmployee] = useState<Employee | null>(null);
    const [handleAdd, setHandleAdd] = useState<boolean>(false);

    const navigate = useNavigate();
    const { user } = useUser();

    useEffect(() => {
        fetchEmployees();
    }, []);

    const fetchEmployees = async () => {
        try {
            const data = await employeeService.getAllEmployees();
            setEmployees(data);
        } catch (error) {
            console.error('Error fetching employees:', error);
        }
    };

    const handleAddEmployee = () => {
        setHandleAdd(!handleAdd);
    }

    const handleCreateEmployee = async () => {
        try {
            await employeeService.createEmployee(newEmployee);
            setNewEmployee({
                _id: 0,
                name: '',
                password: '',
                address: '',
                city: '',
                phoneNumber: '',
                bankDetails: {
                    bankName: '',
                    branchNumber: '',
                    accountNumber: '',
                },
                role: {
                    name: '',
                    rate: 0,
                    rateIncrease: 0,
                },
                project: '',
            }); // reset form
            fetchEmployees(); // refresh employee list
            setHandleAdd(false)
        } catch (error) {
            console.error('Error creating employee:', error);
        }
    };

    const handleUpdateEmployee = async () => {
        if (editEmployee) {
            try {
                await employeeService.updateEmployee(editEmployee._id, editEmployee);
                setEditEmployee(null); // reset edit form
                fetchEmployees(); // refresh employee list
            } catch (error) {
                console.error('Error updating employee:', error);
            }
        }
    };

    const handleDeleteEmployee = async (employeeId: number) => {
        if (confirm('האם אתה בטוח שברצונך למחוק עובד זה?')) {
            try {
                await employeeService.deleteEmployee(employeeId);
                fetchEmployees(); // refresh employee list
            } catch (error) {
                console.error('Error deleting employee:', error);
            }
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('isAdmin');
        sessionStorage.removeItem('token');
        sessionStorage.removeItem('isAdmin');

        navigate('/login');
    };

    const handleHome = () => {
        navigate('/admin');
    };

    const handleSetting = () => {
        navigate('/settings');
    };

    const handleReport = () => {
        navigate('/reports');
    }
    const handleEmployeeManagement = () => {
        navigate('/employee-management');
    };

    return (
        <div>
            <Header
                user={user}
                role="manager" // מצב של מנהל
                handleLogout={handleLogout}
                handleReport={handleReport}
                handleEmployeeManagement={handleEmployeeManagement}
                handleHome={handleHome}
                handleSettings={handleSetting}
            />
            <div className="container mt-5">
                <h2 className="text-center">ניהול עובדים</h2>
                <div className="">
                    {employees.length === 1 ? (
                        <div>
                            <p className="no-reports">עדיין אין עובדים</p>
                            <button className='btn btn-primary card row mb-12' onClick={handleAddEmployee}>הוסף עובד</button>
                        </div>
                    ) : (
                        <div className="card">
                            <div className="card-header text-center">
                                <h3>רשימת עובדים</h3>
                            </div>
                            <div className="card-body">
                                <ul className="list-group mb-4">
                                    {employees.map((employee) => (
                                        employee._id !== 0 && (
                                            <li key={employee._id} className="list-group-item d-flex justify-content-between align-items-center">
                                                {employee.name} - {employee.role?.name}
                                                <div>
                                                    <button type="button" className="btn btn-warning btn-sm" onClick={() => setEditEmployee(employee)}>ערוך</button>
                                                    <button type="button" className="btn btn-danger btn-sm" onClick={() => handleDeleteEmployee(employee._id)}>מחק</button>
                                                </div>
                                            </li>
                                        )
                                    ))}
                                </ul>
                            </div>
                            <button className='btn btn-primary card row mb-12' onClick={handleAddEmployee}>הוסף עובד</button>
                        </div>
                    )}

                </div>
                {handleAdd ? (
                    <div className="row mb-4">
                        <div className="col-md-12">
                            <div className="card">
                                <div className="card-header text-center">
                                    <h3>הוסף עובד חדש</h3>
                                </div>
                                <div className="card-body">
                                    <form>
                                        <div className="form-group">
                                            <label>שם</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                placeholder="הכנס שם"
                                                value={newEmployee.name}
                                                onChange={(e) => setNewEmployee({ ...newEmployee, name: e.target.value })}
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label>סיסמה</label>
                                            <input
                                                type="password"
                                                className="form-control"
                                                placeholder="הכנס סיסמה"
                                                value={newEmployee.password}
                                                onChange={(e) => setNewEmployee({ ...newEmployee, password: e.target.value })}
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label>כתובת</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                placeholder="הכנס כתובת"
                                                value={newEmployee.address}
                                                onChange={(e) => setNewEmployee({ ...newEmployee, address: e.target.value })}
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label>עיר</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                placeholder="הכנס עיר"
                                                value={newEmployee.city}
                                                onChange={(e) => setNewEmployee({ ...newEmployee, city: e.target.value })}
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label>מספר טלפון</label>
                                            <input
                                                type="tel"
                                                className="form-control"
                                                placeholder="הכנס מספר טלפון"
                                                value={newEmployee.phoneNumber}
                                                onChange={(e) => setNewEmployee({ ...newEmployee, phoneNumber: e.target.value })}
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label>שם בנק</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                placeholder="הכנס שם בנק"
                                                value={newEmployee.bankDetails.bankName}
                                                onChange={(e) => setNewEmployee({ ...newEmployee, bankDetails: { ...newEmployee.bankDetails, bankName: e.target.value } })}
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label>מספר סניף</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                placeholder="הכנס מספר סניף"
                                                value={newEmployee.bankDetails.branchNumber}
                                                onChange={(e) => setNewEmployee({ ...newEmployee, bankDetails: { ...newEmployee.bankDetails, branchNumber: e.target.value } })}
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label>מספר חשבון</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                placeholder="הכנס מספר חשבון"
                                                value={newEmployee.bankDetails.accountNumber}
                                                onChange={(e) => setNewEmployee({ ...newEmployee, bankDetails: { ...newEmployee.bankDetails, accountNumber: e.target.value } })}
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label>תפקיד</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                placeholder="הכנס תפקיד"
                                                value={newEmployee.role.name}
                                                onChange={(e) => setNewEmployee({ ...newEmployee, role: { ...newEmployee.role, name: e.target.value } })}
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label>שכר</label>
                                            <input
                                                type="number"
                                                className="form-control"
                                                placeholder="הכנס שכר"
                                                value={newEmployee.role.rate}
                                                onChange={(e) => setNewEmployee({ ...newEmployee, role: { ...newEmployee.role, rate: Number(e.target.value) } })}
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label>עליית שכר</label>
                                            <input
                                                type="number"
                                                className="form-control"
                                                placeholder="הכנס עליית שכר"
                                                value={newEmployee.role.rateIncrease}
                                                onChange={(e) => setNewEmployee({ ...newEmployee, role: { ...newEmployee.role, rateIncrease: Number(e.target.value) } })}
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label>פרויקט</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                placeholder="הכנס פרויקט"
                                                value={newEmployee.project}
                                                onChange={(e) => setNewEmployee({ ...newEmployee, project: e.target.value })}
                                            />
                                        </div>
                                        <button type="button" className="btn btn-primary" onClick={handleCreateEmployee}>הוסף עובד</button>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>

                ) : (
                    <p></p>
                )
                }
                {
                    editEmployee && (
                        <div className="card mb-2">
                            <div className="card-header text-center">
                                <h3>עריכת תפקיד ופרוייקט</h3>
                            </div>
                            <div className="card-body">
                                <form>
                                    <div className="form-group">
                                        <label>תפקיד</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            placeholder="הכנס תפקיד"
                                            value={editEmployee.role.name}
                                            onChange={(e) => setEditEmployee({ ...editEmployee, role: { ...editEmployee.role, name: e.target.value } })}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>שכר</label>
                                        <input
                                            type="number"
                                            className="form-control"
                                            placeholder="הכנס שכר"
                                            value={editEmployee.role.rate}
                                            onChange={(e) => setEditEmployee({ ...editEmployee, role: { ...editEmployee.role, rate: Number(e.target.value) } })}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>עליית שכר</label>
                                        <input
                                            type="number"
                                            className="form-control"
                                            placeholder="הכנס עליית שכר"
                                            value={editEmployee.role.rateIncrease}
                                            onChange={(e) => setEditEmployee({ ...editEmployee, role: { ...editEmployee.role, rateIncrease: Number(e.target.value) } })}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>פרויקט</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            placeholder="הכנס פרויקט"
                                            value={editEmployee.project}
                                            onChange={(e) => setEditEmployee({ ...editEmployee, project: e.target.value })}
                                        />
                                    </div>
                                    <button type="button" className="btn btn-success" onClick={handleUpdateEmployee}>שמור שינויים</button>
                                </form>
                            </div>
                        </div>
                    )
                }
            </div >
        </div>

    );
};

export default EmployeeManagement;

