import React from 'react';
import { withRouter, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import * as authActions from '../../auth/authActions';
import * as authSelectors from '../../auth/authSelectors';
import { Button, Input, Grid, Header } from 'semantic-ui-react';

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
      this.props.onSuccess();
    } catch (error) {
      console.log(error);
      throw error;
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
            <Grid.Row>
              <Grid.Column textAlign='center'>
                <div className='greenalert'>Passwords matched!</div>
              </Grid.Column>
            </Grid.Row>
            <Grid.Row>
              <Grid.Column textAlign='center'>
                <Button className='coral'>Next</Button>
              </Grid.Column>
            </Grid.Row>
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
        return (
          <Grid.Row>
            <Grid.Column textAlign='center'>
              <div className='redalert'>Weak password!</div>
            </Grid.Column>
          </Grid.Row>
        );
      }
    }
    return null;
  }

  render() {
    const { bip39Mnemonic } = this.props;
    const { password, confirmPassword } = this.state;
    if (!bip39Mnemonic) {
      return <Redirect to='/wallet' />;
    } else {
      return (
        <Grid>
          <Grid.Row>
            <Grid.Column>
              <Header as='h5' className='generalheadingscolor' textAlign='center'>
                Choose a password to encrypt your wallet keys.
              </Header>
            </Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <Grid.Column>
              <Header as='h5' className='generalheadingscolor' textAlign='center'>
                Include alphabets, numbers and special characters in your password.
              </Header>
            </Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <Grid.Column>
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
                  {this.renderPasswordStrength()}
                  {this.renderPasswordMatchStatus()}
                </Grid>
              </form>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      );
    }
  }
}

WalletPassword.propTypes = {
  dispatch: PropTypes.func.isRequired,
  isLoading: PropTypes.bool.isRequired,
};

WalletPassword.defaultProps = {};

const mapStateToProps = state => ({
  isLoading: authSelectors.isLoading(state),
  bip39Mnemonic: authSelectors.getMnemonic(state),
});

export default withRouter(connect(mapStateToProps)(WalletPassword));