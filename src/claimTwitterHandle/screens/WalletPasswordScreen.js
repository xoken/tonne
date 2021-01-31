import React from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import WalletPassword from '../../wallet/components/WalletPassword';
import Login from '../../wallet/components/Login';
import * as claimTwitterHandleActions from '../claimTwitterHandleActions';

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
    this.props.history.push('/claim-twitter-handle/home');
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
