import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import Router from './shared/components/Router';
import App from './App';
import configureStore from './shared/store/configureStore';
import { PersistGate } from 'redux-persist/integration/react';
import './shared/css/explorer.css';
import 'semantic-ui-css/semantic.min.css';
import './shared/css/main.css';

const { store, persistor } = configureStore();

const PersistComponent = persistor
  ? props => <PersistGate {...props} loading={null} persistor={persistor} />
  : React.Fragment;

ReactDOM.render(
  <Provider store={store}>
    <PersistComponent>
      {/* <React.StrictMode> */}
      <Router>
        <App />
      </Router>
      {/* </React.StrictMode> */}
    </PersistComponent>
  </Provider>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
