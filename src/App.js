import React from 'react';
import { connect } from 'react-redux';
import { createBrowserHistory } from 'history';
import { HashRouter, NavLink, Link, Route, Switch } from 'react-router-dom';
import { Button, Icon } from 'semantic-ui-react';
import ExplorerHome from './explorer/screens/ExplorerHome';
import Home from './shared/components/home';
import images from './shared/images';
import NoMatch from './shared/components/noMatch';
import SettingsScreen from './settings/screens/SettingsScreen';
import WalletHome from './wallet/screens/WalletHome';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.history = createBrowserHistory();
  }

  onBack = () => {
    this.history.goBack();
  };

  render() {
    return (
      <HashRouter>
        {
          // <div className='titlecontainer'>
          //   <div className='title'>Nipkow</div>
          //   <div className='titlebarbtnscontainer'>
          //     <button className='minimize'>-</button>
          //     <button className='maximize'>&#9744;</button>
          //     <button className='closeapp'>x</button>
          //   </div>
          // </div>
        }
        <div className='ui container'>
          <div className='ui secondary labeled icon menu'>
            <div className='header item'>
              <Link to='/' className='' style={{ display: 'block' }}>
                <img
                  src={images.logo}
                  className=''
                  style={{ display: 'block', width: 150 }}
                  alt='Xoken'
                  loading='lazy'
                />
              </Link>
            </div>
            <div className='right menu'>
              <NavLink to='/explorer' activeClassName='active' className='item'>
                <Icon name='wpexplorer' />
                Explorer
              </NavLink>
              <NavLink to='/wallet' activeClassName='active' className='item'>
                <Icon name='google wallet' />
                Wallet
              </NavLink>
              <NavLink to='/settings' className='ui item'>
                <Icon name='setting' />
                Settings
              </NavLink>
            </div>
          </div>
          <Switch>
            <Route path='/wallet'>
              <WalletHome changeTabHighlight={this.changeTabHighlight} />
            </Route>
            <Route path='/explorer'>
              <ExplorerHome changeTabHighlight={this.changeTabHighlight} history={this.history} />
            </Route>
            <Route exact path='/'>
              <Home changeTabHighlight={this.changeTabHighlight} />
            </Route>
            <Route exact path='/settings'>
              <SettingsScreen />
            </Route>
            <Route path='*'>
              <NoMatch />
            </Route>
          </Switch>
          {/* <div className='row'>
            <Button onClick={this.onBack}>Back</Button>
          </div> */}
        </div>
      </HashRouter>
    );
  }
}

export default connect()(App);
