declare class AuthAPI {
    login: (username: string, password: string) => Promise<any>;
}
export declare const authAPI: AuthAPI;
export {};
