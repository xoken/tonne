import { createReducer } from 'redux-act';
import * as actions from './settingsActions';

const INITIAL_STATE = {
  nexaHost: '',
  nexaPort: null,
  userName: '',
  password: '',
  sessionKey: '',
  callsRemaining: '',
};

export default createReducer(
  {
    [actions.changeConfigSuccess]: (
      state,
      { nexaHost, nexaPort, userName, password, sessionKey, callsRemaining }
    ) => ({
      ...state,
      nexaHost,
      nexaPort,
      userName,
      password,
      sessionKey,
      callsRemaining,
    }),
    [actions.setDefaultConfigSuccess]: (
      state,
      { nexaHost, nexaPort, userName, password, sessionKey, callsRemaining }
    ) => ({
      ...state,
      nexaHost,
      nexaPort,
      userName,
      password,
      sessionKey,
      callsRemaining,
    }),
  },
  INITIAL_STATE
);
