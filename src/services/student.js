import axios from 'axios';

const API_URL_CREATE = process.env.REACT_APP_URL_CREATE;
const API_URL_UPDATE = process.env.REACT_APP_URL_UPDATE;
const API_URL_GET = process.env.REACT_APP_URL_GET;
const API_URL_DELETE = process.env.REACT_APP_URL_DELETE;
const API_URL_UPLOAD= process.env.REACT_APP_URL_UPLOAD_IMG;

const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    };
  };

export const fetchData = async () => {
    try {
        const response = await axios.get(API_URL_GET, getAuthHeaders());
        return response.data;
    } catch (error) {
        console.error('Error fetching data:', error);
        throw error;
    }
};

export const createData = async (data) => {
    try {
        const response = await axios.post(`${API_URL_CREATE}`, data, getAuthHeaders());
        return response.data;
    } catch (error) {
        console.error('Error creating data:', error);
        throw error;
    }
};

export const updateData = async (id, data) => {
    try {
        const response = await axios.put(`${API_URL_UPDATE}/${id}`, data, getAuthHeaders());
        return response.data;
    } catch (error) {
        console.error('Error updating data:', error);
        throw error;
    }
};

export const deleteData = async (id) => {
    try {
        await axios.delete(`${API_URL_DELETE}/${id}`, getAuthHeaders());
    } catch (error) {
        console.error('Error deleting data:', error);
        throw error;
    }
};

export const uploadImage = async (id, base64Image) => {
    try {
        const response = await axios.post(`${API_URL_UPLOAD}/${id}/upload`, {
            image: base64Image
        }, getAuthHeaders());
        return response.data.imageUrl; 
    } catch (error) {
        console.error('Error uploading image:', error);
        throw error;
    }
};