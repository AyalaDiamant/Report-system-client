// import React, { useState } from 'react';
// import { saveSetting } from '../../../services/setting.service';
// import Enums from '../../../interfaces/enums'

// const Setting: React.FC = () => {
//   const [role, setRole] = useState<string>('');
//   const [rate, setRate] = useState<number | ''>('');
//   const [rateIncrease, setRateIncrease] = useState<number | ''>('');
//   const [message, setMessage] = useState<string | null>(null);

//   const handleSubmit = async (event: React.FormEvent) => {
//     event.preventDefault();

//     try {
//       const setting = {
//         role,
//         rate: Number(rate),
//         rateIncrease: Number(rateIncrease),
//       };

//       await saveSetting(setting);
//       setMessage('Setting saved successfully!');
//     } catch (error) {
//       setMessage('Error saving setting');
//     }
//   };

//   return (
//     <div className="container mt-5">
//       <div className="row justify-content-center">
//         <div className="col-md-12">
//           <div className="card">
//             <div className="card-header text-center">
//               <h2>הגדרות</h2>
//             </div>
//             <div className="container mt-5">
//               {message && <p>{message}</p>}

//               <form onSubmit={handleSubmit}>
//                 <div className="form-group">
//                   <label htmlFor="role">תפקיד</label>
//                   <select
//                     id="role"
//                     className="form-control"
//                     value={role}
//                     onChange={(e) => setRole(e.target.value)}
//                     required
//                   >
//                     <option value="">בחר תפקיד</option>
//                     {Object.values(Enums.ReportRole).map((role) => (
//                       <option key={role} value={role}>
//                         {role}
//                       </option>
//                     ))}
//                   </select>
//                 </div>

//                 <div className="form-group">
//                   <label htmlFor="rate">תעריף</label>
//                   <input
//                     id="rate"
//                     type="number"
//                     className="form-control"
//                     value={rate}
//                     onChange={(e) => setRate(e.target.valueAsNumber || '')}
//                     required
//                   />
//                 </div>

//                 <div className="form-group">
//                   <label htmlFor="rateIncrease">העלאת תעריף</label>
//                   <input
//                     id="rateIncrease"
//                     type="number"
//                     className="form-control"
//                     value={rateIncrease}
//                     onChange={(e) => setRateIncrease(e.target.valueAsNumber || '')}
//                     required
//                   />
//                 </div>

//                 <button type="submit" className="btn btn-primary">שמור</button>
//               </form>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Setting;
import React, { useState, useEffect } from 'react';
import { saveSetting, getSetting } from '../../../services/setting.service';
import Enums from '../../../interfaces/enums';

const Setting: React.FC = () => {
  const [role, setRole] = useState<string>('');
  const [rate, setRate] = useState<number | ''>('');
  const [rateIncrease, setRateIncrease] = useState<number | ''>('');
  const [message, setMessage] = useState<string | null>(null);

  // פונקציה לקבלת ההגדרות עבור התפקיד הנבחר
  const fetchSettingForRole = async (role: string) => {
    try {
      const settings = await getSetting();
      const settingForRole = settings.find((setting: any) => setting.role === role);

      if (settingForRole) {
        setRate(settingForRole.rate);
        setRateIncrease(settingForRole.rateIncrease);
      } else {
        setRate('');
        setRateIncrease('');
      }
    } catch (error) {
      console.error('Error fetching settings for role:', error);
    }
  };

  // קרא את הפונקציה הזו כאשר התפקיד משתנה
  useEffect(() => {
    if (role) {
      fetchSettingForRole(role);
    }
  }, [role]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    try {
      const setting = {
        role,
        rate: Number(rate),
        rateIncrease: Number(rateIncrease),
      };

      await saveSetting(setting);
      setMessage('ההגדרות נשמרו בהצלחה!!');

      // אפס את השדות
      setRole('');
      setRate('');
      setRateIncrease('');
    } catch (error) {
      setMessage('שגיאה בשמירת ההגדרות.');
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-12">
          <div className="card">
            <div className="card-header text-center">
              <h2>הגדרות</h2>
            </div>
            <div className="container mt-5">

              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label htmlFor="role">תפקיד</label>
                  <select
                    id="role"
                    className="form-control"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    required
                  >
                    <option value="">בחר תפקיד</option>
                    {Object.values(Enums.ReportRole).map((role) => (
                      <option key={role} value={role}>
                        {role}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="rate">תעריף</label>
                  <input
                    id="rate"
                    type="number"
                    className="form-control"
                    value={rate}
                    onChange={(e) => setRate(e.target.valueAsNumber || '')}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="rateIncrease">העלאת תעריף</label>
                  <input
                    id="rateIncrease"
                    type="number"
                    className="form-control"
                    value={rateIncrease}
                    onChange={(e) => setRateIncrease(e.target.valueAsNumber || '')}
                    required
                  />
                </div>

                <button type="submit" className="btn btn-primary">שמור</button>

                {message && <p>{message}</p>}

              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Setting;
