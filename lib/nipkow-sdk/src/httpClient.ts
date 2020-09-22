import https from 'https';
import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';

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
};

export const get = async (url: string, config?: AxiosRequestConfig) => {
  try {
    const response = await httpReq.get(url, config);
    console.log(response);
    return response;
  } catch (error) {
    console.log(error);
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
    console.log(response);
    return response;
  } catch (error) {
    console.log(error);
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
    console.log(response);
    return response;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const deleteR = async (url: string, config?: AxiosRequestConfig) => {
  try {
    const response = await httpReq.delete(url, config);
    console.log(response);
    return response;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
