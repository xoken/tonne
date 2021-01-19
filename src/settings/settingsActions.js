import { createAction } from 'redux-act';
import SettingsService from './settingsService';

export const setConfigRequest = createAction('SET_CONFIG_REQUEST');
export const setConfigSuccess = createAction('SET_CONFIG_SUCCESS');
export const setConfigFailure = createAction('SET_CONFIG_FAILURE');

export const changeConfigRequest = createAction('CHANGE_CONFIG_REQUEST');
export const changeConfigSuccess = createAction('CHANGE_CONFIG_SUCCESS');
export const changeConfigFailure = createAction('CHANGE_CONFIG_FAILURE');

export const changeConfig = (nexaURL, userName, password) => async (
  dispatch,
  getState,
  { serviceInjector }
) => {
  dispatch(changeConfigRequest());
  try {
    if (nexaURL && userName && password) {
      const { sessionKey } = await serviceInjector(SettingsService).changeConfig(
        nexaURL,
        userName,
        password
      );
      dispatch(changeConfigSuccess({ nexaURL, userName, password, sessionKey }));
    } else {
      throw new Error('Incorrect settings');
    }
  } catch (error) {
    throw error;
  }
};

export const testConfig = (nexaURL, userName, password) => async (
  dispatch,
  getState,
  { serviceInjector }
) => {
  try {
    if (nexaURL && userName && password) {
      return await serviceInjector(SettingsService).testConfig(nexaURL, userName, password);
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
    const { nexaURL, userName, password, sessionKey } = await serviceInjector(
      SettingsService
    ).setConfig();
    dispatch(
      setConfigSuccess({
        nexaURL,
        userName,
        password,
        sessionKey,
      })
    );
  } catch (error) {
    throw error;
  }
};
