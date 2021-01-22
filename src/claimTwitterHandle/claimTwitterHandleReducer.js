import { createReducer } from 'redux-act';
import * as actions from './claimTwitterHandleActions';

const INITIAL_STATE = {
  screenName: undefined,
  followersCount: undefined,
};

export default createReducer(
  {
    [actions.updateTwitterInfo]: (state, { screenName, followersCount }) => ({
      ...state,
      screenName,
      followersCount,
    }),
  },
  INITIAL_STATE
);
