import { createAction } from 'redux-act';
import { claimTwitterHandleFlows } from './claimTwitterHandleRoutes';
import ClaimTwitterHandleService from './claimTwitterHandleService';

export const updateTwitterInfo = createAction('UPDATE_TWITTER_INFO');

export const getPurchasedFollowersRequest = createAction('GET_PURCHASED_FOLLOWERS_REQUEST');
export const getPurchasedFollowersSuccess = createAction('GET_PURCHASED_FOLLOWERS_SUCCESS');
export const getPurchasedFollowersFailure = createAction('GET_PURCHASED_FOLLOWERS_FAILURE');

export const doTwitterAuth = history => async (dispatch, getState, { serviceInjector }) => {
  const popup = window.open(
    '/api/v1/auth/twitter',
    'twitter-auth-window',
    'width=500, height=500, top=0, left=0'
  );
  //   this.polling(popup);
  const messageHandler = event => {
    if (event.origin !== window.location.origin) return;
    if (event.source.name === 'twitter-auth-window') {
      const queryParams = new URLSearchParams(event.data);
      const screenName = queryParams.get('screen_name');
      const followersCount = queryParams.get('followers_count');
      const oauthToken = queryParams.get('oauth_token');
      const oauthTokenSecret = queryParams.get('oauth_token_secret');
      popup.close();
      window.removeEventListener('message', messageHandler);
      dispatch(updateTwitterInfo({ screenName, followersCount, oauthToken, oauthTokenSecret }));
      history.push('/claim-twitter-handle/wallet-setup');
    }
  };
  window.addEventListener('message', messageHandler, false);
};

export const getPurchasedFollowers = args => async (dispatch, getState, { serviceInjector }) => {
  dispatch(getPurchasedFollowersRequest());
  try {
    const {
      twitter: { screenName, oauthToken, oauthTokenSecret },
    } = getState();
    const { followers } = await serviceInjector(ClaimTwitterHandleService).getTwitterFollowers(
      screenName,
      oauthToken,
      oauthTokenSecret
    );
    const { purchasedNames } = await serviceInjector(ClaimTwitterHandleService).getPurchasedNames(
      args
    );
    const uniqPurchasedNames = [...new Set(purchasedNames)];
    const nameWithoutPrefix = uniqPurchasedNames.map(name => name.slice(3));
    const purchasedTwitterHandles = nameWithoutPrefix.filter(element =>
      followers.includes(element)
    );
    dispatch(getPurchasedFollowersSuccess({ purchasedTwitterHandles }));
  } catch (error) {
    dispatch(getPurchasedFollowersFailure());
    throw error;
  }
};

// export const polling = popup => {
//   const polling = setInterval(() => {
//     if (!popup || popup.closed || popup.closed === undefined) {
//       clearInterval(polling);
//     }

//     const closeDialog = () => {
//       clearInterval(polling);
//       popup.close();
//     };

//     try {
//       if (popup.location.hostname.includes('localhost')) {
//         if (popup.location.search) {
//           const query = new URLSearchParams(popup.location.search);
//           const oauthToken = query.get('oauth_token');
//           const oauthVerifier = query.get('oauth_verifier');
//           closeDialog();
//         } else {
//           closeDialog();
//           console.log('OAuth redirect has occurred but no query parameters were found');
//         }
//       }
//     } catch (error) {
//       console.log(error);
//     }
//   }, 500);
// };

export const SET_NAME = 'SET_NAME';
export const setName = ({ name }) => async (dispatch, getState, { serviceInjector }) => {
  dispatch({
    type: SET_NAME,
    payload: { name },
  });
};

export const updateProgressStep = createAction('UPDATE_PROGRESS_STEP');
export const updateProgress = payload => dispatch => {
  dispatch(updateProgressStep(payload));
};

export const UPDATE_SCREEN_PROPS = 'UPDATE_SCREEN_PROPS';
export const updateScreenProps = props => dispatch => {
  dispatch({
    type: UPDATE_SCREEN_PROPS,
    payload: props,
  });
};

export const RESET_FLOW = 'RESET_FLOW';
export const resetFlow = () => async dispatch => {
  dispatch({ type: RESET_FLOW, payload: {} });
};

export const incrementFlow = (history, count = 1) => (dispatch, getState) => {
  const { activeStep, id } = getState();
  const nextStep = activeStep + count;

  dispatch({
    type: UPDATE_SCREEN_PROPS,
    payload: {
      activeStep: nextStep,
    },
  });
  dispatch(updateProgress(nextStep));
  history.push(claimTwitterHandleFlows[id][nextStep - 1]);
};

export const decrementFlow = (history, count = 1) => (dispatch, getState) => {
  const {
    twitter: {
      ui: { activeStep },
    },
  } = getState();
  if (activeStep !== 1) {
    const prevStep = activeStep - count;
    dispatch({
      type: UPDATE_SCREEN_PROPS,
      payload: {
        activeStep: prevStep,
      },
    });
    dispatch(updateProgress(prevStep));
    history.push(claimTwitterHandleFlows['claim-twitter-handle'][prevStep - 1]);
  } else {
    dispatch(resetFlow());
    history.push('/wallet/dashboard');
  }
};
