import axios from 'axios';

const API_URL_LOGIN = process.env.REACT_APP_URL_LOGIN;

export const loginUser = async (credentials) => {
  try {
    const response = await axios.post(API_URL_LOGIN, credentials, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    const token = response.data.token;
    localStorage.setItem('token', token);
    return response.data;
  } catch (error) {
    console.error('Error logging in:', error);
    throw error;
  }
};

export const logoutUser = () => {
  localStorage.removeItem('token');
};