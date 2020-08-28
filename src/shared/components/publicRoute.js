import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { useSelector } from 'react-redux';
import * as authSelectors from '../../auth/authSelectors';

export default function PublicRoute({ children, restricted, ...rest }) {
  const isAuthenticated = useSelector(state => authSelectors.isAuthenticated(state));

  return (
    <Route
      {...rest}
      render={() => {
        if (isAuthenticated && restricted) {
          return <Redirect to='/wallet' />;
        } else {
          return children;
        }
      }}
    />
  );
}
