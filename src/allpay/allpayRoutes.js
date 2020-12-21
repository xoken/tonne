import React from 'react';
import PropTypes from 'prop-types';
import { Route, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { VerticalAnimatedSwitch } from '../shared/components/Animations';
import SearchName from './screens/SearchName';
import RenderTransaction from './screens/RenderTransaction';
import ProxyProviders from './screens/ProxyProviders';

export const allpayPaths = {
  searchName: '/allpay/search',
  confirmBuy: '/allpay/confirm-purchase',
  registerName: '/allpay/register',
};

export const allpayFlows = {
  'buy-allpay-name': [allpayPaths.searchName, allpayPaths.confirmBuy, allpayPaths.registerName],
};

const AllpayComponent = () => {
  return (
    <VerticalAnimatedSwitch>
      <Route exact path={allpayPaths.searchName} render={() => <SearchName />} />
      <Route exact path={allpayPaths.confirmBuy} render={() => <RenderTransaction />} />
      <Route exact path={allpayPaths.registerName} render={() => <ProxyProviders />} />
    </VerticalAnimatedSwitch>
  );
};

AllpayComponent.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
};

export const AllpayRoutes = withRouter(connect()(AllpayComponent));
