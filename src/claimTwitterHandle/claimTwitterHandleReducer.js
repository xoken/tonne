import { createReducer } from 'redux-act';
import * as actions from './claimTwitterHandleActions';

const INITIAL_STATE = {
  ui: {
    activeStep: 1,
    title: null,
    progressTotalSteps: 7,
  },
  screenName: 'test',
  followersCount: undefined,
};

export default createReducer(
  {
    [actions.updateTwitterInfo]: (state, { screenName, followersCount }) => ({
      ...state,
      screenName,
      followersCount,
    }),
    [actions.UPDATE_SCREEN_PROPS]: (state, payload) => ({
      ...state,
      ui: {
        ...state.ui,
        ...payload,
      },
    }),
    [actions.RESET_FLOW]: () => ({
      ...INITIAL_STATE,
    }),
    [actions.SET_NAME]: (state, { name }) => ({
      ...state,
      outpoint: {
        name,
      },
    }),
  },
  INITIAL_STATE
);
