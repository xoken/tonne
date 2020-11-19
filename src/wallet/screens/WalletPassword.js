import React from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import * as authActions from '../../auth/authActions';
import * as authSelectors from '../../auth/authSelectors';
import { Button, Input, Grid } from 'semantic-ui-react';

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
    } catch (error) {}
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
            <h5 className='generalheadingscolor'>
              Include alphabets, numbers and special characters in your password.
            </h5>
          </center>
          <form onSubmit={this.handleNext}>
            <Grid centered>
              <Grid.Row>
                <Grid.Column width={2} verticalAlign='middle'>
                  <label>Password</label>
                </Grid.Column>
                <Grid.Column width={10}>
                  <Input
                    fluid
                    type='password'
                    id='password'
                    className='form-control'
                    placeholder='Password'
                    value={password}
                    onChange={event => this.setState({ password: event.target.value })}
                  />
                </Grid.Column>
              </Grid.Row>
              <Grid.Row>
                <Grid.Column width={2} verticalAlign='middle'>
                  <label>Confirm Password</label>
                </Grid.Column>
                <Grid.Column width={10}>
                  <Input
                    fluid
                    type='password'
                    id='confirmPassword'
                    className='form-control'
                    placeholder='Confirm Password'
                    value={confirmPassword}
                    onChange={event => this.setState({ confirmPassword: event.target.value })}
                  />
                </Grid.Column>
              </Grid.Row>
            </Grid>
            <br />
            <center>
              {this.renderPasswordMatchStatus()}
              <br />
              {this.renderPasswordStrength()}
            </center>
          </form>
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
