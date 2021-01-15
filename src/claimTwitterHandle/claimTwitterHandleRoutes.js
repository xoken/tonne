import React from 'react';
import PropTypes from 'prop-types';
import { Route, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { VerticalAnimatedSwitch } from '../shared/components/Animations';
import TwitterAuthentication from './screens/TwitterAuthentication';

export const claimTwitterHandlePaths = {
  twitterAuth: '/claim-twitter-handle/auth',
};

export const claimTwitterHandleFlows = {
  'claim-twitter-handle': [claimTwitterHandlePaths.twitterAuth],
};

const ClaimTwitterHandleComponent = props => {
  console.log(props);
  return (
    <div style={{ paddingLeft: 10 }}>
      <Route
        exact
        path={claimTwitterHandlePaths.twitterAuth}
        render={() => <TwitterAuthentication />}
      />
    </div>
  );
};

ClaimTwitterHandleComponent.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
};

export const ClaimTwitterHandleRoutes = withRouter(connect()(ClaimTwitterHandleComponent));
