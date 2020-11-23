import React from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import * as authActions from '../../auth/authActions';
import * as authSelectors from '../../auth/authSelectors';
import { Button } from 'semantic-ui-react';

class WalletPassword extends React.Component {
  constructor(props) {
    super(props);
    this.state = { password: '', confirmPassword: '' };
  }

  handleNext = async event => {
    event.preventDefault();
    const { dispatch } = this.props;
    const { password } = this.state;
    try {
      await dispatch(authActions.createProfile(password));
      this.props.history.push('/wallet/dashboard');
    } catch (error) {
      console.log(error);
    }
  };

  renderPasswordMatchStatus() {
    const { password, confirmPassword } = this.state;
    if (confirmPassword) {
      if (password !== confirmPassword) {
        return <div className='redalert'>Passwords do not match.</div>;
      } else {
        return (
          <>
            <div className='form-group'>
              <Button className='txbtn'>Next</Button>
            </div>
            <div className='greenalert'>Passwords matched!</div>
          </>
        );
      }
    }
    return null;
  }

  renderPasswordStrength() {
    const { password } = this.state;
    if (password) {
      if (
        !/[~`!#$%^&*+=\-[\]\\';,/{}|\\":<>?]/g.test(password) ||
        password.length < 6 ||
        !/\d/g.test(password)
      ) {
        return <div className='redalert'>Weak password!</div>;
      }
    }
    return null;
  }

  render() {
    const { password, confirmPassword } = this.state;
    return (
      <div className='row'>
        <div className='col-md-12'>
          <center>
            <h5>Choose a password to encrypt your wallet keys.</h5>
            <h6 className='generalheadingscolor'>
              Include alphabets, numbers and special characters in your password.
            </h6>
            <form onSubmit={this.handleNext}>
              <div className='form-group'>
                <label>Password</label>
                <input
                  type='password'
                  id='password'
                  className='form-control passinputwidth'
                  placeholder='Password'
                  value={password}
                  onChange={event => this.setState({ password: event.target.value })}
                />
              </div>
              <div className='form-group'>
                <label>Confirm Password</label>
                <input
                  type='password'
                  id='confirmPassword'
                  className='form-control passinputwidth'
                  placeholder='Confirm Password'
                  value={confirmPassword}
                  onChange={event => this.setState({ confirmPassword: event.target.value })}
                />
              </div>
              <br />
              {this.renderPasswordMatchStatus()}
              <br />
              {this.renderPasswordStrength()}
            </form>
          </center>
        </div>
      </div>
    );
  }
}

WalletPassword.propTypes = {
  dispatch: PropTypes.func.isRequired,
  isLoading: PropTypes.bool.isRequired,
};

WalletPassword.defaultProps = {};

const mapStateToProps = state => ({
  isLoading: authSelectors.isLoading(state),
});

export default withRouter(connect(mapStateToProps)(WalletPassword));
