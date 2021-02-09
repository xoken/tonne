import { createSelector } from 'reselect';

export const getWallet = state => state.wallet;

export const isLoadingTransactions = createSelector(
  [getWallet],
  ({ isLoadingTransactions }) => isLoadingTransactions
);

export const isLoadingAddresses = createSelector(
  [getWallet],
  ({ isLoadingAddresses }) => isLoadingAddresses
);

export const getBalance = createSelector([getWallet], ({ balance }) => balance);

export const getTransactions = createSelector([getWallet], ({ transactions }) => transactions);
