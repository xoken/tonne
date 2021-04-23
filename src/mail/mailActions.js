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

export const updateTransactionSuccess = createAction('UPDATE_TRANSACTION_SUCCESS');

export const createMailTransaction = args => async (dispatch, getState, { serviceInjector }) => {
  dispatch(createMailTransactionRequest());
  try {
    const { transactions } = await serviceInjector(MailService).createMailTransaction(args);
    const mailTransactions = transactions
      .filter(transaction => {
        if (transaction.additionalInfo && transaction.additionalInfo.type === 'voxMail Tx') {
          return true;
        }
        return false;
      })
      .map(mailTransaction => {
        return {
          ...mailTransaction,
          threadId:
            mailTransaction.additionalInfo.value.senderInfo?.threadId ||
            mailTransaction.additionalInfo.value.recipientInfo?.threadId,
        };
      });
    await dispatch(walletActions.getBalance());
    dispatch(walletActions.createTransactionSuccess({ transactions: transactions }));
    dispatch(
      createMailTransactionSuccess({
        mailTransactions: [mailTransactions],
        nextTransactionCursor: transactions[0].txId,
      })
    );
  } catch (error) {
    console.log(error);
    dispatch(createMailTransactionFailure());
    throw error;
  }
};

export const getMailTransactions = options => async (dispatch, getState, { serviceInjector }) => {
  try {
    const {
      mail: { nextTransactionCursor: endkey, isLoadingMailTransactions },
      wallet: { transactions, isLoadingTransactions },
    } = getState();
    if (!isLoadingMailTransactions && !isLoadingTransactions) {
      dispatch(getMailTransactionsRequest());
      if (options.diff || transactions.length > 0) {
        options.endkey = endkey;
        await dispatch(walletActions.getTransactions({ diff: true }));
        await dispatch(walletActions.updateTransactionsConfirmations());
        const { mailTransactions, nextTransactionCursor } = await serviceInjector(
          MailService
        ).getMailTransactions(options);

        if (mailTransactions.length > 0) {
          dispatch(getDiffMailTransactionsSuccess({ mailTransactions, nextTransactionCursor }));
        }
        return mailTransactions;
      } else {
        await dispatch(walletActions.getTransactions({ limit: 10 }));
        await dispatch(walletActions.updateTransactionsConfirmations());
        const { mailTransactions, nextTransactionCursor } = await serviceInjector(
          MailService
        ).getMailTransactions(options);

        if (mailTransactions.length > 0) {
          dispatch(getMailTransactionsSuccess({ mailTransactions, nextTransactionCursor }));
        }
        return mailTransactions;
      }
    }
    return [];
  } catch (error) {
    dispatch(getMailTransactionsFailure());
    throw error;
  }
};

export const updateTransaction = transaction => async (dispatch, getState, { serviceInjector }) => {
  try {
    const updatedTransaction = await serviceInjector(MailService).updateTransaction(transaction);
    dispatch(updateTransactionSuccess(updatedTransaction));
  } catch (error) {
    throw error;
  }
};
