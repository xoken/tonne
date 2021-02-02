import React from 'react';
import { connect } from 'react-redux';
import { withRouter, Route, Switch } from 'react-router-dom';
import { Container } from 'semantic-ui-react';
import ExplorerHome from './explorer/screens/ExplorerHome';
import Downloads from './downloads/screens/Downloads';
import Home from './shared/components/home';
import NoMatch from './shared/components/noMatch';
import SettingsScreen from './settings/screens/SettingsScreen';
import WalletRoute from './wallet/screens/WalletRoute';
import Header from './shared/components/Header';
import Footer from './shared/components/Footer';
import TwitterAuthSuccess from './claimTwitterHandle/screens/TwitterAuthSuccess';
import ClaimTwitterHandleContainer from './claimTwitterHandle/claimTwitterHandleContainer';
import * as settingsActions from './settings/settingsActions';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoaded: false,
    };
  }

  async componentDidMount() {
    const { dispatch } = this.props;
    try {
      const isLoaded = await dispatch(settingsActions.setConfig());
      this.setState({ isLoaded });
    } catch (error) {
      console.log(error);
    }
  }

  render() {
    if (this.state.isLoaded) {
      return (
        <>
          {this.props.location.pathname !== '/auth/success' && <Header />}
          <main className='main'>
            <Container>
              <Switch>
                <Route path='/wallet'>
                  <WalletRoute />
                </Route>
                <Route path='/explorer'>
                  <ExplorerHome />
                </Route>
                <Route exact path='/'>
                  <Home />
                </Route>
                <Route exact path='/settings'>
                  <SettingsScreen />
                </Route>
                <Route path='/downloads'>
                  <Downloads />
                </Route>
                <Route exact path='/auth/success'>
                  <TwitterAuthSuccess />
                </Route>
                <Route path='/claim-twitter-handle'>
                  <ClaimTwitterHandleContainer />
                </Route>
                <Route path='*'>
                  <NoMatch />
                </Route>
              </Switch>
              {this.props.location.pathname !== '/auth/success' && <Footer />}
            </Container>
          </main>
        </>
      );
    } else {
      return null;
    }
  }
}

const mapStateToProps = state => ({
  token: state.settings.token,
});

export default withRouter(connect(mapStateToProps)(App));
