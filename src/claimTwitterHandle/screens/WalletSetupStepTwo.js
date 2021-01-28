import React from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { utils } from 'allegory-allpay-sdk';
import WalletPassword from '../../wallet/components/WalletPassword';
import Login from '../../wallet/components/Login';
import * as claimTwitterHandleActions from '../claimTwitterHandleActions';
import * as allpayActions from '../../allpay/allpayActions';
import * as walletActions from '../../wallet/walletActions';

class WalletSetupStepTwo extends React.Component {
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
      const { screenName } = this.props;
      if (screenName) {
        if (screenName.includes('/') || screenName.includes('\\')) {
          console.log('\\ , / characters are not allowed');
        } else {
          try {
            const { dispatch } = this.props;
            await dispatch(walletActions.getTransactions({ limit: 10 }));
            const { isAvailable, name, uri } = await dispatch(
              allpayActions.getResellerURI([116, 119, 47].concat(utils.getCodePoint(screenName)))
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
  screenName: state.twitter.screenName,
});

export default withRouter(connect(mapStateToProps)(WalletSetupStepTwo));
