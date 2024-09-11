import axios from "axios";

const API_URL = 'http://localhost:3000/api/setting';

export const saveSetting = async (setting: any) => {
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(setting)
    });
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return await response.json();
  } catch (error) {
    console.error('Error saving setting:', error);
    throw error;
  }

};

export const getSetting = async () => {
  try {
    const response = await axios.get(`${API_URL}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`, // שליחת הטוקן עם הבקשה
      },
    });
    return response.data;
  } catch (error: any) {
    console.error('Error getting settings:', error.response ? error.response.data : error.message);
    throw error;
  }
}


