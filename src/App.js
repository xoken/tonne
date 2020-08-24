import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { HashRouter, Route, Link, Switch } from 'react-router-dom';
import images from './shared/images';
import Login from './wallet/screens/login';
import Wallet from './wallet/screens/wallet';
import NewWallet from './wallet/screens/newWallet';
import ExistingWallet from './wallet/screens/existingWallet';
import WalletDashboard from './wallet/screens/walletDashboard';
import sendTransaction from './wallet/components/sendTransaction';
import WalletPassword from './wallet/screens/walletPassword';

class App extends React.Component {
  onBack = () => {
    // this.props.history.goBack();
  };

  render() {
    return (
      <HashRouter>
        <nav className="navbar navbar-expand-lg navbar-light">
          <Link to="/" id="logo" className="navbar-brand">
            <img
              src={images.logo}
              className="d-inline-block align-top"
              alt=""
              loading="lazy"
            />
          </Link>
          <button
            className="navbar-toggler"
            type="button"
            data-toggle="collapse"
            data-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav mr-auto"></ul>
            <form className="form-inline my-2 my-lg-0">
              <ul className="navbar-nav mr-auto">
                <li className="nav-item active">
                  <Link to="#" className="nav-link">
                    Contact <span className="sr-only">(current)</span>
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to="#" className="nav-link">
                    Help
                  </Link>
                </li>
              </ul>
            </form>
          </div>
        </nav>
        {/* <Switch> */}
        <div className="container nonheader">
          <Route exact path="/" component={Login} />
          <Route exact path="/wallet" component={Wallet} />
          <Route exact path="/wallet/password" component={WalletPassword} />
          <Route exact path="/wallet/new" component={NewWallet} />
          <Route exact path="/wallet/existing" component={ExistingWallet} />
          <Route exact path="/wallet/dashboard" component={WalletDashboard} />
          <Route exact path="/wallet/send" component={sendTransaction} />
          {/* </Switch> */}
          <button type="button" className="generalbtns" onClick={this.onBack}>
            Back
          </button>
        </div>
      </HashRouter>
    );
  }
}

export default connect()(App);
