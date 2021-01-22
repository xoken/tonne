import React from 'react';
import PropTypes from 'prop-types';
import { NavLink, Route, Switch, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { Dropdown, Modal } from 'semantic-ui-react';
import ImportWallet from './ImportWallet';
import Login from './Login';
import NewWallet from './NewWallet';
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
import * as allpayActions from '../../allpay/allpayActions';
import { utils } from 'allegory-allpay-sdk';

class WalletRoute extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      renameProfileModal: false,
    };
  }

  onClaimTwitterHandle = () => {
    // toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no,
    const popup = window.open(
      'http://localhost:5000/v1/auth/twitter',
      'twitter-auth-window',
      'width=500, height=500, top=0, left=0'
    );
    window.addEventListener(
      'message',
      event => {
        if (event.origin !== 'http://localhost:3000') return;
        if (event.source.name === 'twitter-auth-window') {
          const queryParams = new URLSearchParams(event.data);
          const twitterHandle = queryParams.get('twitter_handle');
          const followerCount = queryParams.get('followers_count');
          this.checkBuy(twitterHandle);
          popup.close();
        }
      },
      false
    );
    // this.polling(popup);
  };

  async checkBuy(twitterHandle) {
    try {
      const { dispatch } = this.props;
      const { name, uri, protocol, isProducer } = await dispatch(
        allpayActions.getResellerURI([97, 112, 47].concat(utils.getCodePoint(twitterHandle)))
      );
      const host = 'localhost';
      const port = 9189;
      const data = {
        name,
        isProducer: false,
        host,
        port,
      };
      await dispatch(allpayActions.buyName(data));
      this.props.history.push('/wallet/allpay/confirm-purchase');
    } catch (error) {
      console.log(error);
    }
  }

  polling(popup) {
    const polling = setInterval(() => {
      if (!popup || popup.closed || popup.closed === undefined) {
        clearInterval(polling);
      }

      const closeDialog = () => {
        clearInterval(polling);
        popup.close();
      };

      try {
        if (popup.location.hostname.includes('localhost')) {
          if (popup.location.search) {
            const query = new URLSearchParams(popup.location.search);
            const oauthToken = query.get('oauth_token');
            const oauthVerifier = query.get('oauth_verifier');
            // closeDialog();
          } else {
            // closeDialog();
            console.log('OAuth redirect has occurred but no query parameters were found');
          }
        }
      } catch (error) {
        console.log(error);
      }
    }, 500);
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
            <span className='welcometext purplefontcolor'>{profile}</span>
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
            <NavLink
              className='buyallpaybutton'
              activeClassName='buyallpaybuttonactive'
              to={`/wallet/allpay/search`}>
              Buy AllPay Name
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
            <ImportWallet />
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
