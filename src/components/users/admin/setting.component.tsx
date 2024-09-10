// import React from 'react';

// const Setting: React.FC = () => {
//   return (
//     <div className="container mt-5">
//       <h1>אין הגדרות כרגע</h1>
//     </div>
//   );
// };

// export default Setting;

import React, { useState } from 'react';
import { saveSetting } from '../../../services/setting.service';

// Enum לתפקידים
const ReportRole = Object.freeze({
  BIKORET: 'ביקורת',
  FIX_BIKORET: 'תיקוני ביקרות',
  HGAA: 'הגהה'
});

const Setting: React.FC = () => {
  const [role, setRole] = useState<string>('');
  const [rate, setRate] = useState<number | ''>('');
  const [rateIncrease, setRateIncrease] = useState<number | ''>('');
  const [message, setMessage] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    
    try {
      const setting = {
        role,
        rate: Number(rate),
        rateIncrease: Number(rateIncrease),
      };

      await saveSetting(setting);
      setMessage('Setting saved successfully!');
    } catch (error) {
      setMessage('Error saving setting');
    }
  };

  return (
    <div className="container mt-5">
      <h1>הגדרות</h1>
      {message && <p>{message}</p>}
     
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
            {Object.values(ReportRole).map((role) => (
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
      </form>
    </div>
  );
};

export default Setting;

