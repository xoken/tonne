import React from 'react';
import PropTypes from 'prop-types';
import { Route, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { VerticalAnimatedSwitch } from '../shared/components/Animations';
import TwitterAuthentication from './screens/TwitterAuthentication';
import ImportWallet from '../wallet/screens/ImportWallet';
import WalletSetup from './screens/walletSetup';
import WalletPassword from '../wallet/screens/WalletPassword';
import NewWallet from '../wallet/screens/NewWallet';
import Login from '../wallet/screens/Login';
import WalletDashboard from '../wallet/screens/WalletDashboard';

export const claimTwitterHandlePaths = {
  twitterAuth: '/claim-twitter-handle/auth/twitter',
  walletSetup: '/claim-twitter-handle/wallet-setup',
  importWallet: '/claim-twitter-handle/import-Wallet',
  walletPassword: '/claim-twitter-handle/new-password',
  createWallet: '/claim-twitter-handle/create-wallet',
  login: '/claim-twitter-handle/login',
  walletDashboard: '/claim-twitter-handle/wallet-dashboard',
};

export const claimTwitterHandleFlows = {
  'claim-twitter-handle': [claimTwitterHandlePaths.twitterAuth],
};

const ClaimTwitterHandleComponent = props => {
  return (
    <div style={{ paddingLeft: 10 }} verticalAlign='middle' style={{ height: '100%' }}>
      <Route
        exact
        path={claimTwitterHandlePaths.twitterAuth}
        render={() => <TwitterAuthentication />}
      />
      <Route exact path={claimTwitterHandlePaths.walletSetup} render={() => <WalletSetup />} />
      <Route exact path={claimTwitterHandlePaths.ImportWallet} render={() => <ImportWallet />} />
      <Route
        exact
        path={claimTwitterHandlePaths.walletPassword}
        render={() => <WalletPassword />}
      />
      <Route exact path={claimTwitterHandlePaths.createWallet} render={() => <NewWallet />} />
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
