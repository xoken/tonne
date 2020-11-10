import { createAction } from 'redux-act';
import AllpayService from './allpayService';

export const getOutpointForNameRequest = createAction('GET_OUTPOINT_FOR_NAME_REQUEST');
export const getOutpointForNameSuccess = createAction('GET_OUTPOINT_FOR_NAME_SUCCESS');
export const getOutpointForNameFailure = createAction('GET_OUTPOINT_FOR_NAME_FAILURE');

export const buyNameRequest = createAction('BUY_NAME_REQUEST');
export const buyNameSuccess = createAction('BUY_NAME_SUCCESS');
export const buyNameFailure = createAction('BUY_NAME_FAILURE');

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
    dispatch(getOutpointForNameSuccess());
    return result;
  } catch (error) {
    dispatch(getOutpointForNameFailure());
    throw error;
  }
};
