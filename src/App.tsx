import React from "react";
import { BrowserRouter, Route, Link } from "react-router-dom";
import PasswordScreen from "./wallet/screens/PasswordScreen";
import Wallet from "./wallet/screens/Wallet";
import NewWallet from "./wallet/screens/NewWallet";
import ExistingWallet from "./wallet/screens/ExistingWallet";
import logo from "./shared/images/logo.png";
import WalletHome from "./wallet/screens/WalletHome";
import NewPassword from "./wallet/screens/NewPassword";
export default class App extends React.Component {
  render() {
    return (
      <BrowserRouter>
        <nav className="navbar navbar-expand-lg navbar-light">
          <Link to="#" id="logo" className="navbar-brand">
            <img
              src={logo}
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
        <Route exact path="/" component={PasswordScreen} />

        <Route exact path="/wallet" component={Wallet} />
        <Route exact path="/wallet/new" component={NewPassword} />
        <Route exact path="/wallet/existing" component={ExistingWallet} />
        <Route exact path="/wallet/home" component={WalletHome} />
      </BrowserRouter>
    );
  }
}
