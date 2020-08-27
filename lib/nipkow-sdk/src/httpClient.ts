import https from 'https';
import axios, { AxiosRequestConfig } from 'axios';

const httpReq = axios.create({
  baseURL: 'https://sb1.xoken.org:9091/v1',
  // baseURL: 'https://127.0.0.1:9091/v1',
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
    // const token =
    //   '417e8a04495b2974b19f726c7a9213d1e6e6bf69442789649177c5f1c215e4cf';
    const token =
      '29725256988c1c1eba484eb390b84ce637ac13118c22295f0cc48e38f763bb59';
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
