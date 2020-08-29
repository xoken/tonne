import React from 'react';
import { Route, Switch, useRouteMatch } from 'react-router-dom';
import ExistingWallet from './ExistingWallet';
import Login from './login';
import NewWallet from './NewWallet';
import NoMatch from '../../shared/components/noMatch';
import PrivateRoute from '../../shared/components/privateRoute';
import PublicRoute from '../../shared/components/publicRoute';
import SendTransaction from '../components/sendTransaction';
import WalletDashboard from './walletDashboard';
import WalletPassword from './walletPassword';

export default function WalletHome() {
  const { path } = useRouteMatch();
  return (
    <>
      <Switch>
        <PublicRoute path={`${path}/existing`} restricted={true}>
          <ExistingWallet />
        </PublicRoute>{' '}
        <PublicRoute path={`${path}/new`} restricted={true}>
          <NewWallet />
        </PublicRoute>
        <PublicRoute path={`${path}/login`} restricted={true}>
          <Login />
        </PublicRoute>
        <PublicRoute path={`${path}/password`} restricted={true}>
          <WalletPassword />
        </PublicRoute>
        <PrivateRoute path={`${path}/send`}>
          <SendTransaction />
        </PrivateRoute>
        <PrivateRoute exact path={path}>
          <WalletDashboard />
        </PrivateRoute>
        <Route path='*'>
          <NoMatch />
        </Route>
      </Switch>
    </>
  );
}
