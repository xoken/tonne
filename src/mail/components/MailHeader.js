import React from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Dropdown, Modal, Grid } from 'semantic-ui-react';
import * as authActions from '../../auth/authActions';
import RenameProfile from '../../wallet/components/RenameProfile';

class MailHeader extends React.Component {
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

  render() {
    const { profile } = this.props;
    if (profile) {
      return (
        <>
          <Grid stackable reversed='mobile'>
            <Grid.Row>
              <Grid.Column computer={7} tablet={8} mobile={8} floated='left'>
                {profile.screenName.substring(2, 3) === '/' ? (
                  <span className='welcometext purplefontcolor'>{profile.screenName}</span>
                ) : (
                  <span className='welcometext'>{profile.screenName}</span>
                )}
              </Grid.Column>
              <Grid.Column computer={2}></Grid.Column>
              <Grid.Column computer={7} tablet={8} mobile={8} floated='right'>
                <div className='buttonFloatRightOnComp'>
                  <Dropdown
                    button
                    style={{ borderRadius: '100px' }}
                    className='icon circular coral'
                    icon='user'
                    additionPosition='top'
                    direction='left'
                    pointing='top right'>
                    <Dropdown.Menu>
                      <Dropdown.Item
                        className='dropdownmenuitems'
                        text='Rename Profile'
                        onClick={this.toggleRenameProfileModal}
                      />
                      <Dropdown.Item className='logoutlink' text='Logout' onClick={this.onLogout} />
                    </Dropdown.Menu>
                  </Dropdown>
                </div>
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

MailHeader.propTypes = {
  dispatch: PropTypes.func.isRequired,
};

MailHeader.defaultProps = {};

const mapStateToProps = state => ({
  profile: state.auth.profile,
  allpayHandles: state.wallet.allpayHandles,
  unregisteredNames: state.wallet.unregisteredNames,
});

export default withRouter(connect(mapStateToProps)(MailHeader));
