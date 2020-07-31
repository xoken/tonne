import { post } from './httpClient';

export class AuthAPI {
  login = async (username: string, password: string) => {
    try {
      const { data } = await post('auth', { username, password });
      return data;
    } catch (error) {
      throw error;
    }
  };
}
