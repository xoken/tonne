import React from 'react';
import { withRouter, NavLink } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Dropdown, Modal, Grid } from 'semantic-ui-react';
import * as authActions from '../../auth/authActions';
import RenameProfile from '../components/RenameProfile';

class WalletHeader extends React.Component {
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

  renderRenameProfileModal() {
    const { renameProfileModal } = this.state;
    return (
      <Modal open={renameProfileModal}>
        <RenameProfile onClose={this.toggleRenameProfileModal} />
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
    } else if (allpayHandles && allpayHandles.length <= 0) {
      return (
        <NavLink
          className='buyallpaybutton'
          activeClassName='buyallpaybuttonactive'
          to={`/wallet/allpay/search`}>
          Buy AllPay Name
        </NavLink>
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
                    className='icon coral'
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
  allpayHandles: state.wallet.allpayHandles,
  unregisteredNames: state.wallet.unregisteredNames,
});

export default withRouter(connect(mapStateToProps)(WalletHeader));
