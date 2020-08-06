import React from 'react';
import { BrowserRouter, Route, Link } from 'react-router-dom';
import Login from './Login';
import logo from './images/logo.png';
export default class App extends React.Component {
  componentDidMount() {
    // this.addScript('./scripts/index.js');
    // this.addScript('./scripts/credentials.js');
    // this.addScript('./scripts/auth.js');
    // this.addScript('./scripts/httpsreq.js');
    // this.addScript('./scripts/address.js');
    // this.addScript('./scripts/transaction.js');
    // this.addScript('./scripts/blockheight.js');
    // this.addScript('./scripts/mnemonic.js');
    // this.addScript('./scripts/search.js');
    // this.addScript('./scripts/wallet.js');
  }

  // addScript(scriptSrc: string) {
  //   const script = document.createElement('script');
  //   script.src = scriptSrc;
  //   document.body.appendChild(script);
  // }

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
        <Route path="/">
          <Login />
        </Route>
      </BrowserRouter>
    );
  }
}
