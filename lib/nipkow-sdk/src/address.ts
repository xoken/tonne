import { get } from './httpClient';

export const getOutputsByAddress = async (
  address: string,
  pagesize?: number
) => {
  try {
    const { data } = await get(`address/${address}/outputs/`, {
      params: { pagesize: pagesize?.toString() },
    });
    return data;
  } catch (error) {
    throw error;
  }
};

export const getOut = async (username: string) => {
  try {
    const { data } = await get(`/user/${username}`);
    return data;
  } catch (error) {
    throw error;
  }
};
