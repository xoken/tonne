import { get } from './httpClient';

export class ChainAPI {
  getChainInfo = async () => {
    try {
      const { data } = await get(`chain/info`);
      return data;
    } catch (error) {
      throw error;
    }
  };

  getBlockHeaders = async (startBlockHeight: number, pagesize?: number) => {
    try {
      const { data } = await get(`chain/headers`, {
        params: {
          startBlockHeight,
          pagesize,
        },
      });
      return data;
    } catch (error) {
      throw error;
    }
  };
}
