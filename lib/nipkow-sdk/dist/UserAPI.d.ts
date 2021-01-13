declare class UserAPI {
    addUser: (username: string, firstName: string, lastName: string, email: string) => Promise<any>;
    getUser: (username: string) => Promise<any>;
    getCurrentUser: () => Promise<any>;
    updateUser: (username: string, password: string, firstName: string, lastName: string, email: string, apiQuota: number, apiExpiryTime: Date) => Promise<any>;
    deleteUser: (username: string) => Promise<any>;
}
export declare const userAPI: UserAPI;
export {};
