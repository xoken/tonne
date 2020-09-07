import React from 'react';
import { Link, Route, Switch, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { List, Loader } from 'semantic-ui-react';
import ExistingWallet from './existingWallet';
import Login from './login';
import NewWallet from './newWallet';
import NoMatch from '../../shared/components/noMatch';
import PrivateRoute from '../../shared/components/privateRoute';
import PublicRoute from '../../shared/components/publicRoute';
import SendTransaction from '../components/sendTransaction';
import WalletDashboard from './walletDashboard';
import WalletPassword from './walletPassword';
import * as authActions from '../../auth/authActions';
import * as authSelectors from '../../auth/authSelectors';

class WalletHome extends React.Component {
  async componentDidMount() {
    const { dispatch } = this.props;
    dispatch(authActions.getProfiles());
  }

  onSelectProfile = profile => () => {
    const { dispatch } = this.props;
    dispatch(authActions.setProfile(profile));
    this.props.history.push('/wallet/login');
  };

  renderExistingProfile() {
    const { profiles } = this.props;
    if (profiles && profiles.length > 0) {
      return (
        <>
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
          <h5>OR</h5>
        </>
      );
    }
    return null;
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
      return (
        <>
          <div className='row'>
            <div className='col-sm-12'>{this.renderExistingProfile()}</div>
          </div>
          <div className='row'>
            <div className='col-sm-6'>
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
            <div className='col-sm-6'>
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

  render() {
    const { path } = this.props.match;
    return (
      <>
        <Switch>
          <PublicRoute path={`${path}/existing`} restricted={true}>
            <ExistingWallet />
          </PublicRoute>{' '}
          <PublicRoute path={`${path}/new`} restricted={true}>
            <NewWallet />
          </PublicRoute>
          <PublicRoute path={`${path}/login`} restricted={true}>
            <Login />
          </PublicRoute>
          <PublicRoute path={`${path}/password`} restricted={true}>
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
  profiles: authSelectors.getProfiles(state),
});

export default withRouter(connect(mapStateToProps)(WalletHome));
