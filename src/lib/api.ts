import axios, { AxiosHeaders } from 'axios';
import { config } from './config';

export const api = axios.create({ baseURL: config.gatewayHttpUrl });

api.interceptors.request.use((req) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('gateway_jwt');
    if (token) {
      const headers = req.headers ? AxiosHeaders.from(req.headers) : new AxiosHeaders();
      headers.set('Authorization', `Bearer ${token}`);
      req.headers = headers;
    }
  }
  return req;
});


