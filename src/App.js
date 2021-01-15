import React from 'react';
import { connect } from 'react-redux';
import { createBrowserHistory } from 'history';
import { HashRouter, Route, Switch } from 'react-router-dom';
import { Container } from 'semantic-ui-react';
import ExplorerHome from './explorer/screens/ExplorerHome';
import TwitterAuthSuccess from './auth/twitterAuthSuccess';
import Home from './shared/components/home';
import NoMatch from './shared/components/noMatch';
import SettingsScreen from './settings/screens/SettingsScreen';
import WalletRoute from './wallet/screens/WalletRoute';
import Header from './shared/components/Header';
import Footer from './shared/components/Footer';
import * as settingsActions from './settings/settingsActions';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.history = createBrowserHistory();
    const { sessionKey, dispatch } = this.props;
    if (!sessionKey) {
      dispatch(settingsActions.setDefaultConfig());
    } else {
      dispatch(settingsActions.initHttp());
    }
  }

  onBack = () => {
    this.history.goBack();
  };

  render() {
    return (
      <>
        <HashRouter>
          <Header />
          <main className='main'>
            <Container>
              <Switch>
                <Route path='/wallet'>
                  <WalletRoute />
                </Route>
                <Route path='/explorer'>
                  <ExplorerHome history={this.history} />
                </Route>
                <Route exact path='/'>
                  <Home />
                </Route>
                <Route exact path='/settings'>
                  <SettingsScreen />
                </Route>
                <Route exact path='/auth/success'>
                  <TwitterAuthSuccess />
                </Route>
                <Route path='*'>
                  <NoMatch />
                </Route>
              </Switch>
            </Container>
          </main>
          <Footer />
        </HashRouter>
      </>
    );
  }
}

const mapStateToProps = state => ({
  sessionKey: state.settings.sessionKey,
});

export default connect(mapStateToProps)(App);
