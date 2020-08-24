import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import * as walletActions from '../walletActions';
import * as walletSelectors from '../walletSelectors';

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = { passphrase: '', error: '' };
  }

  componentDidMount() {
    const { bip39Mnemonic } = this.props;
    if (!bip39Mnemonic) {
      this.props.history.push('/wallet');
    }
  }

  handleContinue = async (event) => {
    event.preventDefault();
    const { dispatch } = this.props;
    const { passphrase } = this.state;
    if (passphrase) {
      const result = await dispatch(
        walletActions.loginWithPassphrase(passphrase)
      );
      if (result) {
        this.props.history.push('/wallet/dashboard');
      } else {
        this.setState({ error: 'Wrong Password' });
      }
    }
  };

  render() {
    const { passphrase, error } = this.state;
    return (
      <>
        <div className="row">
          <div className="col-md-12 col-lg-12 centerall">
            <center>
              <form onSubmit={this.handleContinue}>
                <div className="form-group">
                  <label>
                    Your wallet is encrypted with a password. Please enter your
                    password to unlock it.
                  </label>
                  <label>Password</label>
                  <input
                    type="password"
                    className="form-control passinputwidth"
                    id="password"
                    placeholder="Password"
                    value={passphrase}
                    onChange={(event) =>
                      this.setState({
                        passphrase: event.target.value,
                        error: '',
                      })
                    }
                  />
                  {error && (
                    <div class="invalid-feedback" style={{ display: 'block' }}>
                      {error}
                    </div>
                  )}
                </div>
                <button
                  type="submit"
                  className="txbtn"
                  disabled={error ? true : false}
                >
                  Continue
                </button>
              </form>
            </center>
          </div>
        </div>
      </>
    );
  }
}

Login.propTypes = {
  dispatch: PropTypes.func.isRequired,
  isLoading: PropTypes.bool.isRequired,
  bip39Mnemonic: PropTypes.string.isRequired,
};

Login.defaultProps = {};

const mapStateToProps = (state) => ({
  isLoading: walletSelectors.isLoading(state),
  bip39Mnemonic: walletSelectors.getMnemonic(state),
});

export default connect(mapStateToProps)(Login);
