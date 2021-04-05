import React from 'react';
import { withRouter, Switch } from 'react-router-dom';
import { connect } from 'react-redux';
import PrivateRoute from '../../shared/components/privateRoute';
import MailHeader from '../components/MailHeader';
import MailDashboard from './MailDashboard';

class MailContainer extends React.Component {
  render() {
    const { path } = this.props.match;
    return (
      <>
        <MailHeader />
        <Switch>
          <PrivateRoute path={`${path}/dashboard`}>
            <MailDashboard />
          </PrivateRoute>
        </Switch>
      </>
    );
  }
}

MailContainer.propTypes = {};

MailContainer.defaultProps = {};

const mapStateToProps = state => ({});

export default withRouter(connect(mapStateToProps)(MailContainer));
