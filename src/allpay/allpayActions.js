import { createAction } from 'redux-act';
import AllpayService from './allpayService';

export const getOutpointForNameRequest = createAction('GET_OUTPOINT_FOR_NAME_REQUEST');
export const getOutpointForNameSuccess = createAction('GET_OUTPOINT_FOR_NAME_SUCCESS');
export const getOutpointForNameFailure = createAction('GET_OUTPOINT_FOR_NAME_FAILURE');

export const buyNameRequest = createAction('BUY_NAME_REQUEST');
export const buyNameSuccess = createAction('BUY_NAME_SUCCESS');
export const buyNameFailure = createAction('BUY_NAME_FAILURE');

export const registerNameRequest = createAction('REGISTER_NAME_REQUEST');
export const registerNameSuccess = createAction('REGISTER_NAME_SUCCESS');
export const registerNameFailure = createAction('REGISTER_NAME_FAILURE');

export const signRelayTransactionRequest = createAction('SIGN_RELAY_TRANSACTION_REQUEST');
export const signRelayTransactionSuccess = createAction('SIGN_RELAY_TRANSACTION_SUCCESS');
export const signRelayTransactionFailure = createAction('SIGN_RELAY_TRANSACTION_FAILURE');

export const getOutpointForName = name => async (dispatch, getState, { serviceInjector }) => {
  dispatch(getOutpointForNameRequest());
  try {
    const response = await serviceInjector(AllpayService).getOutpointForName(name);
    dispatch(getOutpointForNameSuccess());
    return response;
  } catch (error) {
    dispatch(getOutpointForNameFailure());
    throw error;
  }
};

export const buyName = data => async (dispatch, getState, { serviceInjector }) => {
  dispatch(buyNameRequest());
  try {
    const { psbt, name, inputs, outputOwner, outputChange } = await serviceInjector(
      AllpayService
    ).buyName(data);
    dispatch(buyNameSuccess({ psbt, name, inputs, outputOwner, outputChange }));
  } catch (error) {
    dispatch(buyNameFailure());
    throw error;
  }
};

export const registerName = data => async (dispatch, getState, { serviceInjector }) => {
  dispatch(registerNameRequest());
  try {
    const response = await serviceInjector(AllpayService).registerName(data);
    dispatch(registerNameSuccess());
    return response;
  } catch (error) {
    dispatch(registerNameFailure());
    throw error;
  }
};

export const signRelayTransaction = data => async (dispatch, getState, { serviceInjector }) => {
  dispatch(signRelayTransactionRequest());
  try {
    const response = await serviceInjector(AllpayService).signRelayTransaction(data);
    dispatch(signRelayTransactionSuccess());
    return response;
  } catch (error) {
    dispatch(signRelayTransactionFailure());
    throw error;
  }
};
