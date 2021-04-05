import React from 'react';
import { withRouter, Switch } from 'react-router-dom';
import { connect } from 'react-redux';
import PrivateRoute from '../../shared/components/privateRoute';
import WalletHeader from '../components/WalletHeader';
import AllpayContainer from '../../allpay/allpayContainer';
import WalletDashboard from './WalletDashboard';
import MailDashboard from '../../mail/screens/MailDashboard';
import PartiallySignTransaction from '../../allpay/screens/PartiallySignTransaction';

class WalletContainer extends React.Component {
  render() {
    const {
      match: { path },
      location: { pathname },
    } = this.props;
    return (
      <>
        <WalletHeader />
        <Switch>
          <PrivateRoute path={`${path}/dashboard`}>
            {pathname === '/mail/dashboard' ? <MailDashboard /> : <WalletDashboard />}
          </PrivateRoute>
          <PrivateRoute path={`${path}/allpay/transaction`}>
            <PartiallySignTransaction />
          </PrivateRoute>
          <PrivateRoute path={`${path}/allpay`}>
            <AllpayContainer />
          </PrivateRoute>
        </Switch>
      </>
    );
  }
}

WalletContainer.propTypes = {};

WalletContainer.defaultProps = {};

const mapStateToProps = state => ({});

export default withRouter(connect(mapStateToProps)(WalletContainer));
