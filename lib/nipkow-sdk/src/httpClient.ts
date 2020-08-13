import https from 'https';
import axios, { AxiosRequestConfig } from 'axios';

const httpReq = axios.create({
  // baseURL:
  //   'https://' +
  //   localStorage.getItem('hostname') +
  //   ':' +
  //   localStorage.getItem('port') +
  //   '/v1',
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
      '8bf23a8b224b4d5a3a4f158aa1e495fcbbb35d1c64b3cc0acc6abfcd7e4e5907';
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
