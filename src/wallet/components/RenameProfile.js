import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Button, Grid, Message, Modal } from 'semantic-ui-react';
import * as authActions from '../../auth/authActions';

class RenameProfile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      newProfilename: '',
      isError: false,
      message: '',
    };
  }

  onRenameProfile = async () => {
    const {
      profile: { screenName },
      dispatch,
    } = this.props;
    const { newProfilename } = this.state;
    try {
      await dispatch(authActions.updateProfileName(screenName, newProfilename));
      this.setState({ isError: false, message: 'Success! Your Profile has been renamed.' });
      setTimeout(() => {
        this.props.onClose();
        dispatch(authActions.logoutSuccess());
      }, 1000);
    } catch (error) {
      this.setState({ isError: true, message: error.message });
    }
  };

  renderMessage() {
    const { isError, message } = this.state;
    if (message) {
      return (
        <Message negative={isError}>
          <Message.Header>{message}</Message.Header>
        </Message>
      );
    }
    return null;
  }

  render() {
    const { newProfilename } = this.state;
    const {
      profile: { screenName },
    } = this.props;
    return (
      <>
        <Modal.Header>Rename Current Profile</Modal.Header>
        <Modal.Content>
          <Modal.Description>
            <Grid centered>
              <Grid.Column textAlign='center' width={8}>
                <div className='ui form'>
                  <div className='field'>
                    <label>Change Current Profile Name : {screenName}</label>
                    <div className='ui input'>
                      <input
                        type='text'
                        placeholder='New profile name'
                        value={newProfilename}
                        onChange={event => this.setState({ newProfilename: event.target.value })}
                      />
                    </div>
                  </div>
                  <div className='field'>
                    <Button className='coral' onClick={this.onRenameProfile}>
                      Rename
                    </Button>
                    <Button className='coral' onClick={this.props.onClose}>
                      Cancel
                    </Button>
                  </div>
                  {this.renderMessage()}
                </div>
              </Grid.Column>
            </Grid>
          </Modal.Description>
        </Modal.Content>
      </>
    );
  }
}

RenameProfile.propTypes = {
  profile: PropTypes.shape({
    screenName: PropTypes.string.isRequired,
  }).isRequired,
};

RenameProfile.defaultProps = {};

const mapStateToProps = state => ({
  profile: state.auth.profile,
});

export default connect(mapStateToProps)(RenameProfile);
