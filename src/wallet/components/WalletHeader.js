import React from 'react';
import { withRouter, NavLink } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Button, Dropdown, Grid, Message, Modal } from 'semantic-ui-react';
import RenameProfile from '../components/RenameProfile';
import * as authActions from '../../auth/authActions';
import * as walletActions from '../walletActions';

class WalletHeader extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      renameProfileModal: false,
      messageModal: false,
    };
  }

  onLogout = () => {
    const { dispatch } = this.props;
    dispatch(authActions.logout());
  };

  onBuyAllpayName = () => {
    const { balance } = this.props;
    if (balance > 10000) {
      this.props.history.push('/wallet/allpay/search');
    } else {
      this.setState({ messageModal: true });
    }
  };

  onViewDepositAddress = () => {
    this.setState({ messageModal: false });
    const { dispatch } = this.props;
    dispatch(walletActions.showReceiveModal());
  };

  toggleMessageModal = () => {
    const { messageModal } = this.state;
    this.setState({ messageModal: !messageModal });
  };

  toggleRenameProfileModal = () => {
    const { renameProfileModal } = this.state;
    this.setState({ renameProfileModal: !renameProfileModal });
  };

  renderRenameProfileModal() {
    const { renameProfileModal } = this.state;
    return (
      <Modal open={renameProfileModal}>
        <RenameProfile onClose={this.toggleRenameProfileModal} />
      </Modal>
    );
  }

  renderMessageModal() {
    const { messageModal } = this.state;
    return (
      <Modal open={messageModal} size='tiny' closeOnDimmerClick={true} closeOnEscape={true}>
        <Modal.Content>
          <Modal.Description>
            <Grid centered>
              <Grid.Row>
                <Grid.Column>
                  <Message className='transparent modal-message'>
                    <p>
                      Please deposit &gt; 10000 sats to buy your own AllPay username & register
                      on-chain. Please{' '}
                      <Button
                        basic
                        className='borderless transparent-button'
                        onClick={this.onViewDepositAddress}>
                        click here
                      </Button>{' '}
                      to see your deposit address.
                    </p>
                  </Message>
                </Grid.Column>
              </Grid.Row>
            </Grid>
          </Modal.Description>
        </Modal.Content>
        <Modal.Actions>
          <Button className='coral' onClick={this.toggleMessageModal}>
            Close
          </Button>
        </Modal.Actions>
      </Modal>
    );
  }

  renderAllpayAction() {
    const { allpayHandles, unregisteredNames } = this.props;
    if (unregisteredNames && unregisteredNames.length > 0) {
      return (
        <NavLink
          className='buyallpaybutton'
          activeClassName='buyallpaybuttonactive'
          to={`/wallet/allpay/register?progressTotalSteps=3&activeStep=1`}>
          Register AllPay Name
        </NavLink>
      );
    } else if (allpayHandles && allpayHandles.length === 0) {
      return (
        <Button className='buyallpaybutton' onClick={this.onBuyAllpayName}>
          Buy AllPay Name
        </Button>
      );
    }
  }

  render() {
    const { profile } = this.props;
    if (profile) {
      return (
        <>
          <Grid stackable reversed='mobile'>
            <Grid.Row>
              <Grid.Column computer={8} tablet={8} mobile={8} floated='left'>
                {profile.screenName.substring(2, 3) === '/' ? (
                  <span className='welcometext purplefontcolor'>{profile.screenName}</span>
                ) : (
                  <span className='welcometext'>{profile.screenName}</span>
                )}
              </Grid.Column>
              <Grid.Column computer={8} tablet={8} mobile={8} floated='right'>
                <div className='buttonFloatRightOnComp'>
                  {this.renderAllpayAction()}
                  <Dropdown
                    button
                    style={{ borderRadius: '100px' }}
                    className='icon circular coral'
                    icon='user'
                    additionPosition='top'
                    direction='left'
                    pointing='top right'>
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
                  </Dropdown.Item>*/}
                      {/* <Dropdown.Item>
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
                </div>

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
          {this.renderMessageModal()}
          {this.renderRenameProfileModal()}
        </>
      );
    }
    return null;
  }
}

WalletHeader.propTypes = {
  dispatch: PropTypes.func.isRequired,
};

WalletHeader.defaultProps = {};

const mapStateToProps = state => ({
  profile: state.auth.profile,
  balance: state.wallet.balance,
  allpayHandles: state.wallet.allpayHandles,
  unregisteredNames: state.wallet.unregisteredNames,
});

export default withRouter(connect(mapStateToProps)(WalletHeader));
