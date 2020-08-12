import { createSelector } from 'reselect';

export const getWallet = (state) => state.wallet;

export const isLoading = createSelector(
  [getWallet],
  ({ isLoading }) => isLoading
);

export const getMnemonic = createSelector(
  [getWallet],
  ({ bip39Mnemonic }) => bip39Mnemonic
);

export const getCurrentBalance = createSelector(
  [getWallet],
  ({ currentBalance }) => currentBalance
);
