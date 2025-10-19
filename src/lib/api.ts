import axios from 'axios';
import { config } from './config';

export const api = axios.create({ baseURL: config.gatewayHttpUrl });

api.interceptors.request.use((req) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('gateway_jwt');
    if (token) req.headers = { ...(req.headers || {}), Authorization: `Bearer ${token}` };
  }
  return req;
});


