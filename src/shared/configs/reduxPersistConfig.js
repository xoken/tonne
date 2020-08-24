import storage from 'redux-persist/lib/storage';
import { createTransform } from 'redux-persist';
import StoreEncryptor from '../encryption/storeEncryptor';

const encryptor = createTransform(
  (inboundState) => {
    return StoreEncryptor.encrypt(inboundState);
  },
  (outboundState) => {
    return StoreEncryptor.decrypt(outboundState);
  },
  { blacklist: [] }
);

const REDUX_PERSIST = {
  active: true,
  storeConfig: {
    key: 'primary',
    transforms: [encryptor],
    storage: storage,
    whitelist: ['wallet'],
    debug: process.env.NODE_ENV === 'development',
  },
};

export default REDUX_PERSIST;
