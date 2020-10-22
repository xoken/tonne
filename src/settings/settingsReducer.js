import { createReducer } from 'redux-act';
import * as actions from './settingsActions';

const INITIAL_STATE = {
  nexaHost: '',
  nexaPort: null,
  userName: '',
  password: '',
  sessionKey: '',
};

export default createReducer(
  {
    [actions.changeConfigSuccess]: (
      state,
      { nexaHost, nexaPort, userName, password, sessionKey }
    ) => ({
      ...state,
      nexaHost,
      nexaPort,
      userName,
      password,
      sessionKey,
    }),
    [actions.setDefaultConfigSuccess]: (
      state,
      { nexaHost, nexaPort, userName, password, sessionKey }
    ) => ({
      ...state,
      nexaHost,
      nexaPort,
      userName,
      password,
      sessionKey,
    }),
  },
  INITIAL_STATE
);
