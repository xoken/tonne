import React from 'react';
import PropTypes from 'prop-types';
import { Route, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { VerticalAnimatedSwitch } from '../shared/components/Animations';
import TwitterAuthentication from './screens/TwitterAuthentication';
import ExistingWallet from '../wallet/screens/ExistingWallet';
import TwHome from './screens/TwHome';
import WalletPassword from '../wallet/screens/WalletPassword';
import NewWallet from '../wallet/screens/NewWallet';
import Login from '../wallet/screens/Login';
import WalletDashboard from '../wallet/screens/WalletDashboard';

export const claimTwitterHandlePaths = {
  twitterAuth: '/claim-twitter-handle/auth/twitter',
  twHome: '/claim-twitter-handle/home',
  existingWallet: '/claim-twitter-handle/existingWallet',
  walletPassword: '/claim-twitter-handle/walletPassword',
  newWallet: '/claim-twitter-handle/newWallet',
  login: '/claim-twitter-handle/login',
  walletDashboard: '/claim-twitter-handle/walletDashboard',
};

export const claimTwitterHandleFlows = {
  'claim-twitter-handle': [claimTwitterHandlePaths.twitterAuth],
};

const ClaimTwitterHandleComponent = props => {
  console.log(props);
  return (
    <div style={{ paddingLeft: 10 }} verticalAlign='middle' style={{ height: '100%' }}>
      <Route
        exact
        path={claimTwitterHandlePaths.twitterAuth}
        render={() => <TwitterAuthentication />}
      />
      <Route exact path={claimTwitterHandlePaths.twHome} render={() => <TwHome />} />
      <Route
        exact
        path={claimTwitterHandlePaths.existingWallet}
        render={() => <ExistingWallet />}
      />
      <Route
        exact
        path={claimTwitterHandlePaths.walletPassword}
        render={() => <WalletPassword />}
      />
      <Route exact path={claimTwitterHandlePaths.newWallet} render={() => <NewWallet />} />
      <Route exact path={claimTwitterHandlePaths.login} render={() => <Login />} />
      <Route
        exact
        path={claimTwitterHandlePaths.walletDashboard}
        render={() => <WalletDashboard />}
      />
    </div>
  );
};

ClaimTwitterHandleComponent.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
};

export const ClaimTwitterHandleRoutes = withRouter(connect()(ClaimTwitterHandleComponent));
