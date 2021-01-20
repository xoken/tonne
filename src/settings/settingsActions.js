import { createAction } from 'redux-act';
import SettingsService from './settingsService';

export const setConfigRequest = createAction('SET_CONFIG_REQUEST');
export const setConfigSuccess = createAction('SET_CONFIG_SUCCESS');
export const setConfigFailure = createAction('SET_CONFIG_FAILURE');

export const changeConfigRequest = createAction('CHANGE_CONFIG_REQUEST');
export const changeConfigSuccess = createAction('CHANGE_CONFIG_SUCCESS');
export const changeConfigFailure = createAction('CHANGE_CONFIG_FAILURE');

export const changeConfig = (nexaURI, userName, password) => async (
  dispatch,
  getState,
  { serviceInjector }
) => {
  dispatch(changeConfigRequest());
  try {
    if (nexaURI && userName && password) {
      const { sessionKey } = await serviceInjector(SettingsService).changeConfig(
        nexaURI,
        userName,
        password
      );
      dispatch(changeConfigSuccess({ nexaURI, userName, password, sessionKey }));
    } else {
      throw new Error('Incorrect settings');
    }
  } catch (error) {
    throw error;
  }
};

export const testConfig = (nexaURI, userName, password) => async (
  dispatch,
  getState,
  { serviceInjector }
) => {
  try {
    if (nexaURI && userName && password) {
      return await serviceInjector(SettingsService).testConfig(nexaURI, userName, password);
    } else {
      throw new Error('Incorrect settings');
    }
  } catch (error) {
    throw error;
  }
};

export const setConfig = () => async (dispatch, getState, { serviceInjector }) => {
  dispatch(setConfigRequest());
  try {
    const { nexaURI, userName, password, sessionKey } = await serviceInjector(
      SettingsService
    ).setConfig();
    dispatch(
      setConfigSuccess({
        nexaURI,
        userName,
        password,
        sessionKey,
      })
    );
  } catch (error) {
    throw error;
  }
};
