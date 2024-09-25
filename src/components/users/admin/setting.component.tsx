import React, { useState, useEffect } from 'react';
import { saveSetting, getSetting, updateRole, removeRole, removeProject } from '../../../services/setting.service';
import { useUser } from '../../../contexts/user.context';
import { useNavigate } from 'react-router-dom';

const Setting: React.FC = () => {
  const [projects, setProjects] = useState<string[]>([]);
  const [roles, setRoles] = useState<{ name: string; rate: number | ''; rateIncrease: number | '' }[]>([]);
  const [newProject, setNewProject] = useState<string>('');
  const [newRoleName, setNewRoleName] = useState<string>('');
  const [newRoleRate, setNewRoleRate] = useState<number | ''>('');
  const [newRoleRateIncrease, setNewRoleRateIncrease] = useState<number | ''>('');
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const navigate = useNavigate();
  const { user } = useUser();

  // פונקציה לקבלת ההגדרות
  const fetchSettings = async () => {
    try {
      const settings = await getSetting();
      if (settings.length > 0) {
        setProjects(settings[0].projects || []);
        setRoles(settings[0].roles || []);
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      // רק שמור אם יש שינוי
      const existingSetting = await getSetting();
      const existingProjects = existingSetting.length > 0 ? existingSetting[0].projects : [];
      const existingRoles = existingSetting.length > 0 ? existingSetting[0].roles : [];

      if (JSON.stringify(existingProjects) !== JSON.stringify(projects) ||
        JSON.stringify(existingRoles) !== JSON.stringify(roles)) {
        const setting = { projects, roles };
        await saveSetting(setting);
        setMessage('ההגדרות נשמרו בהצלחה!!');
      } else {
        setMessage('לא היו שינויים להישמר.');
      }

      setNewProject('');
      resetForm();
    } catch (error) {
      setMessage('שגיאה בשמירת ההגדרות.');
    }
  };

  const addProject = () => {
    if (newProject) {
      setProjects([...new Set([...projects, newProject])]); // הוספה ללא כפילויות
      setNewProject('');
    }
  };

  const addRole = () => {
    if (newRoleName && newRoleRate !== '' && newRoleRateIncrease !== '') {
      const newRole = { name: newRoleName, rate: newRoleRate, rateIncrease: newRoleRateIncrease };
      if (!roles.some(role => role.name === newRoleName)) { // בדיקה שאין כפילויות
        setRoles([...roles, newRole]);
        resetForm();
      } else {
        setMessage('תפקיד קיים כבר.');
      }
    }
  };

  const removeRoleByIndex = async (index: number) => {
    await removeRole(index); // קריאה לשרת למחוק תפקיד
    const updatedRoles = roles.filter((_, i) => i !== index);
    setRoles(updatedRoles);
  };

  const removeProjectByIndex = async (index: number) => {
    await removeProject(index);
    const updatedProjects = projects.filter((_, i) => i !== index);
    setProjects(updatedProjects);
  };

  const editRole = (index: number) => {
    setNewRoleName(roles[index].name);
    setNewRoleRate(roles[index].rate);
    setNewRoleRateIncrease(roles[index].rateIncrease);
    setEditingIndex(index);
  };

  const handleUpdateRole = async () => {
    if (editingIndex !== null) {
      const updatedRole = { name: newRoleName, rate: newRoleRate, rateIncrease: newRoleRateIncrease };
      await updateRole(editingIndex, updatedRole); // קריאה לשרת
      setRoles(roles.map((role, index) => (index === editingIndex ? updatedRole : role)));
      resetForm();
    }
  };

  const resetForm = () => {
    setNewRoleName('');
    setNewRoleRate('');
    setNewRoleRateIncrease('');
    setEditingIndex(null);
  };

  return (
    <div>
      <div className="development-banner">האתר בשלבי פיתוח</div>
      <header className="navbar navbar-expand-lg navbar-light bg-light">
        <div className="container">
          <span className="navbar-brand"> {user?.name ? `שלום ${user.name}` : ''}</span>
          <div className="collapse navbar-collapse d-flex justify-content-between align-items-center">
            <ul className="navbar-nav mr-auto">
              <li className="nav-item"><span className="nav-link" onClick={() => navigate('/admin')}>דף הבית</span></li>
              <li className="nav-item"><span className="nav-link" onClick={() => navigate('/reports')}>דוחות</span></li>
            </ul>
            <div className="d-flex align-items-center">
              <a onClick={() => {
                localStorage.removeItem('token');
                localStorage.removeItem('isAdmin');
                sessionStorage.removeItem('token');
                sessionStorage.removeItem('isAdmin');
                navigate('/login');
              }} className="logout-link">התנתקות</a>
            </div>
          </div>
        </div>
      </header>
      <div className="container mt-5">
        <div className="row justify-content-center">
          <div className="col-md-8"> {/* Increased width here */}
            <div className="card">
              <div className="card-header text-center">
                <h2>הגדרות</h2>
                <h5>לאחר הוספת תפקיד/פרוייקט יש ללחוץ על הכפתו 'שמור' למטה אחרת השינויים לא ישמרו!</h5>
              </div>
              <div className="card-body">
                <form onSubmit={handleSubmit}>
                  <div className="form-group">
                    <label htmlFor="projects">פרויקטים</label>
                    <input
                      id="projects"
                      type="text"
                      className="form-control"
                      value={newProject}
                      onChange={(e) => setNewProject(e.target.value)}
                    />
                    <button type="button" className="btn btn-secondary mt-2" onClick={addProject}>הוסף פרויקט</button>
                  </div>

                  <label>תפקידים</label>
                  <div className="form-group">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="שם התפקיד"
                      value={newRoleName}
                      onChange={(e) => setNewRoleName(e.target.value)}
                    />
                    <input
                      type="number"
                      className="form-control mt-2"
                      placeholder="שכר"
                      value={newRoleRate}
                      onChange={(e) => setNewRoleRate(Number(e.target.value))}
                    />
                    <input
                      type="number"
                      className="form-control mt-2"
                      placeholder="עליית שכר"
                      value={newRoleRateIncrease}
                      onChange={(e) => setNewRoleRateIncrease(Number(e.target.value))}
                    />
                    <button type="button" className="btn btn-secondary mt-2" onClick={editingIndex !== null ? handleUpdateRole : addRole}>
                      {editingIndex !== null ? 'עדכן תפקיד' : 'הוסף תפקיד'}
                    </button>
                  </div>

                  <h3>תפקידים קיימים</h3>
                  <ul className="list-group mb-3">
                    {roles.map((role, index) => (
                      <li key={index} className="list-group-item d-flex justify-content-between align-items-center">
                        {role.name} - שכר: {role.rate}, עליית שכר: {role.rateIncrease}
                        <div>
                          <button type="button" className="btn btn-sm btn-warning btn-padding" onClick={() => editRole(index)}>ערוך</button>
                          <button type="button" className="btn btn-sm btn-danger btn-padding" onClick={() => removeRoleByIndex(index)}>מחק</button>
                        </div>
                      </li>
                    ))}
                  </ul>

                  <h3>פרויקטים קיימים</h3>
                  <ul className="list-group mb-3">
                    {projects.map((project, index) => (
                      <li key={index} className="list-group-item d-flex justify-content-between align-items-center">
                        {project}
                        <button type="button" className="btn btn-sm btn-danger" onClick={() => removeProjectByIndex(index)}>מחק</button>
                      </li>
                    ))}
                  </ul>

                  <button type="submit" className="btn btn-secondary">שמור</button>
                  {message && <p className='mt-3'>{message}</p>}
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Setting;
