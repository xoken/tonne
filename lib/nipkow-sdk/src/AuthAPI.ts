import { post } from './httpClient';

class AuthAPI {
  login = async (username: string, password: string) => {
    try {
      const { data } = await post('auth', { username, password });
      return data;
    } catch (error) {
      throw error;
    }
  };
}

export const authAPI = new AuthAPI();
