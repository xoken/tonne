import { createReducer } from 'redux-act';
import * as actions from './mailActions';
import * as authActions from '../auth/authActions';

const INITIAL_STATE = {
  mailTransactions: {},
  nextTransactionCursor: null,
  isLoadingMailTransactions: false,
};

function updateExistingThreadIdValue(newMailTx, existingMailTx) {
  let tempExistingMailTx = existingMailTx,
    existingThreadArray = existingMailTx[Object.keys(newMailTx)[0]];
  let tempVal = Object.values(newMailTx)[0];
  let updatedNewObject = {};
  delete tempExistingMailTx[Object.keys(newMailTx)[0]];
  updatedNewObject[Object.keys(newMailTx)[0]] = Object.values(newMailTx)[0].concat(
    existingThreadArray
  );
  return { ...updatedNewObject, ...tempExistingMailTx };
}

function updateMailTransaction(updatedtransaction, mailTransactions) {
  let tempMailTransactions = mailTransactions;
  Object.values(tempMailTransactions[updatedtransaction.threadId]).map((transaction, index) => {
    if (transaction._id === updatedtransaction._id) {
      tempMailTransactions[updatedtransaction.threadId][index] = updatedtransaction;
    }
  });
  return tempMailTransactions;
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
    [actions.updateTransactionSuccess]: (state, updatedTransaction) => ({
      ...state,
      mailTransactions: updateMailTransaction(updatedTransaction, state.mailTransactions),
    }),
    [authActions.logoutSuccess]: state => ({
      ...INITIAL_STATE,
    }),
  },
  INITIAL_STATE
);
