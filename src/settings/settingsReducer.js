import { createReducer } from 'redux-act';
import * as actions from './settingsActions';

const INITIAL_STATE = {
  nexaURI: '',
  userName: '',
  password: '',
  token: '',
};

export default createReducer(
  {
    [actions.changeConfigSuccess]: (state, { nexaURI, userName, password, token }) => ({
      ...state,
      nexaURI,
      userName,
      password,
      token,
    }),
    [actions.setConfigSuccess]: (state, { nexaURI, userName, password, token }) => ({
      ...state,
      nexaURI,
      userName,
      password,
      token,
    }),
  },
  INITIAL_STATE
);
