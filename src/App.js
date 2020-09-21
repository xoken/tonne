import React from 'react';
import { connect } from 'react-redux';
import { createBrowserHistory } from 'history';
import { HashRouter, NavLink, Link, Route, Switch } from 'react-router-dom';
import ExplorerHome from './explorer/screens/ExplorerHome';
import { Menu } from 'semantic-ui-react';
import Home from './shared/components/home';
import images from './shared/images';
import NoMatch from './shared/components/noMatch';
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
        <nav className='navbar navbar-expand-lg navbar-light'>
          <Link to='/' id='logo' className='navbar-brand'>
            <img src={images.logo} className='d-inline-block align-top' alt='' loading='lazy' />
          </Link>
          <div className='cen'>
            <NavLink to='/explorer' activeClassName='activetab' className='navbar-brand'>
              <img
                src={images.blockexplorerlogo}
                className='d-inline-block align-top headerlogos'
                alt=''
                loading='lazy'
              />
            </NavLink>
            <NavLink to='/wallet' activeClassName='activetab' className='navbar-brand'>
              <img
                src={images.walletlogo}
                className='d-inline-block align-top headerlogos'
                alt=''
                loading='lazy'
              />
            </NavLink>
          </div>
        </nav>
        <div className='container main-container'>
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
            <Route path='*'>
              <NoMatch />
            </Route>
          </Switch>
        </div>
        <div className='container'>
          <div className='row'>
            <div className='col-md-12'>
              <button type='button' className='generalbtns' onClick={this.onBack}>
                Back
              </button>
            </div>
          </div>
        </div>
      </HashRouter>
    );
  }
}

export default connect()(App);
