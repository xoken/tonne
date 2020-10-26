import https from 'https';
import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import { authAPI } from './AuthAPI';

let httpReq: AxiosInstance;

export const init = (host: string, port: number) => {
  httpReq = axios.create({
    baseURL: `https://${host}:${port}/v1`,
    httpsAgent: new https.Agent({
      rejectUnauthorized: false,
    }),
    headers: {
      'Content-Type': 'application/json',
    },
  });
  httpReq.interceptors.request.use(
    config => {
      const token = localStorage.getItem('sessionKey');
      config.headers.Authorization = token ? `Bearer ${token}` : '';
      return config;
    },
    error => {
      console.log(error);
      return Promise.reject(error);
    }
  );
  httpReq.interceptors.response.use(
    response => {
      return response;
    },
    async error => {
      if (error.response.status !== 403) {
        return new Promise((resolve, reject) => {
          reject(error);
        });
      }
      try {
        const userName: string = localStorage.getItem('userName')!;
        const password: string = localStorage.getItem('password')!;
        const {
          auth: { sessionKey, callsRemaining },
        } = await authAPI.login(userName, password);
        if (sessionKey) {
          localStorage.setItem('sessionKey', sessionKey);
          Promise.resolve();
        } else {
          throw new Error('Invalid sessionKey');
        }
      } catch (error) {
        return Promise.reject(error);
      }
    }
  );
};

export const get = async (url: string, config?: AxiosRequestConfig) => {
  try {
    const response = await httpReq.get(url, config);
    return response;
  } catch (error) {
    throw error;
  }
};

export const post = async (
  url: string,
  data?: any,
  config?: AxiosRequestConfig
) => {
  try {
    const response = await httpReq.post(url, data, config);
    return response;
  } catch (error) {
    throw error;
  }
};

export const put = async (
  url: string,
  data?: any,
  config?: AxiosRequestConfig
) => {
  try {
    const response = await httpReq.put(url, data, config);
    return response;
  } catch (error) {
    throw error;
  }
};

export const deleteR = async (url: string, config?: AxiosRequestConfig) => {
  try {
    const response = await httpReq.delete(url, config);
    return response;
  } catch (error) {
    throw error;
  }
};
