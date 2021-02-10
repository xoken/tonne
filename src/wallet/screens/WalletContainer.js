import React from 'react';
import { withRouter, Switch } from 'react-router-dom';
import { connect } from 'react-redux';
import PrivateRoute from '../../shared/components/privateRoute';
import WalletHeader from '../components/WalletHeader';
import AllpayContainer from '../../allpay/allpayContainer';
import WalletDashboard from './WalletDashboard';
import PartiallySignTransaction from '../../allpay/screens/PartiallySignTransaction';

class WalletContainer extends React.Component {
  render() {
    const { path } = this.props.match;
    return (
      <>
        <WalletHeader />
        <Switch>
          <PrivateRoute path={`${path}/dashboard`}>
            <WalletDashboard />
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
