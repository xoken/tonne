import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import "./shared/css/App.css";
import "./shared/css/address.css";
import "./shared/css/blockheight.css";
import "./shared/css/index.css";
import "./shared/css/mnemonic.css";
import "./shared/css/scripthash.css";
import "./shared/css/transaction.css";
import "./shared/css/wallet.css";
import App from "./App";
import * as serviceWorker from "./serviceWorker";
import configureStore from "./shared/store/configureStore";
const store = configureStore();

ReactDOM.render(
  <Provider store={store}>
    <React.StrictMode>
      <App />
    </React.StrictMode>
  </Provider>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
