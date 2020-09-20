import https from 'https';
import axios, { AxiosRequestConfig } from 'axios';

const httpReq = axios.create({
  baseURL:
    'https://' +
    localStorage.getItem('hostname') +
    ':' +
    localStorage.getItem('port') +
    '/v1',
  httpsAgent: new https.Agent({
    rejectUnauthorized: false,
  }),
  headers: {
    'Content-Type': 'application/json',
  },
});

httpReq.interceptors.request.use(
  config => {
    const token =
      '53c35e7737f71253cd759ebfe64ffcd45dd445363602e8f4e71cc4aea9ddf76b';
    // const token = localStorage.getItem('sessionkey');
    config.headers.Authorization = token ? `Bearer ${token}` : '';
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

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
