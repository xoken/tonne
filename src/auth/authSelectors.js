import { createSelector } from 'reselect';

export const getAuth = state => state.auth;

export const getProfile = createSelector([getAuth], ({ profile }) => profile);

export const getProfiles = createSelector([getAuth], ({ profiles }) => profiles);

export const isLoading = createSelector([getAuth], ({ isLoading }) => isLoading);

export const getMnemonic = createSelector([getAuth], ({ bip39Mnemonic }) => bip39Mnemonic);

export const isAuthenticated = createSelector([getAuth], ({ profile }) => {
  return Boolean(profile);
});
