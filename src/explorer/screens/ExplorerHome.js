import React from 'react';
import { Route, Switch, useRouteMatch } from 'react-router-dom';
import ExplorerAddress from './ExplorerAddress';
import ExplorerBlockHeight from './ExplorerBlockHeight';
import ExplorerTransaction from './ExplorerTransaction';
import ExplorerDashboard from './ExplorerDashboard';
import NoMatch from '../../shared/components/noMatch';

export default function ExplorerHome() {
  const { path } = useRouteMatch();
  return (
    <>
      <div id='searchnegative'>
        <div className='backspc' id='back'></div>
        <Switch>
          <Route path={`${path}/blockheight-blockhash`}>
            <ExplorerBlockHeight />
          </Route>
          <Route path={`${path}/address`}>
            <ExplorerAddress />
          </Route>
          <Route path={`${path}/transaction`}>
            <ExplorerTransaction />
          </Route>
          <Route exact path={path}>
            <ExplorerDashboard />
          </Route>
          <Route path='*'>
            <NoMatch />
          </Route>
        </Switch>
      </div>
    </>
  );
}
