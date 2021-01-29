import React from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { utils } from 'allegory-allpay-sdk';
import WalletPassword from '../../wallet/components/WalletPassword';
import Login from '../../wallet/components/Login';
import * as claimTwitterHandleActions from '../claimTwitterHandleActions';
import * as allpayActions from '../../allpay/allpayActions';
import * as walletActions from '../../wallet/walletActions';

class WalletPasswordScreen extends React.Component {
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch(
      claimTwitterHandleActions.updateScreenProps({
        title: '',
        activeStep: 2,
      })
    );
  }

  onSuccess = async () => {
    try {
      const {
        user: { screen_name },
      } = this.props;
      if (screen_name) {
        if (screen_name.includes('/') || screen_name.includes('\\')) {
          console.log('\\ , / characters are not allowed');
        } else {
          try {
            const { dispatch } = this.props;
            await dispatch(walletActions.getTransactions({ limit: 10 }));
            const { isAvailable, name, uri } = await dispatch(
              allpayActions.getResellerURI([116, 119, 47].concat(utils.getCodePoint(screen_name)))
            );
            if (isAvailable) {
              const data = {
                uri,
                name,
                isProducer: false,
              };
              await dispatch(allpayActions.buyName(data));
              this.props.history.push('/wallet/allpay/confirm-purchase');
            }
          } catch (error) {
            console.log(error.message);
          }
        }
      } else {
        console.log('Twitter handle not found');
        this.props.history.push('/wallet');
      }
    } catch (error) {
      console.log(error);
    }
  };

  renderContent() {
    const {
      location: { search },
    } = this.props;
    const queryParams = new URLSearchParams(search);
    const profileId = queryParams.get('profile');
    if (profileId) {
      return <Login onSuccess={this.onSuccess} />;
    } else {
      return <WalletPassword onSuccess={this.onSuccess} />;
    }
  }

  render() {
    return this.renderContent();
  }
}
const mapStateToProps = state => ({
  user: state.twitter.user,
});

export default withRouter(connect(mapStateToProps)(WalletPasswordScreen));
