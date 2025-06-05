// src/services/api.js

import axios from 'axios';

// Configuração da baseURL de forma dinâmica
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || './api/v1',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Interceptor para requisições (debug)
api.interceptors.request.use(
  request => {
    console.log(`➡️ [Request] ${request.method?.toUpperCase()} ${request.url}`, request);
    return request;
  },
  error => {
    console.error('❌ [Request Error]', error);
    return Promise.reject(error);
  }
);

// Interceptor para respostas (debug)
api.interceptors.response.use(
  response => {
    console.log(`✅ [Response] ${response.status} ${response.config.url}`, response);
    return response;
  },
  error => {
    if (error.response) {
      console.error(`❌ [Response Error] ${error.response.status} ${error.response.config.url}`, error.response);
    } else {
      console.error('❌ [Network Error]', error);
    }
    return Promise.reject(error);
  }
);

export default api;
