import { createReducer } from 'redux-act';
import * as actions from './settingsActions';

const INITIAL_STATE = {
  nexaHost: '',
  nexaPort: null,
  userName: '',
  password: '',
};

export default createReducer(
  {
    [actions.changeConfigSuccess]: (state, { nexaHost, nexaPort, userName, password }) => ({
      ...state,
      nexaHost,
      nexaPort,
      userName,
      password,
    }),
    [actions.setDefaultConfigSuccess]: (state, { nexaHost, nexaPort, userName, password }) => ({
      ...state,
      nexaHost,
      nexaPort,
      userName,
      password,
    }),
  },
  INITIAL_STATE
);
