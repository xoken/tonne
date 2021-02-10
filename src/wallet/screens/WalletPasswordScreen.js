import React from 'react';
import { withRouter, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Grid } from 'semantic-ui-react';
import WalletPassword from '../components/WalletPassword';
import * as authSelectors from '../../auth/authSelectors';

class WalletPasswordScreen extends React.Component {
  onSuccess = () => {
    this.props.history.push('/wallet/dashboard');
  };

  render() {
    const { bip39Mnemonic, profile } = this.props;
    if (!bip39Mnemonic && !profile) {
      return <Redirect to='/wallet' />;
    } else {
      return (
        <Grid verticalAlign='middle' style={{ height: '100%' }}>
          <Grid.Row>
            <Grid.Column>
              <WalletPassword onSuccess={this.onSuccess} />
            </Grid.Column>
          </Grid.Row>
        </Grid>
      );
    }
  }
}

WalletPasswordScreen.propTypes = {
  dispatch: PropTypes.func.isRequired,
};

WalletPasswordScreen.defaultProps = {};

const mapStateToProps = state => ({
  bip39Mnemonic: authSelectors.getMnemonic(state),
  profile: state.auth.profile,
});

export default withRouter(connect(mapStateToProps)(WalletPasswordScreen));
