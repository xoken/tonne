import { createReducer } from 'redux-act';
import * as actions from './mailActions';
import * as authActions from '../auth/authActions';

const INITIAL_STATE = {
  mailTransactions: {},
  nextTransactionCursor: null,
  isLoadingMailTransactions: false,
};

function updateExistingThreadIdValue(newMailTx, existingMailTx) {
  let tempExistingMailTx = existingMailTx;
  let tempVal = Object.values(newMailTx)[0];
  tempExistingMailTx[Object.keys(newMailTx)[0]] = tempVal.concat(
    existingMailTx[Object.keys(newMailTx)[0]]
  );
  return tempExistingMailTx;
}

export default createReducer(
  {
    [actions.createMailTransactionRequest]: state => ({
      ...state,
      isLoadingMailTransactions: true,
    }),
    [actions.createMailTransactionSuccess]: (state, { mailTransactions }) => ({
      ...state,
      mailTransactions: Object.keys(state.mailTransactions).includes(
        Object.keys(mailTransactions)[0]
      )
        ? updateExistingThreadIdValue(mailTransactions, state.mailTransactions)
        : { ...mailTransactions, ...state.mailTransactions },
      isLoadingMailTransactions: false,
    }),
    [actions.getMailTransactionsRequest]: state => ({
      ...state,
      isLoadingMailTransactions: true,
    }),
    [actions.getMailTransactionsSuccess]: (state, { mailTransactions, nextTransactionCursor }) => ({
      ...state,
      mailTransactions: { ...mailTransactions },
      nextTransactionCursor:
        nextTransactionCursor !== undefined ? nextTransactionCursor : state.nextTransactionCursor,
      isLoadingMailTransactions: false,
    }),
    [actions.getDiffMailTransactionsSuccess]: (state, { mailTransactions }) => ({
      ...state,
      mailTransactions: { ...mailTransactions, ...state.mailTransactions },
      isLoadingMailTransactions: false,
    }),
    [authActions.logoutSuccess]: state => ({
      ...INITIAL_STATE,
    }),
  },
  INITIAL_STATE
);
