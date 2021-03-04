import React from 'react';
import { withRouter, Route, Switch } from 'react-router-dom';
import { connect } from 'react-redux';
import MailContainer from './MailContainer';
import MailLoginScreen from './MailLoginScreen';
import ImportWalletScreen from './ImportWalletScreen';
import NewWalletScreen from './NewWalletScreen';
import PublicRoute from '../../shared/components/publicRoute';
import NoMatch from '../../shared/components/noMatch';
import NewPasswordScreen from './NewPasswordScreen';
import MailHome from './MailHome';

class MailRoute extends React.Component {
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
          <MailLoginScreen />
        </PublicRoute>
        <PublicRoute path={`${path}/password`}>
          <NewPasswordScreen />
        </PublicRoute>
        <PublicRoute exact path={path}>
          <MailHome />
        </PublicRoute>
        <MailContainer />
        <Route path='*'>
          <NoMatch />
        </Route>
      </Switch>
    );
  }
}

MailRoute.propTypes = {};

MailRoute.defaultProps = {};

const mapStateToProps = state => ({});

export default withRouter(connect(mapStateToProps)(MailRoute));
