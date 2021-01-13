import { AxiosRequestConfig } from 'axios';
export declare const init: (host: string, port: number) => void;
export declare const get: (url: string, config?: AxiosRequestConfig | undefined) => Promise<import("axios").AxiosResponse<any>>;
export declare const post: (url: string, data?: any, config?: AxiosRequestConfig | undefined) => Promise<import("axios").AxiosResponse<any>>;
export declare const put: (url: string, data?: any, config?: AxiosRequestConfig | undefined) => Promise<import("axios").AxiosResponse<any>>;
export declare const deleteR: (url: string, config?: AxiosRequestConfig | undefined) => Promise<import("axios").AxiosResponse<any>>;
