import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter, NavLink } from 'react-router-dom';
import { Grid, Button, Icon, Loader, Modal, Segment } from 'semantic-ui-react';
import SendMail from '../components/SendMail';

class MailDashboard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      sentMailSection: false,
      inboxSection: true,
      sendMailModal: false,
      toggleFullMailPane: false,
      currentlyOpenMail: '',
    };
  }

  toggleFirstColumn = event => {
    const { sentMailSection, inboxSection } = this.state;
    if (event.target.id === 'sent') {
      this.setState({ sentMailSection: true, inboxSection: false });
    } else {
      this.setState({ sentMailSection: false, inboxSection: true });
    }
  };

  toggleSendMailModal = () => {
    const { sendMailModal } = this.state;
    this.setState({ sendMailModal: !sendMailModal });
  };

  renderSendMailModal() {
    const { sendMailModal } = this.state;
    return (
      <Modal open={sendMailModal}>
        <Modal.Header className='purplefontcolor'>New Mail</Modal.Header>
        <Modal.Content>
          <Modal.Description>
            <SendMail onCancel={this.toggleSendMailModal} />
          </Modal.Description>
        </Modal.Content>
      </Modal>
    );
  }

  sentMailSection = () => {
    const { sentMailSection, toggleFullMailPane } = this.state;
    if (sentMailSection) {
      return (
        <>
          <Grid>
            <Grid.Row
              onClick={
                toggleFullMailPane
                  ? event => this.setState({ currentlyOpenMail: 'sent1' })
                  : event =>
                      this.setState({
                        currentlyOpenMail: 'sent1',
                        toggleFullMailPane: !toggleFullMailPane,
                      })
              }>
              <Grid.Column
                style={{
                  boxShadow: '5px 5px 5px #fafafa',
                  paddingTop: '12px',
                  paddingBottom: '12px',
                  marginTop: '8px',
                  marginBottom: '8px',
                }}>
                <Grid>
                  <Grid.Row>
                    <Grid.Column computer={8} floated='left'>
                      <span style={{ color: 'lightGrey' }}>aa/allpayname</span>
                    </Grid.Column>
                    <Grid.Column computer={2} floated='right'>
                      <span style={{ color: 'lightGrey' }}>10:10</span>
                    </Grid.Column>
                  </Grid.Row>
                  <Grid.Row>
                    <Grid.Column computer={16} floated='left'>
                      <b>welcome to</b>
                    </Grid.Column>
                  </Grid.Row>
                </Grid>
              </Grid.Column>
            </Grid.Row>
            <Grid.Row
              onClick={
                toggleFullMailPane
                  ? event => this.setState({ currentlyOpenMail: 'sent2' })
                  : event =>
                      this.setState({
                        currentlyOpenMail: 'sent2',
                        toggleFullMailPane: !toggleFullMailPane,
                      })
              }>
              <Grid.Column
                style={{
                  boxShadow: '5px 5px 5px #fafafa',
                  paddingTop: '12px',
                  paddingBottom: '12px',
                  marginTop: '8px',
                  marginBottom: '8px',
                }}>
                <Grid>
                  <Grid.Row>
                    <Grid.Column computer={8} floated='left'>
                      <span style={{ color: 'lightGrey' }}>aa/allpayname</span>
                    </Grid.Column>
                    <Grid.Column computer={2} floated='right'>
                      <span style={{ color: 'lightGrey' }}>10:10</span>
                    </Grid.Column>
                  </Grid.Row>
                  <Grid.Row>
                    <Grid.Column computer={16} floated='left'>
                      <b>Welcome</b>
                    </Grid.Column>
                  </Grid.Row>
                </Grid>
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </>
      );
    } else {
      return;
    }
  };
  inboxSection = () => {
    const { inboxSection, currentlyOpenMail, toggleFullMailPane } = this.state;
    if (inboxSection) {
      return (
        <>
          <Grid>
            <Grid.Row
              onClick={
                toggleFullMailPane
                  ? event => this.setState({ currentlyOpenMail: 'inbox1' })
                  : event =>
                      this.setState({
                        currentlyOpenMail: 'inbox1',
                        toggleFullMailPane: !toggleFullMailPane,
                      })
              }>
              <Grid.Column
                style={{
                  boxShadow: '5px 5px 5px #fafafa',
                  paddingTop: '12px',
                  paddingBottom: '12px',
                  marginTop: '8px',
                  marginBottom: '8px',
                }}>
                <Grid>
                  <Grid.Row>
                    <Grid.Column computer={8} floated='left'>
                      {
                        //allpayname
                      }
                      <span style={{ color: 'lightGrey' }}>aa/allpayname</span>
                    </Grid.Column>
                    <Grid.Column computer={2} floated='right'>
                      {
                        //time
                      }
                      <span style={{ color: 'lightGrey' }}>10:10</span>
                    </Grid.Column>
                  </Grid.Row>
                  <Grid.Row>
                    <Grid.Column computer={16} floated='left'>
                      {
                        //full Subject:
                      }
                      <b>Thank you for your interest in abc</b>
                    </Grid.Column>
                  </Grid.Row>
                </Grid>
              </Grid.Column>
            </Grid.Row>
            <Grid.Row
              onClick={
                toggleFullMailPane
                  ? event => this.setState({ currentlyOpenMail: 'inbox2' })
                  : event =>
                      this.setState({
                        currentlyOpenMail: 'inbox2',
                        toggleFullMailPane: !toggleFullMailPane,
                      })
              }>
              <Grid.Column
                style={{
                  boxShadow: '5px 5px 5px #fafafa',
                  paddingTop: '12px',
                  paddingBottom: '12px',
                  marginTop: '8px',
                  marginBottom: '8px',
                }}>
                <Grid>
                  <Grid.Row>
                    <Grid.Column computer={8} floated='left'>
                      {
                        //allpayname
                      }
                      <span style={{ color: 'lightGrey' }}>aa/allpayname</span>
                    </Grid.Column>
                    <Grid.Column computer={2} floated='right'>
                      {
                        //time
                      }
                      <span style={{ color: 'lightGrey' }}>10:10</span>
                    </Grid.Column>
                  </Grid.Row>
                  <Grid.Row>
                    <Grid.Column computer={16} floated='left'>
                      {
                        //full Subject:
                      }
                      <b>Thank you for buying a xyz</b>
                    </Grid.Column>
                  </Grid.Row>
                </Grid>
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </>
      );
    } else {
      return;
    }
  };

  toggleFullMailPane = () => {
    const { toggleFullMailPane } = this.state;
    // if (!toggleFullMailPane) {
    //   this.setState({ currentlyOpenMail: '' });
    // }
    this.setState({ toggleFullMailPane: !toggleFullMailPane, currentlyOpenMail: '' });
  };

  renderFullMail = () => {
    const { toggleFullMailPane, currentlyOpenMail } = this.state;
    if (!toggleFullMailPane && currentlyOpenMail) {
      this.setState({ toggleFullMailPane: true });
    }
    console.log(toggleFullMailPane);
    console.log(currentlyOpenMail);
    if (toggleFullMailPane && currentlyOpenMail) {
      return (
        <Grid>
          <Grid.Row>
            <Grid.Column computer={1} floated='right'>
              {
                //close pane
              }
              <span
                style={{ color: 'lightgrey', cursor: 'pointer', padding: '8px', color: 'red' }}
                onClick={this.toggleFullMailPane}>
                X
              </span>
            </Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <Grid.Column computer={8} floated='left'>
              {
                //allpayname
              }
              <span style={{ color: 'lightgrey' }}>aa/allpayname</span>
            </Grid.Column>

            <Grid.Column computer={2} floated='right'>
              {
                //time
              }
              <span style={{ color: 'lightgrey' }}>10:10</span>
            </Grid.Column>
          </Grid.Row>
          <Grid.Row computer={16}>
            <Grid.Column computer='16' floated='left'>
              {
                //full subject
              }
              <b>Placeholder Subject line sdf sggs sfhfhs</b>
            </Grid.Column>
          </Grid.Row>
          <Grid.Row computer={16}>
            <Grid.Column computer='16' floated='left'>
              {
                //full message
              }
              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
                incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
                exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute
                irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
                pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia
                deserunt mollit anim id est laborum
              </p>
              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
                incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
                exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute
                irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
                pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia
                deserunt mollit anim id est laborum
              </p>
            </Grid.Column>
          </Grid.Row>

          <Grid.Row>
            <Grid.Column>
              {
                //Attached files
              }
            </Grid.Column>
          </Grid.Row>
        </Grid>
      );
    }
  };

  render() {
    const { sentMailSection, inboxSection, toggleFullMailPane } = this.state;
    return (
      <>
        <Grid>
          <Grid.Row only='computer' centered>
            <Grid.Column computer={16}>
              <center>
                <span
                  className={inboxSection ? 'coral' : undefined}
                  id='inbox'
                  onClick={this.toggleFirstColumn}
                  style={{ padding: '10px', cursor: 'pointer' }}>
                  Inbox
                </span>
                <span
                  className={sentMailSection ? 'coral' : undefined}
                  id='sent'
                  onClick={this.toggleFirstColumn}
                  style={{ padding: '10px', cursor: 'pointer' }}>
                  Sent
                </span>
              </center>
            </Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <Grid.Column computer={4} floated='left'>
              <Button className='peach' onClick={this.toggleSendMailModal}>
                Send Mail
              </Button>
            </Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <Grid.Column computer={toggleFullMailPane ? '6' : '16'}>
              {this.inboxSection()}
              {this.sentMailSection()}
            </Grid.Column>
            {toggleFullMailPane ? (
              <Grid.Column computer='10'>{this.renderFullMail()}</Grid.Column>
            ) : (
              ''
            )}
          </Grid.Row>
        </Grid>
        {this.renderSendMailModal()}
      </>
    );
  }
}
MailDashboard.propTypes = {};

MailDashboard.defaultProps = {};

const mapStateToProps = state => ({});

export default withRouter(connect(mapStateToProps)(MailDashboard));
