import React from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Grid } from 'semantic-ui-react';
import Login from '../components/Login';

class LoginScreen extends React.Component {
  onSuccess = () => {
    const {
      history,
      location: { pathname },
    } = this.props;
    if (pathname === '/mail/login') {
      history.push('/mail/dashboard');
    } else {
      history.push('/wallet/dashboard');
    }
  };

  render() {
    return (
      <Grid verticalAlign='middle' style={{ height: '100%' }}>
        <Grid.Row>
          <Grid.Column>
            <Login onSuccess={this.onSuccess} />
          </Grid.Column>
        </Grid.Row>
      </Grid>
    );
  }
}

LoginScreen.propTypes = {
  dispatch: PropTypes.func.isRequired,
};

LoginScreen.defaultProps = {};

const mapStateToProps = state => ({});

export default withRouter(connect(mapStateToProps)(LoginScreen));
