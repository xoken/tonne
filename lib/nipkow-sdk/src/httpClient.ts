import https from 'https';
import axios, { AxiosRequestConfig } from 'axios';

const httpReq = axios.create({
  baseURL: 'https://127.0.0.1:9091/v1/',
  httpsAgent: new https.Agent({
    rejectUnauthorized: false,
  }),
  headers: {
    'Content-Type': 'application/json',
  },
});

export const get = async (url: string, params?: AxiosRequestConfig) => {
  try {
    const response = await httpReq.get(url, params);
    console.log(response);
    return response;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const post = async (url: string, data: AxiosRequestConfig) => {
  try {
    const response = await httpReq.post(url, data.data);
    console.log(response);
    return response;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const put = async (url: string, data: AxiosRequestConfig) => {
  try {
    const response = await httpReq.put(url, data);
    console.log(response);
    return response;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const deleteR = async (url: string, data?: AxiosRequestConfig) => {
  try {
    const response = await httpReq.delete(url, data);
    console.log(response);
    return response;
  } catch (error) {
    console.log(error);
    throw error;
  }
};