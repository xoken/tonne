import React from 'react';
import { connect } from 'react-redux';
import { createBrowserHistory } from 'history';
import { HashRouter, Link, Route, Switch } from 'react-router-dom';
import ExplorerHome from './explorer/screens/explorerHome';
import Home from './shared/components/home';
import images from './shared/images';
import NoMatch from './shared/components/noMatch';
import WalletHome from './wallet/screens/walletHome';

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
        <nav className='navbar navbar-expand-lg navbar-light'>
          <Link to='/' id='logo' className='navbar-brand'>
            <img src={images.logo} className='d-inline-block align-top' alt='' loading='lazy' />
          </Link>
          <button
            className='navbar-toggler'
            type='button'
            data-toggle='collapse'
            data-target='#navbarSupportedContent'
            aria-controls='navbarSupportedContent'
            aria-expanded='false'
            aria-label='Toggle navigation'>
            <span className='navbar-toggler-icon'></span>
          </button>
          <div className='collapse navbar-collapse' id='navbarSupportedContent'>
            <ul className='navbar-nav mr-auto'></ul>
            <form className='form-inline my-2 my-lg-0'>
              <ul className='navbar-nav mr-auto'>
                <li className='nav-item active'>
                  <Link to='#' className='nav-link'>
                    Contact <span className='sr-only'>(current)</span>
                  </Link>
                </li>
                <li className='nav-item'>
                  <Link to='#' className='nav-link'>
                    Help
                  </Link>
                </li>
              </ul>
            </form>
          </div>
        </nav>
        <div className='container nonheader'>
          <div style={{ minHeight: 450 }}>
            <Switch>
              <Route path='/wallet'>
                <WalletHome />
              </Route>
              <Route path='/explorer'>
                <ExplorerHome />
              </Route>
              <Route exact path='/'>
                <Home />
              </Route>
              <Route path='*'>
                <NoMatch />
              </Route>
            </Switch>
          </div>
          <button type='button' className='generalbtns' onClick={this.onBack}>
            Back
          </button>
        </div>
      </HashRouter>
    );
  }
}

export default connect()(App);
