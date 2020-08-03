import { get } from './httpClient';

class MerkleBranchAPI {
  getMerkleBranchByTXID = async (txId: string) => {
    try {
      const { data } = await get(`merklebranch/${txId}`);
      return data;
    } catch (error) {
      throw error;
    }
  };
}

export const merkleBranchAPI = new MerkleBranchAPI();
