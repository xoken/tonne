import React from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import * as walletActions from "../walletActions";
import * as walletSelectors from "../walletSelectors";

class NewPassword extends React.Component {
  constructor(props) {
    super(props);
    this.state = { password: "" };
    this.state = { confirmpass: "" };
    this.handleChangePass = this.handleChangePass.bind(this);
    this.handleChangeConfirmPass = this.handleChangeConfirmPass.bind(this);
    this.handleNext = this.handleNext.bind(this);
  }
  handleChangePass(event) {
    this.setState({ password: event.target.value });
  }
  handleChangeConfirmPass(event) {
    this.setState({ confirmpass: event.target.value });
  }
  handleNext(event) {
    const { dispatch } = this.props;
    const { password } = this.state.password;
    dispatch(walletActions.initWallet(password));
    this.props.history.push("/wallet/home");
    event.preventDefault();
  }
  render() {
    return (
      <>
        <div className="container nonheader">
          <div className="row">
            <div className="col-md-12 col-lg-12 centerall">
              <h5>Choose a password to encrypt your wallet keys.</h5>
              <h6 className="generalheadingscolor">
                Include alphabets, numbers and special characters in your
                password.
              </h6>
              <br />
              <form onSubmit={this.handleNext}>
                <div className="form-group">
                  <center>
                    <label>Password</label>
                    <input
                      type="password"
                      className="form-control passinputwidth"
                      id="password"
                      placeholder="Password"
                      value={this.state.password || ""}
                      onChange={this.handleChangePass}
                    />

                    <br />
                    <label>Confirm Password</label>
                    <input
                      type="password"
                      className="form-control passinputwidth"
                      id="password"
                      placeholder="Password"
                      value={this.state.confirmpass || ""}
                      onChange={this.handleChangeConfirmPass}
                    />
                  </center>
                </div>
                <DoesPassMatch
                  pass={this.state.password}
                  confirmpass={this.state.confirmpass}
                />
                <br /> <WeakPassCheck pass={this.state.password} />
              </form>
            </div>
          </div>
        </div>
      </>
    );
  }
}
function DoesPassMatch(props) {
  if (props.confirmpass != "") {
    if (props.pass != props.confirmpass) {
      return <div className="redalert">Passwords do not match.</div>;
    } else {
      return (
        <div>
          <input className="txbtn" type="submit" value="Next" />
          <div className="greenalert">Passwords matched!</div>
        </div>
      );
    }
  } else {
    return <i></i>;
  }
}
function WeakPassCheck(props) {
  var temp = "";
  if (props.pass == undefined) {
    temp = "";
  } else {
    temp = props.pass;
  }
  if (temp != "") {
    if (
      !/[~`!#$%\^&*+=\-\[\]\\';,/{}|\\":<>\?]/g.test(temp) ||
      temp.length < 6 ||
      !/\d/g.test(temp)
    ) {
      return <div className="redalert">Weak password!</div>;
    } else {
      return <i></i>;
    }
  } else {
    return <i></i>;
  }
}

NewPassword.propTypes = {
  dispatch: PropTypes.func.isRequired,
  isLoading: PropTypes.bool.isRequired
};

NewPassword.defaultProps = {};

const mapStateToProps = state => ({
  isLoading: walletSelectors.isLoading(state)
});

export default connect(mapStateToProps)(NewPassword);
