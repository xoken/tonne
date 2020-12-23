import React from 'react';
import PropTypes from 'prop-types';
import { Route, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { VerticalAnimatedSwitch } from '../shared/components/Animations';
import SearchBuyName from './screens/SearchBuyName';
import ConfirmNamePurchase from './screens/ConfirmNamePurchase';
import NameRegistration from './screens/NameRegistration';
import ProxyRegistration from './screens/ProxyRegistration';
import PartiallySignTransaction from './screens/PartiallySignTransaction';

export const allpayPaths = {
  SearchBuyName: '/wallet/allpay/search',
  confirmBuy: '/wallet/allpay/confirm-purchase',
  purchaseSuccess: '/wallet/allpay/purchase-success',
  registerName: '/wallet/allpay/register',
  confirmRegister: '/wallet/allpay/confirm-register',
  renderTransaction: '/wallet/allpay/transaction',
};

export const allpayFlows = {
  'buy-allpay-name': [allpayPaths.SearchBuyName, allpayPaths.confirmBuy, allpayPaths.registerName],
};

const AllpayComponent = () => {
  return (
    <div style={{ paddingLeft: 10 }}>
      <Route exact path={allpayPaths.SearchBuyName} render={() => <SearchBuyName />} />
      <Route
        exact
        path={allpayPaths.confirmBuy}
        render={() => <ConfirmNamePurchase activeStep={2} />}
      />
      <Route exact path={allpayPaths.purchaseSuccess} render={() => <NameRegistration />} />
      <Route exact path={allpayPaths.registerName} render={() => <ProxyRegistration />} />
      <Route
        exact
        path={allpayPaths.confirmRegister}
        render={() => <ConfirmNamePurchase activeStep={5} />}
      />
      <Route
        exact
        path={allpayPaths.renderTransaction}
        render={() => <PartiallySignTransaction />}
      />
    </div>
  );
};

AllpayComponent.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
};

export const AllpayRoutes = withRouter(connect()(AllpayComponent));
