import React from 'react';
import { Route, Switch, useRouteMatch } from 'react-router-dom';
import ExplorerAddress from './ExplorerAddress';
import ExplorerBlockHeight from './ExplorerBlockHeight';
import ExplorerBlockHash from './ExplorerBlockHash';
import ExplorerTransaction from './ExplorerTransaction';
import ExplorerDashboard from './ExplorerDashboard';
import ExplorerSearch from '../components/ExplorerSearch';
import NoResultsFound from './NoResultsFound';
import NoMatch from '../../shared/components/noMatch';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function ExplorerHome(props) {
  const { path } = useRouteMatch();

  return (
    <>
      <ExplorerSearch />
      <div id='searchnegative'>
        <div className='backspc' id='back'></div>
        <Switch>
          <Route path={`${path}/blockheight/:blockheight/:txid`}>
            <ExplorerBlockHeight />
          </Route>
          <Route path={`${path}/blockhash/:blockhash/:txid`}>
            <ExplorerBlockHash />
          </Route>
          <Route path={`${path}/address/:address`}>
            <ExplorerAddress />
          </Route>
          <Route path={`${path}/transaction/:txid`}>
            <ExplorerTransaction />
          </Route>
          <Route path={`${path}/404`}>
            <NoResultsFound />
          </Route>
          <Route path={`${path}/:blockheight`}>
            <ExplorerDashboard />
          </Route>
          <Route exact path={`${path}`}>
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
