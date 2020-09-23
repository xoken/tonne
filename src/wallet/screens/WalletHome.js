import React from 'react';
import { Link, Route, Switch, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { Divider, Grid, Header, List, Loader, Segment } from 'semantic-ui-react';
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
    localStorage.setItem('currentprofile', profile);
    this.props.history.push(`/wallet/login?profile=${profile}`);
  };

  renderExistingProfile() {
    const { profiles } = this.props;
    return (
      <Segment placeholder>
        <Grid columns={2} textAlign='center'>
          {profiles && profiles.length > 0 && (
            <Grid.Column>
              <Header>Login to Existing Profile</Header>
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
            </Grid.Column>
          )}
          <Grid.Column>
            <Grid.Row style={styles.row}>
              <Grid.Column>
                <Header>I already have a seed phrase</Header>
                <p>Import your existing wallet using a 12 word seed phrase</p>
                <Link to='/wallet/existing' className='ui yellow button'>
                  Existing Wallet
                </Link>
              </Grid.Column>
            </Grid.Row>
            <Divider horizontal>Or</Divider>
            <Grid.Row style={styles.row}>
              <Grid.Column>
                <Header>Yes, let's get set up!</Header>
                <p>This will create a new wallet and seed phrase</p>
                <Link to='/wallet/new' className='ui yellow button'>
                  Create a Wallet
                </Link>
              </Grid.Column>
            </Grid.Row>
          </Grid.Column>
        </Grid>
        {profiles && profiles.length > 0 && <Divider vertical>Or</Divider>}
      </Segment>
    );
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
    );
  }
}

const styles = {
  row: {
    display: 'block',
    flexWrap: 'nowrap',
    marginRight: '-15',
    marginLeft: '-15',
  },
};
const mapStateToProps = state => ({
  isLoading: authSelectors.isLoading(state),
  profile: authSelectors.getProfile(state),
  profiles: authSelectors.getProfiles(state),
});

export default withRouter(connect(mapStateToProps)(WalletHome));
