import { createReducer } from 'redux-act';
import * as actions from './mailActions';

const INITIAL_STATE = {
  mailTransactions: [],
  nextTransactionCursor: null,
  isLoadingMailTransactions: false,
  sentMailTransactions: [],
};

export default createReducer(
  {
    [actions.createMailTransactionSuccess]: (state, { transactions }) => ({
      ...state,
      sentMailTransactions: [...transactions, ...state.sentMailTransactions],
      isLoadingMailTransactions: false,
    }),
    [actions.getMailTransactionsSuccess]: (state, { mailTransactions, nextTransactionCursor }) => ({
      ...state,
      mailTransactions: [...mailTransactions, ...state.mailTransactions],
      nextTransactionCursor:
        nextTransactionCursor !== undefined ? nextTransactionCursor : state.nextTransactionCursor,
      isLoadingMailTransactions: false,
    }),
    [actions.getDiffMailTransactionsSuccess]: (state, { mailTransactions }) => ({
      ...state,
      mailTransactions: [...mailTransactions, ...state.mailTransactions],
      isLoadingMailTransactions: false,
    }),
  },
  INITIAL_STATE
);
