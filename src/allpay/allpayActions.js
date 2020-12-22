import { createAction } from 'redux-act';
import { allpayFlows } from './allpayRoutes';
import AllpayService from './allpayService';

export const getResellerURIRequest = createAction('GET_RESELLER_URI_REQUEST');
export const getResellerURISuccess = createAction('GET_RESELLER_URI_SUCCESS');
export const getResellerURIFailure = createAction('GET_RESELLER_URI_FAILURE');

export const buyNameRequest = createAction('BUY_NAME_REQUEST');
export const buyNameSuccess = createAction('BUY_NAME_SUCCESS');
export const buyNameFailure = createAction('BUY_NAME_FAILURE');

export const selectProxyProviderRequest = createAction('SELECT_PROXY_PROVIDER_REQUEST');
export const selectProxyProviderSuccess = createAction('SELECT_PROXY_PROVIDER_SUCCESS');
export const selectProxyProviderFailure = createAction('SELECT_PROXY_PROVIDER_FAILURE');

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

export const selectProxyProvider = ({ proxyHost, proxyPort }) => (
  dispatch,
  getState,
  { serviceInjector }
) => {
  dispatch(selectProxyProviderRequest());
  try {
    dispatch(selectProxyProviderSuccess({ proxyHost, proxyPort }));
  } catch (error) {
    dispatch(selectProxyProviderFailure());
    throw error;
  }
};

export const registerName = ({ name, addressCount }) => async (
  dispatch,
  getState,
  { serviceInjector }
) => {
  const {
    allpay: { proxyHost, proxyPort },
  } = getState();
  dispatch(registerNameRequest());
  try {
    const { psbt, inputs, ownOutputs } = await serviceInjector(AllpayService).registerName({
      proxyHost,
      proxyPort,
      name,
      addressCount,
    });
    dispatch(registerNameSuccess({ psbt, inputs, ownOutputs }));
  } catch (error) {
    dispatch(registerNameFailure());
    throw error;
  }
};

export const signRelayTransaction = data => async (dispatch, getState, { serviceInjector }) => {
  dispatch(signRelayTransactionRequest());
  try {
    const { txBroadcast } = await serviceInjector(AllpayService).signRelayTransaction(data);
    dispatch(signRelayTransactionSuccess());
    return { txBroadcast };
  } catch (error) {
    dispatch(signRelayTransactionFailure());
    throw error;
  }
};

export const updateProgressStep = createAction('UPDATE_PROGRESS_STEP');
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
