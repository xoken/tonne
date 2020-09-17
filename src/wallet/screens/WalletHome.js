import React from 'react';
import { Link, Route, Switch, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { List, Loader } from 'semantic-ui-react';
import ExistingWallet from './ExistingWallet';
import Login from './Login';
import NewWallet from './NewWallet';
import NoMatch from '../../shared/components/noMatch';
import PrivateRoute from '../../shared/components/privateRoute';
import PublicRoute from '../../shared/components/publicRoute';
import SendTransaction from '../components/SendTransaction';
import WalletDashboard from './WalletDashboard';
import WalletPassword from './WalletPassword';
import * as authActions from '../../auth/authActions';
import * as authSelectors from '../../auth/authSelectors';

class WalletHome extends React.Component {
  async componentDidMount() {
    const { dispatch } = this.props;
    dispatch(authActions.getProfiles());
  }

  onSelectProfile = profile => () => {
    this.props.history.push(`/wallet/login?profile=${profile}`);
  };

  renderExistingProfile() {
    const { profiles } = this.props;
    if (profiles && profiles.length > 0) {
      return (
        <>
          <div class='ui placeholder segment'>
            <div class='ui two column very relaxed stackable grid'>
              <div class='column'>
                <div class='ui segment'>
                  <h5>Login to Existing Profile</h5>
                  <List selection verticalAlign='middle'>
                    {profiles.map((profile, index) => {
                      const { name } = profile;
                      return (
                        <List.Item key={index} onClick={this.onSelectProfile(name)}>
                          <List.Content>
                            <List.Header>{name}</List.Header>
                          </List.Content>
                        </List.Item>
                      );
                    })}
                  </List>
                </div>
              </div>
              <div class='middle aligned column'>
                <div class='ui segment'>
                  <div className='card text-center'>
                    <div className='card-body'>
                      <h5 className='card-title'>I already have a seed phrase</h5>
                      <p className='card-text'>
                        Import your existing wallet using a 12 word seed phrase
                      </p>
                      <Link to='/wallet/existing' className='generalbtns'>
                        Wallet
                      </Link>
                    </div>
                  </div>
                </div>
                <div class='ui segment'>
                  <div className='card text-center'>
                    <div className='card-body'>
                      <h5 className='card-title'>Yes, let's get set up!</h5>
                      <p className='card-text'>This will create a new wallet and seed phrase</p>
                      <Link to='/wallet/new' className='generalbtns'>
                        Create a Wallet
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class='ui vertical divider'>Or</div>
          </div>
        </>
      );
    } else {
      return (
        <>
          <div class='ui grid'>
            <div class='eight wide middle aligned column'>
              <div className='card text-center'>
                <div className='card-body'>
                  <h5 className='card-title'>I already have a seed phrase</h5>
                  <p className='card-text'>
                    Import your existing wallet using a 12 word seed phrase
                  </p>
                  <Link to='/wallet/existing' className='generalbtns'>
                    Wallet
                  </Link>
                </div>
              </div>
            </div>
            <div class='eight wide middle aligned column'>
              <div className='card text-center'>
                <div className='card-body'>
                  <h5 className='card-title'>Yes, let's get set up!</h5>
                  <p className='card-text'>This will create a new wallet and seed phrase</p>
                  <Link to='/wallet/new' className='generalbtns'>
                    Create a Wallet
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </>
      );
    }
  }

  renderContent() {
    const { isLoading, profile } = this.props;
    if (isLoading) {
      return (
        <Loader active size='massive'>
          Loading
        </Loader>
      );
    } else if (profile) {
      return <WalletDashboard />;
    } else {
      return <>{this.renderExistingProfile()}</>;
    }
  }

  render() {
    const { path } = this.props.match;
    return (
      <>
        <Switch>
          <PublicRoute path={`${path}/existing`}>
            <ExistingWallet />
          </PublicRoute>{' '}
          <PublicRoute path={`${path}/new`}>
            <NewWallet />
          </PublicRoute>
          <PublicRoute path={`${path}/login`}>
            <Login />
          </PublicRoute>
          <PublicRoute path={`${path}/password`}>
            <WalletPassword />
          </PublicRoute>
          <PrivateRoute path={`${path}/send`}>
            <SendTransaction />
          </PrivateRoute>
          <PrivateRoute exact path={path}>
            {this.renderContent()}
          </PrivateRoute>
          <Route path='*'>
            <NoMatch />
          </Route>
        </Switch>
      </>
    );
  }
}

const mapStateToProps = state => ({
  isLoading: authSelectors.isLoading(state),
  profile: authSelectors.getProfile(state),
  profiles: authSelectors.getProfiles(state)
});

export default withRouter(connect(mapStateToProps)(WalletHome));
