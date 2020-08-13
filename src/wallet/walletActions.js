import { createAction } from "redux-act";
import WalletService from "./walletService";

export const initWalletRequest = createAction("INIT_WALLET_REQUEST");
export const initWalletSuccess = createAction("INIT_WALLET_SUCCESS");
export const initWalletFailure = createAction("INIT_WALLET_FAILURE");

export const getCurrentBalanceRequest = createAction(
  "GET_CURRENT_BALANCE_REQUEST"
);
export const getCurrentBalanceSuccess = createAction(
  "GET_CURRENT_BALANCE_SUCCESS"
);
export const getCurrentBalanceFailure = createAction(
  "GET_CURRENT_BALANCE_FAILURE"
);

export const getAllTxRequest = createAction("GET_ALL_TX_REQUEST");
export const getAllTxSuccess = createAction("GET_ALL_TX_SUCCESS");
export const getAllTxFailure = createAction("GET_ALL_TX_FAILURE");

export const initWallet = (bip39Mnemonic) => (
  dispatch,
  getState,
  { serviceInjector }
) => {
  dispatch(initWalletRequest());
  try {
    const info = serviceInjector(WalletService).initWallet(bip39Mnemonic);
    dispatch(initWalletSuccess(info));
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
    const balance = await serviceInjector(WalletService).getCurrentBalance();
    dispatch(getCurrentBalanceSuccess({ balance }));
  } catch (error) {
    dispatch(getCurrentBalanceFailure());
  }
};

export const getAllTx = () => async (
  dispatch,
  getState,
  { serviceInjector }
) => {
  dispatch(getAllTxRequest());
  try {
    const outputs = await serviceInjector(WalletService).getAllTx();
    dispatch(getAllTxSuccess({ outputs }));
  } catch (error) {
    dispatch(getAllTxFailure());
  }
};
