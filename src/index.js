import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import './shared/css/App.css';
import './shared/css/address.css';
import './shared/css/blockheight.css';
import './shared/css/index.css';
import './shared/css/mnemonic.css';
import './shared/css/scripthash.css';
import './shared/css/transaction.css';
import './shared/css/wallet.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import configureStore from './shared/store/configureStore';
import { PersistGate } from 'redux-persist/integration/react';
import { wallet } from 'nipkow-sdk';

const { store, persistor } = configureStore();

const PersistComponent = persistor
  ? props => <PersistGate {...props} loading={null} persistor={persistor} />
  : React.Fragment;

wallet.init();

ReactDOM.render(
  <Provider store={store}>
    <PersistComponent>
      <React.StrictMode>
        <App />
      </React.StrictMode>
    </PersistComponent>
  </Provider>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
