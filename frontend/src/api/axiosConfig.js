import axios from 'axios';

const api = axios.create({
    // Replace this URL with your actual Railway Backend URL
    baseURL: 'https://hotelbooking-production-9fc9.up.railway.app/api',
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default api;