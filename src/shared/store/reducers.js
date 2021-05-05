import { combineReducers } from 'redux';
// import { persistReducer } from 'redux-persist';
// import storage from 'redux-persist/lib/storage';
import auth from '../../auth/authReducer';
import claimTwitterHandle from '../../claimTwitterHandle';
import wallet from '../../wallet';
import allpay from '../../allpay';
import settings from '../../settings';
import mail from '../../mail';

// const walletPersistConfig = {
//   key: 'wallet',
//   storage: storage,
//   whitelist: ['bip39Mnemonic'],
// };

const appReducer = combineReducers({
  auth,
  twitter: claimTwitterHandle.reducer,
  wallet: wallet.reducer,
  allpay: allpay.reducer,
  settings: settings.reducer,
  mail: mail.reducer,
});

export default (state, action) => {
  return appReducer(state, action);
};
