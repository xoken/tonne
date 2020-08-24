import { combineReducers } from 'redux';
import wallet from '../../wallet';
import storage from 'redux-persist/lib/storage';
import { persistReducer } from 'redux-persist';

const walletPersistConfig = {
  key: 'wallet',
  storage: storage,
  whitelist: ['bip39Mnemonic'],
};

const appReducer = combineReducers({
  wallet: persistReducer(walletPersistConfig, wallet.reducer),
});

export default (state, action) => {
  return appReducer(state, action);
};
