import { createAction } from 'redux-act';
import SettingsService from './settingsService';

export const setDefaultConfigRequest = createAction('SET_DEFAULT_CONFIG_REQUEST');
export const setDefaultConfigSuccess = createAction('SET_DEFAULT_CONFIG_SUCCESS');
export const setDefaultConfigFailure = createAction('SET_DEFAULT_CONFIG_FAILURE');

export const changeConfigRequest = createAction('CHANGE_CONFIG_REQUEST');
export const changeConfigSuccess = createAction('CHANGE_CONFIG_SUCCESS');
export const changeConfigFailure = createAction('CHANGE_CONFIG_FAILURE');

export const changeConfig = (nexaHost, nexaPort, userName, password) => async (
  dispatch,
  getState,
  { serviceInjector }
) => {
  dispatch(changeConfigRequest());
  try {
    if (nexaHost && nexaPort && userName && password) {
      const { sessionKey, callsRemaining } = await serviceInjector(SettingsService).changeConfig(
        nexaHost,
        nexaPort,
        userName,
        password
      );
      dispatch(
        changeConfigSuccess({ nexaHost, nexaPort, userName, password, sessionKey, callsRemaining })
      );
    } else {
      throw new Error('Incorrect settings');
    }
  } catch (error) {
    throw error;
  }
};

export const testConfig = (nexaHost, nexaPort, userName, password) => async (
  dispatch,
  getState,
  { serviceInjector }
) => {
  try {
    if (nexaHost && nexaPort && userName && password) {
      return await serviceInjector(SettingsService).testConfig(
        nexaHost,
        nexaPort,
        userName,
        password
      );
    } else {
      throw new Error('Incorrect settings');
    }
  } catch (error) {
    throw error;
  }
};

export const setDefaultConfig = () => async (dispatch, getState, { serviceInjector }) => {
  dispatch(setDefaultConfigRequest());
  try {
    const {
      nexaHost,
      nexaPort,
      userName,
      password,
      sessionKey,
      callsRemaining,
    } = await serviceInjector(SettingsService).setDefaultConfig();
    dispatch(
      setDefaultConfigSuccess({
        nexaHost,
        nexaPort,
        userName,
        password,
        sessionKey,
        callsRemaining,
      })
    );
  } catch (error) {
    throw error;
  }
};

export const initHttp = () => async (dispatch, getState, { serviceInjector }) => {
  const {
    settings: { nexaHost, nexaPort },
  } = getState();
  try {
    await serviceInjector(SettingsService).initHttp(nexaHost, nexaPort);
  } catch (error) {
    throw error;
  }
};
