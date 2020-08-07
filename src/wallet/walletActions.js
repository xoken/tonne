import { createAction } from 'redux-act';
import WalletService from './walletService';

export const generateMnemonicRequest = createAction(
  'GENERATE_MNEMONIC_REQUEST'
);
export const generateMnemonicSuccess = createAction(
  'GENERATE_MNEMONIC_SUCCESS'
);
export const generateMnemonicFailure = createAction(
  'GENERATE_MNEMONIC_FAILURE'
);

export const generateMnemonic = () => (
  dispatch,
  getState,
  { serviceInjector }
) => {
  dispatch(generateMnemonicRequest());
  try {
    const mnemonic = serviceInjector(WalletService).generateMnemonic();
    dispatch(generateMnemonicSuccess({ mnemonic }));
  } catch (error) {
    dispatch(generateMnemonicFailure());
  }
};
