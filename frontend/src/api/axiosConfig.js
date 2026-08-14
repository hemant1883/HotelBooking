import axios from 'axios';

const api = axios.create({
    // Replace this URL with your actual Railway Backend URL
   baseURL: 'https://hotelbooking-lhsr.onrender.com',
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default api;
