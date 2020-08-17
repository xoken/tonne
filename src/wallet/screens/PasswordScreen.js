import React from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import * as walletActions from "../walletActions";
import * as walletSelectors from "../walletSelectors";

class PasswordScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = { password: "" };
    this.handleChange = this.handleChange.bind(this);
    this.handleContinue = this.handleContinue.bind(this);
  }
  checkForExistingUser = () => {
    if (localStorage.getItem("mnemonic") === null) {
      this.props.history.push("/wallet");
    }
  };

  handleChange(event) {
    this.setState({ value: event.target.value });
  }

  handleContinue(event) {
    const { dispatch } = this.props;
    const { password } = this.state.password;
    dispatch(walletActions.initWallet(password));
    this.props.history.push("/wallet/home");
    event.preventDefault();
  }

  render() {
    this.checkForExistingUser();
    return (
      <>
        <div className="container nonheader">
          <div className="row">
            <div className="col-md-12 col-lg-12 centerall">
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
                    value={this.state.value}
                    onChange={this.handleChange}
                  />
                </div>
                <input className="txbtn" type="submit" value="Continue" />
              </form>
            </div>
          </div>
        </div>
      </>
    );
  }
}

PasswordScreen.propTypes = {
  dispatch: PropTypes.func.isRequired,
  isLoading: PropTypes.bool.isRequired
};

PasswordScreen.defaultProps = {};

const mapStateToProps = state => ({
  isLoading: walletSelectors.isLoading(state)
});

export default connect(mapStateToProps)(PasswordScreen);
