import https from 'https';
import axios, { AxiosRequestConfig } from 'axios';

const httpReq = axios.create({
  // baseURL: 'https://sb1.xoken.org:9091/v1',
  baseURL: 'https://127.0.0.1:9091/v1',
  httpsAgent: new https.Agent({
    rejectUnauthorized: false,
  }),
  headers: {
    'Content-Type': 'application/json',
  },
});

httpReq.interceptors.request.use(
  config => {
    // const token = localStorage.getItem('sessionkey');
    const token =
      'ac649384cb88ee651c1a2950b5407c182fc43335b106e7c994b6284575b734f8';
    config.headers.Authorization = token ? `Bearer ${token}` : '';
    return config;
  },
  error => {
    console.log(error);
    return Promise.reject(error);
  }
);

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
