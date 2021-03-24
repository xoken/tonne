import { createSelector } from 'reselect';

const getMail = state => state.mail;

export const isLoadingMailTransactions = createSelector(
  [getMail],
  ({ isLoadingMailTransactions }) => isLoadingMailTransactions
);

export const getMailTransactions = createSelector(
  [getMail],
  ({ mailTransactions }) => mailTransactions
);

export const getReadMailsList = createSelector([getMail], ({ readMailsList }) => readMailsList);
