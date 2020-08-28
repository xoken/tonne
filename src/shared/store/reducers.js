import { combineReducers } from 'redux';
// import { persistReducer } from 'redux-persist';
// import storage from 'redux-persist/lib/storage';
import auth from '../../auth/authReducer';
import wallet from '../../wallet';

// const walletPersistConfig = {
//   key: 'wallet',
//   storage: storage,
//   whitelist: ['bip39Mnemonic'],
// };

const appReducer = combineReducers({
  auth,
  wallet: wallet.reducer,
});

export default (state, action) => {
  return appReducer(state, action);
};
