import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Modal, Grid, Message } from 'semantic-ui-react';
import * as authActions from '../../auth/authActions';

class RenameProfile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      newname: '',
      updateError: false
    };
  }
  onRenameAccount = async () => {
    const { dispatch } = this.props;
    const { newname } = this.state;
    try {
      const message = await dispatch(
        authActions.updateProfileName(localStorage.getItem('currentprofile'), newname)
      );
      this.setState({ updateError: message });
      if (!message) {
        this.props.logout();
      }
    } catch (error) {
      this.setState({ updateError: false });
    }
  };
  printMessage = () => {
    const { updateError } = this.state;
    if (updateError) {
      return (
        <Message negative>
          <Message.Header>Sorry. We could not rename your profile</Message.Header>
        </Message>
      );
    }
  };

  render() {
    const { newname } = this.state;
    return (
      <>
        <Modal.Header>Rename Current Profile</Modal.Header>
        <Modal.Content>
          <Modal.Description>
            <Grid centered>
              <Grid.Column textAlign='center' width={8}>
                <div className='ui form'>
                  <div className='field'>
                    <label>
                      Change Current Account's Name : {localStorage.getItem('currentprofile')}
                    </label>
                    <div className='ui left icon input'>
                      <input
                        type='text'
                        placeholder='New Name'
                        value={newname}
                        onChange={event => this.setState({ newname: event.target.value })}
                      />
                      <i className='user icon'></i>
                    </div>
                  </div>
                  <center>
                    <div className='ui blue submit button' onClick={this.onRenameAccount}>
                      Rename
                    </div>
                    <div className='ui blue submit button' onClick={this.props.onClose}>
                      Cancel
                    </div>
                  </center>
                  <Grid.Column textAlign='center' width={16}>
                    {this.printMessage}
                  </Grid.Column>
                </div>
              </Grid.Column>
            </Grid>
          </Modal.Description>
        </Modal.Content>
      </>
    );
  }
}

const mapStateToProps = state => ({});

export default connect(mapStateToProps)(RenameProfile);
