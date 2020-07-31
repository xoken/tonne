import { get } from './httpClient';
import Qs from 'qs';

export class BlockAPI {
  getBlockByBlockHeight = async (height: number) => {
    try {
      const { data } = await get(`block/height/${height}`);
      return data;
    } catch (error) {
      throw error;
    }
  };

  getBlocksByBlockHeights = async (heights: number[]) => {
    try {
      const { data } = await get(`block/heights`, {
        params: {
          height: heights,
        },
        paramsSerializer: params =>
          Qs.stringify(params, { arrayFormat: 'repeat' }),
      });
      return data;
    } catch (error) {
      throw error;
    }
  };

  getBlockByBlockHash = async (blockHash: string) => {
    try {
      const { data } = await get(`block/hash/${blockHash}`);
      return data;
    } catch (error) {
      throw error;
    }
  };

  getBlocksByBlockHashes = async (blockHashes: string[]) => {
    try {
      const { data } = await get(`block/hashes`, {
        params: {
          hash: blockHashes,
        },
        paramsSerializer: params =>
          Qs.stringify(params, { arrayFormat: 'repeat' }),
      });
      return data;
    } catch (error) {
      throw error;
    }
  };

  getTXIDByHash = async (
    blockHash: string,
    pagenumber?: number,
    pagesize?: number
  ) => {
    try {
      const { data } = await get(`block/txids/${blockHash}`, {
        params: {
          pagenumber,
          pagesize,
        },
      });
      return data;
    } catch (error) {
      throw error;
    }
  };
}
