import { createSelector } from 'reselect';

export const getWallet = state => state.wallet;

export const isLoading = createSelector([getWallet], ({ isLoading }) => isLoading);

export const getBalance = createSelector([getWallet], ({ balance }) => balance);

export const getTransactions = createSelector([getWallet], ({ transactions }) => transactions);

export const getTransaction = createSelector([getWallet], ({ txoutputs }) => txoutputs);
