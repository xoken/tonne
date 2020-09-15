import React from 'react';
import { connect } from 'react-redux';
import { createBrowserHistory } from 'history';
import { HashRouter, Link, Route, Switch } from 'react-router-dom';
import ExplorerHome from './explorer/screens/ExplorerHome';
import Home from './shared/components/home';
import images from './shared/images';
import NoMatch from './shared/components/noMatch';
import WalletHome from './wallet/screens/WalletHome';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.history = createBrowserHistory();
    this.state = { clickedTab: '' };
  }
  walletClassName = '';
  explorerClassName = '';
  changeTabHighlight = prop => {
    if (prop === 'explorer' && prop !== '') {
      this.explorerClassName = prop + 'class';
    } else if (prop === 'wallet' && prop !== '') {
      this.walletClassName = prop + 'class';
    } else {
      this.explorerClassName = '';
      this.walletClassName = '';
    }
    this.setState({
      clickedTab: prop
    });
  };

  onBack = () => {
    this.history.goBack();
  };
  componentDidMount() {
    console.log(this.state.clickedTab + 'this.state.clickedTab');
  }
  componentDidUpdate(props) {
    console.log(this.state.clickedTab + 'this.state.clickedTab');
  }
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
            <Link
              to='/explorer'
              className={`navbar-brand ${this.explorerClassName}`}
              onClick={event =>
                this.setState({
                  clickedTab: 'explorer'
                })
              }>
              <img
                src={images.blockexplorerlogo}
                className='d-inline-block align-top headerblockexplorerlogo'
                alt=''
                loading='lazy'
              />
            </Link>
            <Link
              to='/wallet'
              className={`navbar-brand ${this.walletClassName}`}
              onClick={event =>
                this.setState({
                  clickedTab: 'wallet'
                })
              }>
              <img
                src={images.walletlogo}
                className='d-inline-block align-top headerwalletlogo'
                alt=''
                loading='lazy'
              />
            </Link>
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
