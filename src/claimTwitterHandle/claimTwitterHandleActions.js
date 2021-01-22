import { createAction } from 'redux-act';
// import ClaimTwitterHandleService from './claimTwitterHandleService';
// import * as allpayActions from '../../allpay/allpayActions';
// import { utils } from 'allegory-allpay-sdk';

export const updateTwitterInfo = createAction('UPDATE_TWITTER_INFO');

export const doTwitterAuth = history => async (dispatch, getState, { serviceInjector }) => {
  const popup = window.open(
    '/v1/auth/twitter',
    'twitter-auth-window',
    'width=500, height=500, top=0, left=0'
  );
  //   this.polling(popup);
  window.addEventListener(
    'message',
    event => {
      if (event.origin !== window.location.origin) return;
      if (event.source.name === 'twitter-auth-window') {
        const queryParams = new URLSearchParams(event.data);
        const screenName = queryParams.get('screen_name');
        const followersCount = queryParams.get('followers_count');
        popup.close();
        dispatch(updateTwitterInfo({ screenName, followersCount }));
        history.push('/claim-twitter-handle');
        // this.checkBuy(twitterHandle);
      }
    },
    false
  );
};

// export const polling = (popup) => {
//     const polling = setInterval(() => {
//       if (!popup || popup.closed || popup.closed === undefined) {
//         clearInterval(polling);
//       }

//       const closeDialog = () => {
//         clearInterval(polling);
//         popup.close();
//       };

//       try {
//         if (popup.location.hostname.includes('localhost')) {
//           if (popup.location.search) {
//             const query = new URLSearchParams(popup.location.search);
//             const oauthToken = query.get('oauth_token');
//             const oauthVerifier = query.get('oauth_verifier');
//             closeDialog();
//           } else {
//             closeDialog();
//             console.log('OAuth redirect has occurred but no query parameters were found');
//           }
//         }
//       } catch (error) {
//         console.log(error);
//       }
//     }, 500);
// }

export const checkBuy = twitterHandle => {
  // try {
  //   const { dispatch } = this.props;
  //   const { name, uri, protocol, isProducer } = await dispatch(
  //     allpayActions.getResellerURI([97, 112, 47].concat(utils.getCodePoint(twitterHandle)))
  //   );
  //   const host = 'localhost';
  //   const port = 9189;
  //   const data = {
  //     name,
  //     isProducer: false,
  //     host,
  //     port,
  //   };
  //   await dispatch(allpayActions.buyName(data));
  //   this.props.history.push('/wallet/allpay/confirm-purchase');
  // } catch (error) {
  //   console.log(error);
  // }
};
