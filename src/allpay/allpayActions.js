import { createAction } from 'redux-act';
import AllpayService from './allpayService';
const electron = window.require('electron');
const { ipcRenderer } = electron;

export const getOutpointForNameRequest = createAction('GET_OUTPOINT_FOR_NAME_REQUEST');
export const getOutpointForNameSuccess = createAction('GET_OUTPOINT_FOR_NAME_SUCCESS');
export const getOutpointForNameFailure = createAction('GET_OUTPOINT_FOR_NAME_FAILURE');

export const buyNameRequest = createAction('BUY_NAME_REQUEST');
export const buyNameSuccess = createAction('BUY_NAME_SUCCESS');
export const buyNameFailure = createAction('BUY_NAME_FAILURE');

export const registerNameRequest = createAction('REGISTER_NAME_REQUEST');
export const registerNameSuccess = createAction('REGISTER_NAME_SUCCESS');
export const registerNameFailure = createAction('REGISTER_NAME_FAILURE');

export const getOutpointForName = name => async (dispatch, getState, { serviceInjector }) => {
  dispatch(getOutpointForNameRequest());
  try {
    const result = await serviceInjector(AllpayService).getOutpointForName(name);
    dispatch(getOutpointForNameSuccess());
    return result;
  } catch (error) {
    dispatch(getOutpointForNameFailure());
    throw error;
  }
};

export const buyName = data => async (dispatch, getState, { serviceInjector }) => {
  dispatch(buyNameRequest());
  try {
    const result = await serviceInjector(AllpayService).getOutpointForName(data);
    dispatch(buyNameSuccess());
    return result;
  } catch (error) {
    dispatch(buyNameFailure());
    throw error;
  }
};

export const registerName = data => async (dispatch, getState, { serviceInjector }) => {
  dispatch(registerNameRequest());
  try {
    debugger;
    // const result = await serviceInjector(AllpayService).registerName(data);
    // dispatch(registerNameSuccess());
    // return result;
    ipcRenderer.send('proxyProvider:register', data);
  } catch (error) {
    dispatch(registerNameFailure());
    throw error;
  }
};
