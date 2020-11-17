import React from 'react';
import { Route, Switch, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import ExistingWallet from './ExistingWallet';
import Login from './Login';
import NewWallet from './NewWallet';
import NoMatch from '../../shared/components/noMatch';
import PrivateRoute from '../../shared/components/privateRoute';
import PublicRoute from '../../shared/components/publicRoute';
import SendTransaction from '../components/SendTransaction';
import WalletPassword from './WalletPassword';
import WalletHome from './WalletHome';
import WalletDashboard from './WalletDashboard';
import BuyName from '../../allpay/BuyName';
import ProxyRegistration from '../../allpay/ProxyRegistration';

class WalletRoute extends React.Component {
  render() {
    const { path } = this.props.match;
    return (
      <Switch>
        <PublicRoute path={`${path}/existing`}>
          <ExistingWallet />
        </PublicRoute>{' '}
        <PublicRoute path={`${path}/new`}>
          <NewWallet />
        </PublicRoute>
        <PublicRoute path={`${path}/login`}>
          <Login />
        </PublicRoute>
        <PublicRoute path={`${path}/password`}>
          <WalletPassword />
        </PublicRoute>
        <PrivateRoute path={`${path}/dashboard`}>
          <WalletDashboard />
        </PrivateRoute>
        <PrivateRoute path={`${path}/send`}>
          <SendTransaction />
        </PrivateRoute>
        <PublicRoute path={`${path}/allpay/buy`}>
          <BuyName />
        </PublicRoute>
        <PublicRoute path={`${path}/allpay/register`}>
          <ProxyRegistration />
        </PublicRoute>
        <PublicRoute exact path={path}>
          <WalletHome />
        </PublicRoute>
        <Route path='*'>
          <NoMatch />
        </Route>
      </Switch>
    );
  }
}

const mapStateToProps = state => ({});

export default withRouter(connect(mapStateToProps)(WalletRoute));
