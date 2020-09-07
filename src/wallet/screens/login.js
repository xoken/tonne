import React from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import * as authActions from '../../auth/authActions';
import * as authSelectors from '../../auth/authSelectors';

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = { password: '', error: '' };
  }

  handleContinue = async event => {
    event.preventDefault();
    const { dispatch } = this.props;
    const { password } = this.state;
    if (password) {
      const result = await dispatch(authActions.login(password));
      if (!result) {
        this.setState({ error: 'Wrong Password' });
      }
    }
  };

  render() {
    const { password, error } = this.state;
    return (
      <>
        <div className='row'>
          <div className='col-md-12 col-lg-12 centerall'>
            <center>
              <form onSubmit={this.handleContinue}>
                <div className='form-group'>
                  <label>
                    Your wallet is encrypted with a password. Please enter your password to unlock
                    it.
                  </label>
                  <label>Password</label>
                  <input
                    type='password'
                    className='form-control passinputwidth'
                    id='password'
                    placeholder='Password'
                    value={password}
                    onChange={event =>
                      this.setState({
                        password: event.target.value,
                        error: '',
                      })
                    }
                  />
                  {error && (
                    <div className='invalid-feedback' style={{ display: 'block' }}>
                      {error}
                    </div>
                  )}
                </div>
                <button type='submit' className='txbtn' disabled={error ? true : false}>
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
};

Login.defaultProps = {};

const mapStateToProps = state => ({
  isLoading: authSelectors.isLoading(state),
});

export default withRouter(connect(mapStateToProps)(Login));
