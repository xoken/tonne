import https from 'https';
import axios, { AxiosRequestConfig } from 'axios';

const httpReq = axios.create({
  baseURL: 'https://sb1.xoken.org:9091/v1',
  httpsAgent: new https.Agent({
    rejectUnauthorized: false,
  }),
  headers: {
    'Content-Type': 'application/json',
  },
});

httpReq.interceptors.request.use(
  config => {
    // const token = localStorage.getItem('token');
    const token =
      '1af1be1ed8433b50f23089af2d3c308c10cbd07fb5181fab8eb54c5421d77778';
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
