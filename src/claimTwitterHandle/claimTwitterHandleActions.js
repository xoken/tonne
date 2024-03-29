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
  const messageHandler = async event => {
    if (event.origin !== window.location.origin) return;
    if (event.source.name === 'twitter-auth-window') {
      const queryParams = new URLSearchParams(event.data);
      const oauthToken = queryParams.get('oauth_token');
      const oauthTokenSecret = queryParams.get('oauth_token_secret');
      popup.close();
      window.removeEventListener('message', messageHandler);
      dispatch(updateTwitterInfo({ oauthToken, oauthTokenSecret }));
      await dispatch(getPurchasedFollowers({ prefix: [116, 119, 47] }));
      history.push('/claim-twitter-handle/wallet-setup');
    }
  };
  window.addEventListener('message', messageHandler, false);
};

export const getPurchasedFollowers = args => async (dispatch, getState, { serviceInjector }) => {
  dispatch(getPurchasedFollowersRequest());
  try {
    const {
      twitter: { oauthToken, oauthTokenSecret },
    } = getState();
    const { user, followers } = await serviceInjector(
      ClaimTwitterHandleService
    ).getTwitterFollowers(oauthToken, oauthTokenSecret);
    const { purchasedNames } = await serviceInjector(ClaimTwitterHandleService).getPurchasedNames(
      args
    );
    const uniqPurchasedNames = [...new Set(purchasedNames)];
    const nameWithoutPrefix = uniqPurchasedNames.map(name => name.slice(3));
    const purchasedTwitterFollowers = followers.filter(follower => {
      const isPurchased = nameWithoutPrefix.find(
        name => follower.screen_name.replaceAll(/\s/g, '').toLowerCase() === name.toLowerCase()
      );
      if (isPurchased) {
        return true;
      }
      return false;
    });
    dispatch(getPurchasedFollowersSuccess({ user, purchasedTwitterFollowers }));
  } catch (error) {
    dispatch(getPurchasedFollowersFailure());
    throw error;
  }
};

export const getCoin = args => async (dispatch, getState, { serviceInjector }) => {
  try {
    return await serviceInjector(ClaimTwitterHandleService).getCoin(args);
  } catch (error) {
    throw error;
  }
};

export const SET_MESSAGE = 'SET_MESSAGE';
export const setMessage = message => (dispatch, getState, { serviceInjector }) => {
  dispatch({
    type: SET_MESSAGE,
    payload: { message },
  });
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
//     }
//   }, 500);
// };

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
    history.push(claimTwitterHandleFlows['claim-twitter-handle'][prevStep - 1]);
  } else {
    dispatch(resetFlow());
    history.push('/wallet/dashboard');
  }
};
