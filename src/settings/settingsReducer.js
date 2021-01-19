import { createReducer } from 'redux-act';
import * as actions from './settingsActions';

const INITIAL_STATE = {
  nexaURL: '',
  userName: '',
  password: '',
  sessionKey: '',
};

export default createReducer(
  {
    [actions.changeConfigSuccess]: (state, { nexaURL, userName, password, sessionKey }) => ({
      ...state,
      nexaURL,
      userName,
      password,
      sessionKey,
    }),
    [actions.setConfigSuccess]: (state, { nexaURL, userName, password, sessionKey }) => ({
      ...state,
      nexaURL,
      userName,
      password,
      sessionKey,
    }),
  },
  INITIAL_STATE
);
