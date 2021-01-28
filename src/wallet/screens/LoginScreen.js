import React from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Grid } from 'semantic-ui-react';
import Login from '../components/Login';

class LoginScreen extends React.Component {
  onSuccess = () => {
    try {
      this.props.history.push('/wallet/dashboard');
    } catch (error) {
      console.log(error);
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
