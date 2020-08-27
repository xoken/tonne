import React from 'react';
import { Route, Redirect, useRouteMatch } from 'react-router-dom';
import { useSelector } from 'react-redux';
import * as walletSelectors from '../../wallet/walletSelectors';

export default function PrivateRoute({ children, ...rest }) {
  const isAuthenticated = useSelector(state =>
    walletSelectors.isAuthenticated(state)
  );

  const { path } = useRouteMatch();

  return (
    <Route
      {...rest}
      render={({ location }) => {
        if (isAuthenticated) {
          return children;
        } else {
          return (
            <Redirect
              to={{
                pathname: `${path}/login`,
                state: { from: location },
              }}
            />
          );
        }
      }}
    />
  );
}
