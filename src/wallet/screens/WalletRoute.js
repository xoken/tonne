import React from 'react';
import { withRouter, NavLink, Route, Switch } from 'react-router-dom';
import { connect } from 'react-redux';
import { Dropdown, Modal, Grid } from 'semantic-ui-react';
import LoginScreen from './LoginScreen';
import ImportWalletScreen from './ImportWalletScreen';
import NewWalletScreen from './NewWalletScreen';
import PrivateRoute from '../../shared/components/privateRoute';
import PublicRoute from '../../shared/components/publicRoute';
import NoMatch from '../../shared/components/noMatch';
import SendTransaction from '../components/SendTransaction';
import WalletPasswordScreen from './WalletPasswordScreen';
import WalletHome from './WalletHome';
import WalletDashboard from './WalletDashboard';
import AllpayContainer from '../../allpay/allpayContainer';
import RenameProfile from '../components/RenameProfile';
import PartiallySignTransaction from '../../allpay/screens/PartiallySignTransaction';
import * as authActions from '../../auth/authActions';

class WalletRoute extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      renameProfileModal: false,
    };
  }

  onLogout = () => {
    const { dispatch } = this.props;
    dispatch(authActions.logout());
  };

  toggleRenameProfileModal = () => {
    const { renameProfileModal } = this.state;
    this.setState({ renameProfileModal: !renameProfileModal });
  };

  renderHeader() {
    const { profile, allpayHandles } = this.props;
    if (profile) {
      return (
        <Grid>
          <Grid.Row>
            <Grid.Column width={16}>
              {profile.screenName.substring(2, 3) === '/' ? (
                <span className='welcometext purplefontcolor'>{profile.screenName}</span>
              ) : (
                <span className='welcometext'>{profile.screenName}</span>
              )}
              <Dropdown
                button
                className='icon top left right floated coral button'
                icon={null}
                text='Options'
                additionPosition='top'
                pointing>
                <Dropdown.Menu>
                  <Dropdown.Item>
                    <NavLink
                      className='dropdownmenuitems'
                      to={`/wallet/dashboard`}
                      activeClassName='active'>
                      Wallet Dashboard
                    </NavLink>
                  </Dropdown.Item>
                  {/* <Dropdown.Item>
                    <NavLink
                      className='dropdownmenuitems'
                      to={`/wallet/allpay/search`}
                      activeClassName='active'>
                      Buy AllPay Name
                    </NavLink>
                  </Dropdown.Item>
                  <Dropdown.Item>
                    <NavLink
                      className='dropdownmenuitems'
                      to={`/wallet/allpay/register?progressTotalSteps=3&activeStep=1`}
                      activeClassName='active'>
                      Register with proxy
                    </NavLink>
                  </Dropdown.Item> */}
                  <Dropdown.Item
                    className='dropdownmenuitems'
                    text='Rename Profile'
                    onClick={this.toggleRenameProfileModal}
                  />
                  <Dropdown.Item className='logoutlink' text='Logout' onClick={this.onLogout} />
                </Dropdown.Menu>
              </Dropdown>
              {/* {allpayHandles && allpayHandles.length <= 0 && ( */}
              <NavLink
                className='buyallpaybutton'
                activeClassName='buyallpaybuttonactive'
                to={`/wallet/allpay/search`}>
                Buy AllPay Name
              </NavLink>
              {/* )} */}
              {/* <Dropdown
              button
              className='circular icon top left right floated profile'
              icon='bell outline'
              additionPosition='top'
              pointing>
              <Dropdown.Menu>
                <Dropdown.Item text='' />
              </Dropdown.Menu>
            </Dropdown> */}
            </Grid.Column>
          </Grid.Row>
        </Grid>
      );
    }
    return null;
  }

  renderRenameProfileModal() {
    const { renameProfileModal } = this.state;
    return (
      <Modal open={renameProfileModal}>
        <RenameProfile onClose={this.toggleRenameProfileModal} />
      </Modal>
    );
  }

  render() {
    const { path } = this.props.match;
    return (
      <>
        {this.renderHeader()}
        <Switch>
          <PublicRoute path={`${path}/existing`}>
            <ImportWalletScreen />
          </PublicRoute>{' '}
          <PublicRoute path={`${path}/new`}>
            <NewWalletScreen />
          </PublicRoute>
          <PublicRoute path={`${path}/login`}>
            <LoginScreen />
          </PublicRoute>
          <PublicRoute path={`${path}/password`}>
            <WalletPasswordScreen />
          </PublicRoute>
          <PrivateRoute path={`${path}/dashboard`}>
            <WalletDashboard />
          </PrivateRoute>
          <PrivateRoute path={`${path}/send`}>
            <SendTransaction />
          </PrivateRoute>
          <PrivateRoute path={`${path}/allpay/transaction`}>
            <PartiallySignTransaction />
          </PrivateRoute>
          <PrivateRoute path={`${path}/allpay`}>
            <AllpayContainer />
          </PrivateRoute>
          <PublicRoute exact path={path}>
            <WalletHome />
          </PublicRoute>
          <Route path='*'>
            <NoMatch />
          </Route>
        </Switch>
        {this.renderRenameProfileModal()}
      </>
    );
  }
}

WalletRoute.propTypes = {};

WalletRoute.defaultProps = {};

const mapStateToProps = state => ({
  profile: state.auth.profile,
  allpayHandles: state.wallet.allpayHandles,
});

export default withRouter(connect(mapStateToProps)(WalletRoute));
