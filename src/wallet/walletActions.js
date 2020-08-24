import { createAction } from 'redux-act';
import WalletService from './walletService';

export const loginRequest = createAction('LOGIN_REQUEST');
export const loginSuccess = createAction('LOGIN_SUCCESS');
export const loginFailure = createAction('LOGIN_FAILURE');

export const generateMnemonicRequest = createAction(
  'GENERATE_MNEMONIC_REQUEST'
);
export const generateMnemonicSuccess = createAction(
  'GENERATE_MNEMONIC_SUCCESS'
);
export const generateMnemonicFailure = createAction(
  'GENERATE_MNEMONIC_FAILURE'
);

export const setPassPhraseRequest = createAction('SET_PASS_PHRASE_REQUEST');
export const setPassPhraseSuccess = createAction('SET_PASS_PHRASE_SUCCESS');
export const setPassPhraseFailure = createAction('SET_PASS_PHRASE_FAILURE');

export const initWalletRequest = createAction('INIT_WALLET_REQUEST');
export const initWalletSuccess = createAction('INIT_WALLET_SUCCESS');
export const initWalletFailure = createAction('INIT_WALLET_FAILURE');

export const getCurrentBalanceRequest = createAction(
  'GET_CURRENT_BALANCE_REQUEST'
);
export const getCurrentBalanceSuccess = createAction(
  'GET_CURRENT_BALANCE_SUCCESS'
);
export const getCurrentBalanceFailure = createAction(
  'GET_CURRENT_BALANCE_FAILURE'
);

export const getTransactionRequest = createAction('GET_TRANSACTION_REQUEST');
export const getTransactionSuccess = createAction('GET_TRANSACTION_SUCCESS');
export const getTransactionFailure = createAction('GET_TRANSACTION_FAILURE');

export const createSendTransactionRequest = createAction(
  'CREATE_SEND_TRANSACTION_REQUEST'
);
export const createSendTransactionSuccess = createAction(
  'CREATE_SEND_TRANSACTION_SUCCESS'
);
export const createSendTransactionFailure = createAction(
  'CREATE_SEND_TRANSACTION_FAILURE'
);

export const generateMnemonic = () => (
  dispatch,
  getState,
  { serviceInjector }
) => {
  dispatch(generateMnemonicRequest());
  try {
    const bip39Mnemonic = serviceInjector(WalletService).generateMnemonic();
    dispatch(generateMnemonicSuccess({ bip39Mnemonic }));
  } catch (error) {
    dispatch(generateMnemonicFailure());
    throw error;
  }
};

export const setPassPhrase = (bip39Passphrase) => (
  dispatch,
  getState,
  { serviceInjector }
) => {
  dispatch(setPassPhraseRequest());
  try {
    dispatch(setPassPhraseSuccess({ bip39Passphrase }));
    const {
      wallet: { bip39Mnemonic },
    } = getState();
    dispatch(initWallet(bip39Mnemonic, bip39Passphrase));
  } catch (error) {
    dispatch(setPassPhraseFailure());
    throw error;
  }
};

export const initWallet = (bip39Mnemonic, bip39Passphrase) => (
  dispatch,
  getState,
  { serviceInjector }
) => {
  dispatch(initWalletRequest());
  try {
    const response = serviceInjector(WalletService).initWallet(
      bip39Mnemonic,
      bip39Passphrase
    );
    dispatch(initWalletSuccess(response));
  } catch (error) {
    console.log(error);
    dispatch(initWalletFailure());
  }
};

export const getCurrentBalance = () => async (
  dispatch,
  getState,
  { serviceInjector }
) => {
  dispatch(getCurrentBalanceRequest());
  try {
    const response = await serviceInjector(WalletService).getCurrentBalance();
    dispatch(getCurrentBalanceSuccess(response));
    dispatch(getTransactions());
  } catch (error) {
    console.log(error);
    dispatch(getTransactions());
    dispatch(getCurrentBalanceFailure());
  }
};

export const createSendTransaction = (
  receiverAddress,
  amountInSatoshi,
  transactionFee
) => async (dispatch, getState, { serviceInjector }) => {
  dispatch(createSendTransactionRequest());
  try {
    const response = await serviceInjector(WalletService).createSendTransaction(
      receiverAddress,
      amountInSatoshi,
      transactionFee
    );
    dispatch(createSendTransactionSuccess(response));
  } catch (error) {
    dispatch(createSendTransactionFailure());
  }
};

export const loginWithPassphrase = (passphrase) => async (
  dispatch,
  getState,
  { serviceInjector }
) => {
  const {
    wallet: { bip39Passphrase: existingPassphrase },
  } = getState();
  dispatch(loginRequest());
  try {
    const result = await serviceInjector(WalletService).login(
      passphrase,
      existingPassphrase
    );
    if (result) {
      dispatch(loginSuccess(result));
      return true;
    } else {
      dispatch(loginFailure());
      return false;
    }
  } catch (error) {
    dispatch(loginFailure());
  }
};

export const getTransactions = () => async (
  dispatch,
  getState,
  { serviceInjector }
) => {
  const {
    wallet: { outputs },
  } = getState();
  dispatch(getTransactionRequest());
  try {
    const transactions = await serviceInjector(WalletService).getTransactions(
      outputs
    );
    dispatch(getTransactionSuccess({ transactions }));
  } catch (error) {
    dispatch(getTransactionFailure());
  }
};
