import { createSelector } from 'reselect';

export const getAuth = state => state.auth;
export const getWallet = state => state.wallet;

export const isLoading = createSelector([getAuth], ({ isLoading }) => isLoading);

export const getMnemonic = createSelector([getAuth], ({ bip39Mnemonic }) => bip39Mnemonic);

export const isAuthenticated = createSelector([getWallet], ({ isSessionValid }) => {
  return isSessionValid;
});
