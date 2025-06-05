// /src/services/api.js
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000/api',
});

api.interceptors.response.use(
  response => response,
  error => {
    console.error('Erro global:', error.response);
    return Promise.reject(error);
  }
);

export default api;
