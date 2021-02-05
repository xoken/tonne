import React from 'react';
import PropTypes from 'prop-types';
import { Route, Switch, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import NoMatch from '../shared/components/noMatch';
import { VerticalAnimatedSwitch } from '../shared/components/Animations';
import WalletSetup from './screens/WalletSetup';
import WalletPasswordScreen from './screens/WalletPasswordScreen';
import TwitterAuthHome from './screens/TwitterAuthHome';
import ConfirmNamePurchase from '../allpay/screens/ConfirmNamePurchase';
import ProxyRegistration from '../allpay/screens/ProxyRegistration';
// import ConfirmRegistration from '../allpay/screens/ConfirmRegistration';
import RegistrationSuccess from '../allpay/screens/RegistrationSuccess';

export const claimTwitterHandlePaths = {
  walletSetup: '/claim-twitter-handle/wallet-setup',
  walletPasswordSetup: '/claim-twitter-handle/wallet-password-setup',
  twitterAuthHome: '/claim-twitter-handle/home',
  confirmBuy: '/wallet/allpay/confirm-purchase',
  registerName: '/wallet/allpay/register',
  // confirmRegister: '/wallet/allpay/confirm-register',
  registerSuccess: '/wallet/allpay/register-success',
};

export const claimTwitterHandleFlows = {
  'claim-twitter-handle': [
    claimTwitterHandlePaths.walletSetup,
    claimTwitterHandlePaths.walletPasswordSetup,
  ],
};

const ClaimTwitterHandleComponent = props => {
  return (
    <Switch style={{ paddingLeft: 10 }}>
      <Route exact path={claimTwitterHandlePaths.walletSetup} render={() => <WalletSetup />} />
      <Route
        exact
        path={claimTwitterHandlePaths.walletPasswordSetup}
        render={() => <WalletPasswordScreen />}
      />
      <Route
        exact
        path={claimTwitterHandlePaths.twitterAuthHome}
        render={() => <TwitterAuthHome />}
      />
      <Route
        exact
        path={claimTwitterHandlePaths.confirmBuy}
        render={() => <ConfirmNamePurchase />}
      />
      <Route
        exact
        path={claimTwitterHandlePaths.registerName}
        render={() => <ProxyRegistration />}
      />
      {/* <Route
        exact
        path={claimTwitterHandlePaths.confirmRegister}
        render={() => <ConfirmRegistration />}
      /> */}
      <Route
        exact
        path={claimTwitterHandlePaths.registerSuccess}
        render={() => <RegistrationSuccess />}
      />
      <Route path='*'>
        <NoMatch />
      </Route>
    </Switch>
  );
};

ClaimTwitterHandleComponent.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
};

export const ClaimTwitterHandleRoutes = withRouter(connect()(ClaimTwitterHandleComponent));
