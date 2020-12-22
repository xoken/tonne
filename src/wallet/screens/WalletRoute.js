import React from 'react';
import PropTypes from 'prop-types';
import { Link, Route, Switch, withRouter } from 'react-router-dom';
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
import ProxyRegistration from '../../allpay/screens/ProxyRegistration';
import RenameProfile from '../components/RenameProfile';
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
    const { profile } = this.props;
    if (profile) {
      return (
        <div className='ui grid'>
          <div className='column'>
            <Dropdown
              button
              className='circular icon top left right floated profile'
              icon={null}
              text={profile ? profile.charAt(0) : ''}
              additionPosition='top'
              pointing>
              <Dropdown.Menu>
                <Dropdown.Item>
                  <Link to={`/wallet/dashboard`}>Wallet Dashboard</Link>
                </Dropdown.Item>
                <Dropdown.Item>
                  <Link to={`/wallet/allpay/search`}>Buy Allpay Name</Link>
                </Dropdown.Item>
                {/* <Dropdown.Item>
                  <Link to={`/wallet/allpay/proxy-providers`}>Register with Proxy</Link>
                </Dropdown.Item> */}
                <Dropdown.Item text='Rename Profile' onClick={this.toggleRenameProfileModal} />
                <Dropdown.Item text='Logout' onClick={this.onLogout} />
              </Dropdown.Menu>
            </Dropdown>
            <Dropdown
              button
              className='circular icon top left right floated profile'
              icon='bell outline'
              additionPosition='top'
              pointing>
              <Dropdown.Menu>
                <Dropdown.Item text='' />
              </Dropdown.Menu>
            </Dropdown>
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
          <PrivateRoute path={`${path}/allpay`}>
            <AllpayContainer />
          </PrivateRoute>
          <PublicRoute exact path={path}>
            <WalletHome />
            {/* <ProxyRegistration /> */}
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
