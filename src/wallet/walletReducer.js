import { createReducer } from "redux-act";
import * as actions from "./walletActions";

const INITIAL_STATE = {
  // mnemonicLanguage: '',
  bip39Mnemonic: "",
  // bip39SplitMnemonic: [],
  // bip39Passphrase: '',
  bip39SeedHex: "",
  // coin: '',
  bip32RootKeyBase58: "",
  accountExtendedPrivateKey: "",
  accountExtendedPublicKey: "",
  // bip32DerivationPath: '',
  bip32ExtendedPrivateKey: "",
  bip32ExtendedPublicKey: "",
  derivedAddressess: [],
  isLoading: false,
  currentBalance: 0,
};

export default createReducer(
  {
    [actions.initWalletSuccess]: (state, payload) => ({
      ...state,
      bip39Mnemonic: payload.bip39Mnemonic,
      bip39SeedHex: payload.bip39SeedHex,
      bip32RootKeyBase58: payload.bip32RootKeyBase58,
      accountExtendedPrivateKey: payload.accountExtendedPrivateKey,
      accountExtendedPublicKey: payload.accountExtendedPublicKey,
      bip32ExtendedPrivateKey: payload.bip32ExtendedPrivateKey,
      bip32ExtendedPublicKey: payload.bip32ExtendedPublicKey,
      derivedAddressess: payload.derivedAddressess,
    }),
    [actions.getCurrentBalanceSuccess]: (state, payload) => ({
      ...state,
      currentBalance: payload.balance,
    }),
    [actions.getAllTxSuccess]: (state, payload) => ({
      ...state,
      allTx: payload.outputs,
    }),
  },
  INITIAL_STATE
);
