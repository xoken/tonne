import React from 'react';
import PropTypes from 'prop-types';
import { Route, Switch, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { VerticalAnimatedSwitch } from '../shared/components/Animations';
import SearchBuyName from './screens/SearchBuyName';
import ConfirmNamePurchase from './screens/ConfirmNamePurchase';
import NameRegistration from './screens/NameRegistration';
import ProxyRegistration from './screens/ProxyRegistration';
import ConfirmRegistration from './screens/ConfirmRegistration';
import RegistrationSuccess from './screens/RegistrationSuccess';

export const allpayPaths = {
  searchBuyName: '/wallet/allpay/search',
  confirmBuy: '/wallet/allpay/confirm-purchase',
  purchaseSuccess: '/wallet/allpay/purchase-success',
  registerName: '/wallet/allpay/register',
  confirmRegister: '/wallet/allpay/confirm-register',
  registerSuccess: '/wallet/allpay/register-success',
};

export const allpayFlows = {
  'buy-allpay-name': [
    allpayPaths.searchBuyName,
    allpayPaths.confirmBuy,
    allpayPaths.purchaseSuccess,
    allpayPaths.registerName,
    allpayPaths.confirmRegister,
    allpayPaths.registerSuccess,
  ],
};

const AllpayComponent = () => {
  return (
    <Switch style={{ paddingLeft: 10 }}>
      <Route exact path={allpayPaths.searchBuyName} render={() => <SearchBuyName />} />
      <Route exact path={allpayPaths.confirmBuy} render={() => <ConfirmNamePurchase />} />
      <Route exact path={allpayPaths.purchaseSuccess} render={() => <NameRegistration />} />
      <Route exact path={allpayPaths.registerName} render={() => <ProxyRegistration />} />
      <Route exact path={allpayPaths.confirmRegister} render={() => <ConfirmRegistration />} />
      <Route exact path={allpayPaths.registerSuccess} render={() => <RegistrationSuccess />} />
    </Switch>
  );
};

AllpayComponent.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
};

export const AllpayRoutes = withRouter(connect()(AllpayComponent));
