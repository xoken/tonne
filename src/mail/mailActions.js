import { createAction } from 'redux-act';
import * as walletActions from '../wallet/walletActions';
import MailService from './mailService';

export const createMailTransactionRequest = createAction('CREATE_MAIL_TRANSACTION_REQUEST');
export const createMailTransactionSuccess = createAction('CREATE_MAIL_TRANSACTION_SUCCESS');
export const createMailTransactionFailure = createAction('CREATE_MAIL_TRANSACTION_FAILURE');

export const getMailTransactionsRequest = createAction('GET_MAIL_TRANSACTIONS_REQUEST');
export const getMailTransactionsSuccess = createAction('GET_MAIL_TRANSACTIONS_SUCCESS');
export const getMailTransactionsFailure = createAction('GET_MAIL_TRANSACTIONS_FAILURE');

export const getDiffMailTransactionsSuccess = createAction('GET_MAIL_TRANSACTIONS_DIFF_SUCCESS');

export const createMailTransaction = args => async (dispatch, getState, { serviceInjector }) => {
  dispatch(createMailTransactionRequest());
  try {
    const { transactions } = await serviceInjector(MailService).createMailTransaction(args);
    dispatch(createMailTransactionSuccess({ transactions }));
  } catch (error) {
    dispatch(createMailTransactionFailure());
    throw error;
  }
};

export const getMailTransactions = options => async (dispatch, getState, { serviceInjector }) => {
  try {
    const {
      mail: { nextTransactionCursor: startkey, isLoadingMailTransactions },
    } = getState();
    if (!isLoadingMailTransactions) {
      dispatch(getMailTransactionsRequest());
      if (startkey) {
        options.startkey = startkey;
      }
      if (options.diff) {
        const { mailTransactions, nextTransactionCursor } = await serviceInjector(
          MailService
        ).getMailTransactions(options);
        await dispatch(walletActions.getAllpayHandles());
        await dispatch(walletActions.getUnregisteredNames());
        dispatch(getDiffMailTransactionsSuccess({ mailTransactions, nextTransactionCursor }));
      } else {
        const { mailTransactions } = await serviceInjector(MailService).getMailTransactions(
          options
        );
        await dispatch(walletActions.getAllpayHandles());
        await dispatch(walletActions.getUnregisteredNames());
        dispatch(getMailTransactionsSuccess({ mailTransactions }));
      }
    }
  } catch (error) {
    dispatch(getMailTransactionsFailure());
    throw error;
  }
};
