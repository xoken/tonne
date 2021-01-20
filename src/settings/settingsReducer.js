import { createReducer } from 'redux-act';
import * as actions from './settingsActions';

const INITIAL_STATE = {
  nexaURI: '',
  userName: '',
  password: '',
  sessionKey: '',
};

export default createReducer(
  {
    [actions.changeConfigSuccess]: (state, { nexaURI, userName, password, sessionKey }) => ({
      ...state,
      nexaURI,
      userName,
      password,
      sessionKey,
    }),
    [actions.setConfigSuccess]: (state, { nexaURI, userName, password, sessionKey }) => ({
      ...state,
      nexaURI,
      userName,
      password,
      sessionKey,
    }),
  },
  INITIAL_STATE
);
