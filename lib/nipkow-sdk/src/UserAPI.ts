import { get, post, put, deleteR } from './httpClient';

export class UserAPI {
  addUser = async (
    username: string,
    firstName: string,
    lastName: string,
    email: string
  ) => {
    try {
      const { data } = await post('/user', {
        data: { username, firstName, lastName, email },
      });
      return data;
    } catch (error) {
      throw error;
    }
  };

  getUser = async (username: string) => {
    try {
      const { data } = await get(`/user/${username}`);
      return data;
    } catch (error) {
      throw error;
    }
  };

  getCurrentUser = async () => {
    try {
      const { data } = await get('/user');
      return data;
    } catch (error) {
      throw error;
    }
  };

  updateUser = async (
    username: string,
    password: string,
    firstName: string,
    lastName: string,
    email: string,
    apiQuota: number,
    apiExpiryTime: Date
  ) => {
    try {
      const { data } = await put(`/user/${username}`, {
        data: {
          password,
          firstName,
          lastName,
          email,
          apiQuota,
          apiExpiryTime: apiExpiryTime.getUTCDate(),
        },
      });
      return data;
    } catch (error) {
      throw error;
    }
  };

  deleteUser = async (username: string) => {
    try {
      const { data } = await deleteR(`/user/${username}`);
      return data;
    } catch (error) {
      throw error;
    }
  };
}
