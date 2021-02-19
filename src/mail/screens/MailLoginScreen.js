import React from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Grid } from 'semantic-ui-react';
import Login from '../../wallet/components/Login';

class MailLoginScreen extends React.Component {
  onSuccess = () => {
    this.props.history.push('/mail/dashboard');
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

MailLoginScreen.propTypes = {
  dispatch: PropTypes.func.isRequired,
};

MailLoginScreen.defaultProps = {};

const mapStateToProps = state => ({});

export default withRouter(connect(mapStateToProps)(MailLoginScreen));
