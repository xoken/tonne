import { createAction } from 'redux-act';
import { allpayFlows } from './allpayRoutes';
import * as walletActions from '../wallet/walletActions';
import AllpayService from './allpayService';

export const getResellerURIRequest = createAction('GET_RESELLER_URI_REQUEST');
export const getResellerURISuccess = createAction('GET_RESELLER_URI_SUCCESS');
export const getResellerURIFailure = createAction('GET_RESELLER_URI_FAILURE');

export const buyNameRequest = createAction('BUY_NAME_REQUEST');
export const buyNameSuccess = createAction('BUY_NAME_SUCCESS');
export const buyNameFailure = createAction('BUY_NAME_FAILURE');

export const registerNameRequest = createAction('REGISTER_NAME_REQUEST');
export const registerNameSuccess = createAction('REGISTER_NAME_SUCCESS');
export const registerNameFailure = createAction('REGISTER_NAME_FAILURE');

export const signRelayTransactionRequest = createAction('SIGN_RELAY_TRANSACTION_REQUEST');
export const signRelayTransactionSuccess = createAction('SIGN_RELAY_TRANSACTION_SUCCESS');
export const signRelayTransactionFailure = createAction('SIGN_RELAY_TRANSACTION_FAILURE');

export const getResellerURI = name => async (dispatch, getState, { serviceInjector }) => {
  dispatch(getResellerURIRequest());
  try {
    const response = await serviceInjector(AllpayService).getResellerURI(name);
    dispatch(getResellerURISuccess());
    return response;
  } catch (error) {
    dispatch(getResellerURIFailure());
    throw error;
  }
};

export const buyName = data => async (dispatch, getState, { serviceInjector }) => {
  dispatch(buyNameRequest());
  try {
    const { psbt, outpoint, inputs, ownOutputs, snv } = await serviceInjector(
      AllpayService
    ).buyName(data);
    dispatch(buyNameSuccess({ psbt, outpoint, inputs, ownOutputs, snv }));
  } catch (error) {
    dispatch(buyNameFailure());
    throw error;
  }
};

export const registerName = ({ proxyURI, name, addressCount }) => async (
  dispatch,
  getState,
  { serviceInjector }
) => {
  dispatch(registerNameRequest());
  try {
    const { transaction, txBroadcast } = await serviceInjector(AllpayService).registerName({
      proxyURI,
      name,
      addressCount,
    });
    if (txBroadcast) {
      dispatch(registerNameSuccess());
      await dispatch(walletActions.getAllpayHandles());
      await dispatch(walletActions.getUnregisteredNames());
      await dispatch(walletActions.getBalance());
      dispatch(walletActions.createSendTransactionSuccess({ transaction }));
    } else {
      throw new Error('Failed to broadcast transaction');
    }
  } catch (error) {
    dispatch(registerNameFailure());
    throw error;
  }
};

export const SET_NAME = 'SET_NAME';
export const setName = ({ name }) => async (dispatch, getState, { serviceInjector }) => {
  dispatch({
    type: SET_NAME,
    payload: { name },
  });
};

export const signRelayTransaction = data => async (dispatch, getState, { serviceInjector }) => {
  dispatch(signRelayTransactionRequest());
  try {
    const { transaction, txBroadcast } = await serviceInjector(AllpayService).signRelayTransaction(
      data
    );
    dispatch(signRelayTransactionSuccess());
    await dispatch(walletActions.getBalance());
    dispatch(walletActions.createSendTransactionSuccess({ transaction }));
    return { txBroadcast };
  } catch (error) {
    dispatch(signRelayTransactionFailure());
    throw error;
  }
};

export const updateProgressStep = createAction('ALLPAY_UPDATE_PROGRESS_STEP');
export const updateProgress = payload => dispatch => {
  dispatch(updateProgressStep(payload));
};

export const ALLPAY_UPDATE_SCREEN_PROPS = 'ALLPAY_UPDATE_SCREEN_PROPS';
export const updateScreenProps = props => dispatch => {
  dispatch({
    type: ALLPAY_UPDATE_SCREEN_PROPS,
    payload: props,
  });
};

export const RESET_ALLPAY = 'RESET_ALLPAY';
export const resetAllpay = () => async dispatch => {
  dispatch({ type: RESET_ALLPAY, payload: {} });
};

export const incrementFlow = (history, count = 1) => (dispatch, getState) => {
  const { activeStep, id } = getState();
  const nextStep = activeStep + count;

  dispatch({
    type: ALLPAY_UPDATE_SCREEN_PROPS,
    payload: {
      activeStep: nextStep,
    },
  });
  dispatch(updateProgress(nextStep));
  history.push(allpayFlows[id][nextStep - 1]);
};

export const decrementFlow = (history, count = 1) => (dispatch, getState) => {
  const {
    allpay: {
      ui: { activeStep },
    },
  } = getState();
  if (activeStep !== 1) {
    const prevStep = activeStep - count;
    dispatch({
      type: ALLPAY_UPDATE_SCREEN_PROPS,
      payload: {
        activeStep: prevStep,
      },
    });
    dispatch(updateProgress(prevStep));
    history.push(allpayFlows['buy-allpay-name'][prevStep - 1]);
  } else {
    dispatch(resetAllpay());
    history.push('/wallet/dashboard');
  }
};
