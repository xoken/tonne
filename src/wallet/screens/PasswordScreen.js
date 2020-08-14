import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import * as walletActions from '../walletActions';
import * as walletSelectors from '../walletSelectors';

class PasswordScreen extends React.Component {
  checkForExistingUser = () => {
    if (localStorage.getItem('mnemonic') === undefined) {
      this.props.history.push('/wallet');
    }
  };

  onContinue = () => {
    const { dispatch } = this.props;
    dispatch(walletActions.initWallet());
    this.props.history.push('/wallet/home');
  };

  render() {
    // this.checkForExistingUser();
    return (
      <>
        <div className="container nonheader">
          <div className="row">
            <div className="col-md-12 col-lg-12 centerall">
              <div className="form-group">
                <label>
                  Your wallet is encrypted with a password. Please enter your
                  password to unlock it.
                </label>
                <label>Password</label>
                <input
                  type="password"
                  className="form-control"
                  id="password"
                  placeholder="Password"
                />
              </div>
              <div className="txbtn" onClick={this.onContinue}>
                Continue
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }
}

PasswordScreen.propTypes = {
  dispatch: PropTypes.func.isRequired,
  isLoading: PropTypes.bool.isRequired,
};

PasswordScreen.defaultProps = {};

const mapStateToProps = (state) => ({
  isLoading: walletSelectors.isLoading(state),
});

export default connect(mapStateToProps)(PasswordScreen);
