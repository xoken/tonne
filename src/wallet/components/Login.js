import React from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import * as authActions from '../../auth/authActions';
import { Button, Form, Grid, Input } from 'semantic-ui-react';

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = { password: '', error: '' };
  }

  handleContinue = async event => {
    event.preventDefault();
    const {
      dispatch,
      location: { search },
    } = this.props;
    const { password } = this.state;
    if (password) {
      const queryParams = new URLSearchParams(search);
      const profileId = queryParams.get('profile');
      try {
        await dispatch(authActions.login(profileId, password));
        this.props.onSuccess();
      } catch (error) {
        // console.log(JSON.stringify(error.message));
        //this.setState({ error: error.message });
        this.setState({ error: 'Login error: Enter correct password.' });
      }
    }
  };

  render() {
    const { password, error } = this.state;
    return (
      <Grid>
        <Grid.Row>
          <Grid.Column textAlign='center'>
            <Form onSubmit={this.handleContinue}>
              <Form.Field>
                <h4 className='purplefontcolor'>
                  Your wallet is encrypted with a password. Please enter your password to unlock it.
                </h4>
              </Form.Field>
              <Form.Field>
                <Input
                  type='password'
                  className='form-control passinputwidth'
                  id='password'
                  placeholder='Password'
                  value={password}
                  maxLength='50'
                  onChange={event =>
                    this.setState({
                      password: event.target.value,
                      error: '',
                    })
                  }
                />
                {error && (
                  <div className='redalert' style={{ display: 'block' }}>
                    {error}
                  </div>
                )}
              </Form.Field>
              <Form.Field>
                <Button className='coral' disabled={error ? true : false}>
                  Continue
                </Button>
              </Form.Field>
            </Form>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    );
  }
}

Login.propTypes = {
  dispatch: PropTypes.func.isRequired,
};

Login.defaultProps = {};

const mapStateToProps = state => ({});

export default withRouter(connect(mapStateToProps)(Login));
