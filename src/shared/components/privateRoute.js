import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
// import * as walletSelectors from '../walletSelectors';

class PrivateRoute {
  render() {
    const { isAuthenticated, children, ...rest } = this.props;
    debugger;
    return (
      <Route
        {...rest}
        render={({ location }) => {
          return isAuthenticated ? (
            children
          ) : (
            <Redirect
              to={{
                pathname: '/login',
                state: { from: location },
              }}
            />
          );
        }}
      />
    );
  }
}

PrivateRoute.propTypes = {
  dispatch: PropTypes.func.isRequired,
};

PrivateRoute.defaultProps = {};

const mapStateToProps = (state) => ({
  isAuthenticated: true,
});

export default connect(mapStateToProps)(PrivateRoute);
