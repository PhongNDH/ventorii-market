import { getItemLocalStorage } from '@/utils/localStorage';
import axios from 'axios';

export const axiosClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BE_URL,
  timeout: 20000,
  headers: {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
  },
});

// request interceptor
export const requestInterceptorToken = axiosClient.interceptors.request.use(
  (config) => {
    config.headers.Authorization = getItemLocalStorage('token')
      ? `Bearer ${getItemLocalStorage('token')}`
      : undefined;
    return config;
  },
  (error) => {
    // eslint-disable-next-line no-undef
    return Promise.reject(error);
  }
);
