import StoreEncryptor from '../../encryption/storeEncryptor';
import { REHYDRATE } from 'redux-persist';
let encryptedData = null;

export const encryptionMiddleware = (store) => (next) => (action) => {
  if (action.type === REHYDRATE) {
    // debugger;
  }

  if (action.type === '') {
    StoreEncryptor.setEncryptionKey(action.payload.storageEncryptionKey);
    if (encryptedData) {
      debugger;
      // store.dispatch(rehydrateData(StoreEncryptor.decrypt(encryptedData)));
    }
  }
  return next(action);
};
