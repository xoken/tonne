import React from 'react';
import { withRouter, Route, Switch } from 'react-router-dom';
import { connect } from 'react-redux';
import LoginScreen from './LoginScreen';
import ImportWalletScreen from './ImportWalletScreen';
import NewWalletScreen from './NewWalletScreen';
import PublicRoute from '../../shared/components/publicRoute';
import NoMatch from '../../shared/components/noMatch';
import WalletPasswordScreen from './WalletPasswordScreen';
import WalletHome from './WalletHome';
import WalletContainer from './WalletContainer';

class WalletRoute extends React.Component {
  render() {
    const { path } = this.props.match;
    return (
      <Switch>
        <PublicRoute path={`${path}/existing`}>
          <ImportWalletScreen />
        </PublicRoute>
        <PublicRoute path={`${path}/new`}>
          <NewWalletScreen />
        </PublicRoute>
        <PublicRoute path={`${path}/login`}>
          <LoginScreen />
        </PublicRoute>
        <PublicRoute path={`${path}/password`}>
          <WalletPasswordScreen />
        </PublicRoute>
        <PublicRoute exact path={path}>
          <WalletHome />
        </PublicRoute>
        <WalletContainer />
        <Route path='*'>
          <NoMatch />
        </Route>
      </Switch>
    );
  }
}

WalletRoute.propTypes = {};

WalletRoute.defaultProps = {};

const mapStateToProps = state => ({});

export default withRouter(connect(mapStateToProps)(WalletRoute));
