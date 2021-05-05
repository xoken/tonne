import { createReducer } from 'redux-act';
import * as actions from './mailActions';
import * as authActions from '../auth/authActions';

const INITIAL_STATE = {
  mailTransactions: [],
  nextTransactionCursor: null,
  isLoadingMailTransactions: false,
};

function updateExistingThreadIdValue(newMailTx, existingMailTxs) {
  let tempExistingMailTx = existingMailTxs;

  for (let i = 0; i < existingMailTxs.length; i++) {
    for (let k = newMailTx.length - 1; k >= 0; k--) {
      if (existingMailTxs[i][0].threadId === newMailTx[k][0].threadId) {
        tempExistingMailTx[i] = [...newMailTx[k], ...tempExistingMailTx[i]];
        tempExistingMailTx.unshift(tempExistingMailTx[i]);
        tempExistingMailTx.splice(i + 1, 1);
      }
    }
  }

  return tempExistingMailTx;
}

function diffMailTransactions(newMailTransactions, existingMailTransactions) {
  for (let i = 0; i < newMailTransactions.length; i++) {
    if (
      existingMailTransactions.find(mTxs =>
        mTxs.find(mTx => mTx.threadId === newMailTransactions[i][0].threadId)
      )
    ) {
      return updateExistingThreadIdValue(newMailTransactions, existingMailTransactions);
    } else {
      return [...newMailTransactions, ...existingMailTransactions];
    }
  }
}

function updateMailTransaction(updatedtransaction, mailTransactions) {
  let tempMailTransactions = mailTransactions;
  mailTransactions.forEach((mTxs, i) => {
    mTxs.forEach((mTx, index) => {
      if (mTx.txId === updatedtransaction.txId) {
        tempMailTransactions[i][index] = updatedtransaction;
      }
    });
  });

  return tempMailTransactions;
}

export default createReducer(
  {
    [actions.createMailTransactionRequest]: state => ({
      ...state,
    }),
    [actions.createMailTransactionSuccess]: (
      state,
      { mailTransactions, nextTransactionCursor }
    ) => ({
      ...state,
      nextTransactionCursor: nextTransactionCursor || state.nextTransactionCursor,
      mailTransactions: state.mailTransactions.find(mTxs =>
        mTxs.find(mTx => mTx.threadId === mailTransactions[0][0].threadId)
      )
        ? updateExistingThreadIdValue(mailTransactions, state.mailTransactions)
        : [...mailTransactions, ...state.mailTransactions],
    }),
    [actions.getMailTransactionsRequest]: state => ({
      ...state,
      isLoadingMailTransactions: true,
    }),
    [actions.getMailTransactionsSuccess]: (state, { mailTransactions, nextTransactionCursor }) => ({
      ...state,
      mailTransactions: [...mailTransactions],
      nextTransactionCursor: nextTransactionCursor || state.nextTransactionCursor,
      isLoadingMailTransactions: false,
    }),
    [actions.getDiffMailTransactionsSuccess]: (
      state,
      { mailTransactions, nextTransactionCursor }
    ) => ({
      ...state,
      mailTransactions: diffMailTransactions(mailTransactions, state.mailTransactions),
      nextTransactionCursor: nextTransactionCursor || state.nextTransactionCursor,
      isLoadingMailTransactions: false,
    }),
    [actions.getMailTransactionsFailure]: state => ({
      ...state,
      isLoadingMailTransactions: false,
    }),
    [actions.updateTransactionSuccess]: (state, updatedTransaction) => ({
      ...state,
      mailTransactions: updateMailTransaction(updatedTransaction, state.mailTransactions),
    }),
    [actions.createMailTransactionFailure]: state => ({
      ...state,
      isLoadingMailTransactions: false,
    }),
    [authActions.logoutSuccess]: state => ({
      ...INITIAL_STATE,
    }),
  },
  INITIAL_STATE
);
