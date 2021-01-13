import React from 'react';
import PropTypes from 'prop-types';
import { NavLink, Route, Switch, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { Dropdown, Modal } from 'semantic-ui-react';
import ExistingWallet from './ExistingWallet';
import Login from './Login';
import NewWallet from './NewWallet';
import NoMatch from '../../shared/components/noMatch';
import PrivateRoute from '../../shared/components/privateRoute';
import PublicRoute from '../../shared/components/publicRoute';
import SendTransaction from '../components/SendTransaction';
import WalletPassword from './WalletPassword';
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
    const { profile, location } = this.props;
    if (profile) {
      return (
        <div className='ui grid'>
          <div className='column'>
            <span className='welcometext purplefontcolor'>
              {profile && location.pathname === '/wallet/dashboard' ? (
                <b>Welcome, {profile ? profile : ''}</b>
              ) : (
                ''
              )}
            </span>
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
                <Dropdown.Item>
                  <NavLink
                    className='dropdownmenuitems'
                    to={`/wallet/allpay/search`}
                    activeClassName='active'>
                    Buy Allpay Name
                  </NavLink>
                </Dropdown.Item>
                <Dropdown.Item>
                  <NavLink
                    className='dropdownmenuitems'
                    to={`/wallet/allpay/register?progressTotalSteps=3&activeStep=1`}
                    activeClassName='active'>
                    Register with Proxy
                  </NavLink>
                </Dropdown.Item>
                <Dropdown.Item
                  className='dropdownmenuitems'
                  text='Rename Profile'
                  onClick={this.toggleRenameProfileModal}
                />
                <Dropdown.Item className='logoutlink' text='Logout' onClick={this.onLogout} />
              </Dropdown.Menu>
            </Dropdown>
            <NavLink
              className='buyallpaybutton'
              activeClassName='buyallpaybuttonactive'
              to={`/wallet/allpay/search`}>
              Buy Allpay Name
            </NavLink>
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
          </div>
        </div>
      );
    }
    return null;
  }

  renderRenameProfileModal() {
    const { renameProfileModal } = this.state;
    return (
      <Modal open={renameProfileModal}>
        <RenameProfile onClose={this.toggleRenameProfileModal} onLogout={this.onLogout} />
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

WalletRoute.propTypes = {
  profile: PropTypes.string,
};

WalletRoute.defaultProps = {};

const mapStateToProps = state => ({
  profile: state.auth.profile,
});

export default withRouter(connect(mapStateToProps)(WalletRoute));
