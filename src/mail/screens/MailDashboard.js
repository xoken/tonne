import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter, Link } from 'react-router-dom';
import { Grid, Button, Icon, Loader, Modal, Segment } from 'semantic-ui-react';
import SendMail from '../components/SendMail';
// import RenderInbox from '../components/RenderInbox';
// import RenderSentMails from '../components/RenderSentMails';
// import RenderCombinedMails from '../components/RenderCombinedMails';
import RenderFullMail from '../components/RenderFullMail';
import * as mailActions from '../mailActions';
import * as mailSelectors from '../mailSelectors';
import { format } from 'date-fns';

class MailDashboard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      sentMailSection: false,
      inboxSection: true,
      sendMailModal: false,
      toggleFullMailPane: false,
      currentlyOpenMailData: null,
      windowWidth: null,
      // lastRefreshed: null,
      // timeSinceLastRefreshed: null,
    };
  }

  async componentDidMount() {
    const { mailTransactions, dispatch } = this.props;
    if (mailTransactions && Object.keys(mailTransactions).length === 0) {
      try {
        await dispatch(mailActions.getMailTransactions({ limit: 10 }));
        // this.setState({ lastRefreshed: new Date() });
        // this.timerID = setInterval(
        //   () =>
        //     this.setState({
        //       timeSinceLastRefreshed: new Date(),
        //     }),
        //   1000
        // );
        const autoRefreshTimeInSecs = 1 * 30 * 1000;
        this.autoRefreshTimer = setInterval(() => {
          this.onRefresh();
        }, autoRefreshTimeInSecs);
      } catch (error) {
        console.log(error);
      }
    }
    this.getWindowWidth();
    window.addEventListener('resize', this.getWindowWidth);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.getWindowWidth);
    // clearInterval(this.timerID);
    clearInterval(this.autoRefreshTimer);
  }

  onRefresh = async () => {
    const { dispatch } = this.props;
    await dispatch(mailActions.getMailTransactions({ diff: true }));
    // this.setState({
    //   lastRefreshed: new Date(),
    //   timeSinceLastRefreshed: new Date(),
    // });
  };

  onNextPage = async () => {
    const { dispatch } = this.props;
    await dispatch(mailActions.getMailTransactions({ limit: 10 }));
  };

  renderPagination() {
    const { nextTransactionCursor } = this.props;
    if (nextTransactionCursor) {
      return (
        <Segment basic textAlign='center'>
          <Button className='coral' onClick={this.onNextPage}>
            Next Page
          </Button>
        </Segment>
      );
    }
    return null;
  }

  combinedMailsSection() {
    const { allpayHandles, mailTransactions, isLoadingMailTransactions } = this.props;
    const { currentlyOpenMailData, toggleFullMailPane } = this.state;
    // let combinedMails = [
    //   {
    //     fromaddress: 'aa/allpayname',
    //     time: '10:10',
    //     subject: 'Thank you for your interest in abc',
    //     currentlyOpenMail: 'inbox1',
    //   },
    //   {
    //     fromaddress: 'aa/allpayname',
    //     time: '10:10',
    //     subject: 'Thank you for buying a xyz',
    //     currentlyOpenMail: 'inbox2',
    //   },
    // ];

    if (Object.keys(mailTransactions).length !== 0) {
      if (
        toggleFullMailPane &&
        Object.keys(mailTransactions).includes(currentlyOpenMailData[0].threadId)
      ) {
        if (
          mailTransactions[currentlyOpenMailData[0].threadId].length > currentlyOpenMailData.length
        ) {
          this.setState({
            currentlyOpenMailData: mailTransactions[currentlyOpenMailData[0].threadId],
          });
        }
      }
      return Object.values(mailTransactions).map((mail, index) => {
        let mailData = null,
          sentMail = false,
          numberOfMails = mail.length;

        if (mail[0].additionalInfo.value.senderInfo) {
          mailData = mail[0].additionalInfo.value.senderInfo;
          sentMail = true;
        } else {
          mailData = mail[0].additionalInfo.value.recipientInfo;
          sentMail = false;
        }
        let dateTime = format(new Date(mail[0].createdAt), 'dd-MM-yyyy hh:mm:ss');

        return (
          <Grid.Row
            key={index.toString()}
            style={{ cursor: 'pointer' }}
            onClick={() => this.mailOnClick(mail)}>
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
                  <Grid.Column computer={8} mobile={8} floated='left'>
                    <span style={{ color: 'lightGrey' }} className='word-wrap purplefontcolor'>
                      {sentMail
                        ? mailData.commonMetaData.recepient
                        : mailData.commonMetaData.sender}{' '}
                    </span>
                    <span>
                      {sentMail ? (
                        <span className='toArrow'>&#129133; </span>
                      ) : (
                        <span className='fromArrow'>&#129134; </span>
                      )}
                    </span>
                  </Grid.Column>
                  <Grid.Column computer={4} mobile={8} floated='right'>
                    <span style={{ color: 'lightGrey', float: 'right' }} className='word-wrap'>
                      {dateTime}
                    </span>
                  </Grid.Column>
                </Grid.Row>
                <Grid.Row>
                  <Grid.Column computer={16} floated='left'>
                    <span className='purplefontcolor'>
                      {numberOfMails > 1 ? '(' + numberOfMails + ')' : ''}{' '}
                    </span>
                    <b>{mailData.commonMetaData.subject}</b>
                  </Grid.Column>
                </Grid.Row>
              </Grid>
            </Grid.Column>
          </Grid.Row>
        );
      });
    } else {
      let welcomeMail = [
        {
          txId: null,
          blockHeight: null,
          additionalInfo: {
            type: 'voxMail Tx',
            value: {
              senderInfo: null,
              recipientInfo: {
                commonMetaData: {
                  sender: ['Tonne Team'],
                  recepient: [''],
                  subject: 'Welcome to voxMail!',
                  attachmentTypes: ['text/html'],
                },
                body: "<p>Hi, thanks for using voxMail. You're awesome!</p>\n",
                threadId: 'welcomemail',
              },
            },
          },
          inputs: [
            {
              address: 'welcomemail',
              isMine: true,
              isNUTXO: false,
              txInputIndex: 1,
              outputTxHash: 'welcomemail',
              value: 0,
            },
          ],
          outputs: [
            {
              address: null,
              isMine: false,
              isNUTXO: false,
              lockingScript: 'welcomemail',
              outputIndex: 0,
              value: 0,
            },
            {
              address: null,
              isMine: false,
              isNUTXO: false,
              lockingScript: 'welcomemail',
              outputIndex: 1,
              value: 0,
            },
            {
              address: 'welcomemail',
              isMine: true,
              isNUTXO: false,
              lockingScript: 'welcomemail',
              outputIndex: 2,
              value: 0,
            },
          ],
          fees: 0,
          confirmation: null,
          createdAt: new Date().toString(),
          _id: 'transaction-01',
          _rev: '00',
          threadId: 'welcomemail',
        },
      ];
      let dateTime = format(new Date(welcomeMail[0].createdAt), 'dd-MM-yyyy hh:mm:ss');
      return (
        <Grid.Row style={{ cursor: 'pointer' }} onClick={() => this.mailOnClick(welcomeMail)}>
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
                <Grid.Column computer={8} mobile={8} floated='left'>
                  <span style={{ color: 'lightGrey' }} className='word-wrap purplefontcolor'>
                    {welcomeMail[0].additionalInfo.value.recipientInfo.commonMetaData.sender}{' '}
                  </span>
                  <span>
                    <span className='fromArrow'>&#129134; </span>
                  </span>
                </Grid.Column>
                <Grid.Column computer={4} mobile={8} floated='right'>
                  <span style={{ color: 'lightGrey', float: 'right' }} className='word-wrap'>
                    {dateTime}
                  </span>
                </Grid.Column>
              </Grid.Row>
              <Grid.Row>
                <Grid.Column computer={16} floated='left'>
                  <span className='purplefontcolor'></span>
                  <b>{welcomeMail[0].additionalInfo.value.recipientInfo.commonMetaData.subject}</b>
                </Grid.Column>
              </Grid.Row>
            </Grid>
          </Grid.Column>
        </Grid.Row>
      );
    }
  }

  mailOnClick = currOpenMailData => {
    const { toggleFullMailPane } = this.state;
    if (toggleFullMailPane) {
      this.setState({
        currentlyOpenMailData: currOpenMailData,
      });
    } else {
      this.setState({
        currentlyOpenMailData: currOpenMailData,

        toggleFullMailPane: !toggleFullMailPane,
      });
    }
  };

  // toggleFirstColumn = event => {
  //   const { sentMailSection, inboxSection } = this.state;
  //   if (event.target.id === 'sent') {
  //     this.setState({ sentMailSection: true, inboxSection: false });
  //   } else {
  //     this.setState({ sentMailSection: false, inboxSection: true });
  //   }
  // };

  toggleSendMailModal = () => {
    const { sendMailModal } = this.state;
    this.setState({ sendMailModal: !sendMailModal });
  };

  renderSendMailModal() {
    const { sendMailModal } = this.state;
    return (
      <Modal open={sendMailModal}>
        <Modal.Header className='purplefontcolor'>
          New Mail
          <i
            style={{ float: 'right', cursor: 'pointer' }}
            className='close icon'
            onClick={this.toggleSendMailModal}></i>
        </Modal.Header>
        <Modal.Content>
          <Modal.Description>
            <SendMail onCancel={this.toggleSendMailModal} />
          </Modal.Description>
        </Modal.Content>
      </Modal>
    );
  }

  renderFullMailModal() {
    const { toggleFullMailPane, currentlyOpenMailData } = this.state;
    return (
      <Grid.Column>
        <Modal open={toggleFullMailPane}>
          <Modal.Header className='purplefontcolor'></Modal.Header>
          <Modal.Content>
            <Modal.Description>
              <RenderFullMail
                toggleFullMailPane={this.toggleFullMailPane}
                threadId={currentlyOpenMailData[0].threadId}
                currentlyOpenMailData={currentlyOpenMailData}
              />
            </Modal.Description>
          </Modal.Content>
        </Modal>
      </Grid.Column>
    );
  }

  // sentMailSection = () => {
  //   const { sentMailSection, toggleFullMailPane } = this.state;
  //   let sentmail = [
  //     {
  //       toaddress: 'aa/allpayname',
  //       time: '10:10',
  //       subject: 'welcome to',
  //       currentlyOpenMail: 'sent1',
  //     },
  //     { toaddress: 'aa/allpayname', time: '10:10', subject: 'Welcome', currentlyOpenMail: 'sent2' },
  //   ];
  //
  //   if (sentMailSection) {
  //     return sentmail.map((mail, index) => {
  //       return (
  //         <Grid.Row
  //           style={{ cursor: 'pointer' }}
  //           onClick={
  //             toggleFullMailPane
  //               ? event => this.setState({ currentlyOpenMail: mail.currentlyOpenMail })
  //               : event =>
  //                   this.setState({
  //                     currentlyOpenMail: mail.currentlyOpenMail,
  //                     toggleFullMailPane: !toggleFullMailPane,
  //                   })
  //           }>
  //           <Grid.Column
  //             style={{
  //               boxShadow: '5px 5px 5px #fafafa',
  //               paddingTop: '12px',
  //               paddingBottom: '12px',
  //               marginTop: '8px',
  //               marginBottom: '8px',
  //             }}>
  //             <Grid>
  //               <Grid.Row>
  //                 <Grid.Column computer={8} mobile={8} floated='left'>
  //                   <span style={{ color: 'lightGrey' }}>{mail.toaddress}</span>
  //                 </Grid.Column>
  //                 <Grid.Column computer={2} mobile={8} floated='right'>
  //                   <span style={{ color: 'lightGrey', float: 'right' }}>{mail.time}</span>
  //                 </Grid.Column>
  //               </Grid.Row>
  //               <Grid.Row>
  //                 <Grid.Column computer={16} floated='left'>
  //                   <b>{mail.subject}</b>
  //                 </Grid.Column>
  //               </Grid.Row>
  //             </Grid>
  //           </Grid.Column>
  //         </Grid.Row>
  //       );
  //     });
  //   } else {
  //     return;
  //   }
  // };
  // inboxSection = () => {
  //   const { inboxSection, currentlyOpenMail, toggleFullMailPane } = this.state;
  //   let inbox = [
  //     {
  //       fromaddress: 'aa/allpayname',
  //       time: '10:10',
  //       subject: 'Thank you for your interest in abc',
  //       currentlyOpenMail: 'inbox1',
  //     },
  //     {
  //       fromaddress: 'aa/allpayname',
  //       time: '10:10',
  //       subject: 'Thank you for buying a xyz',
  //       currentlyOpenMail: 'inbox2',
  //     },
  //   ];
  //   if (inboxSection) {
  //     return inbox.map((mail, index) => {
  //       return (
  //         <Grid.Row
  //           style={{ cursor: 'pointer' }}
  //           onClick={
  //             toggleFullMailPane
  //               ? event => this.setState({ currentlyOpenMail: mail.currentlyOpenMail })
  //               : event =>
  //                   this.setState({
  //                     currentlyOpenMail: mail.currentlyOpenMail,
  //                     toggleFullMailPane: !toggleFullMailPane,
  //                   })
  //           }>
  //           <Grid.Column
  //             style={{
  //               boxShadow: '5px 5px 5px #fafafa',
  //               paddingTop: '12px',
  //               paddingBottom: '12px',
  //               marginTop: '8px',
  //               marginBottom: '8px',
  //             }}>
  //             <Grid>
  //               <Grid.Row>
  //                 <Grid.Column computer={8} mobile={8} floated='left'>
  //                   {
  //                     //allpayname
  //                   }
  //                   <span style={{ color: 'lightGrey' }}>{mail.fromaddress}</span>
  //                 </Grid.Column>
  //                 <Grid.Column computer={2} mobile={8} floated='right'>
  //                   {
  //                     //time
  //                   }
  //                   <span style={{ color: 'lightGrey', float: 'right' }}>{mail.time}</span>
  //                 </Grid.Column>
  //               </Grid.Row>
  //               <Grid.Row>
  //                 <Grid.Column computer={16} floated='left'>
  //                   {
  //                     //full Subject:
  //                   }
  //                   <b>{mail.subject}</b>
  //                 </Grid.Column>
  //               </Grid.Row>
  //             </Grid>
  //           </Grid.Column>
  //         </Grid.Row>
  //       );
  //     });
  //   } else {
  //     return;
  //   }
  // };

  // combinedMailsSection = () => {
  //   const { currentlyOpenMail, toggleFullMailPane } = this.state;
  //   let combinedMails = [
  //     {
  //       fromaddress: 'aa/allpayname',
  //       time: '10:10',
  //       subject: 'Thank you for your interest in abc',
  //       currentlyOpenMail: 'inbox1',
  //     },
  //     {
  //       fromaddress: 'aa/allpayname',
  //       time: '10:10',
  //       subject: 'Thank you for buying a xyz',
  //       currentlyOpenMail: 'inbox2',
  //     },
  //   ];

  //   return combinedMails.map((mail, index) => {
  //     return (
  //       <Grid.Row
  //         style={{ cursor: 'pointer' }}
  //         onClick={
  //           toggleFullMailPane
  //             ? event => this.setState({ currentlyOpenMail: mail.currentlyOpenMail })
  //             : event =>
  //                 this.setState({
  //                   currentlyOpenMail: mail.currentlyOpenMail,
  //                   toggleFullMailPane: !toggleFullMailPane,
  //                 })
  //         }>
  //         <Grid.Column
  //           style={{
  //             boxShadow: '5px 5px 5px #fafafa',
  //             paddingTop: '12px',
  //             paddingBottom: '12px',
  //             marginTop: '8px',
  //             marginBottom: '8px',
  //           }}>
  //           <Grid>
  //             <Grid.Row>
  //               <Grid.Column computer={8} mobile={8} floated='left'>
  //                 {
  //                   //allpayname
  //                 }
  //                 <span style={{ color: 'lightGrey' }}>{mail.fromaddress}</span>
  //               </Grid.Column>
  //               <Grid.Column computer={2} mobile={8} floated='right'>
  //                 {
  //                   //time
  //                 }
  //                 <span style={{ color: 'lightGrey', float: 'right' }}>{mail.time}</span>
  //               </Grid.Column>
  //             </Grid.Row>
  //             <Grid.Row>
  //               <Grid.Column computer={16} floated='left'>
  //                 {
  //                   //full Subject:
  //                 }
  //                 <b>{mail.subject}</b>
  //               </Grid.Column>
  //             </Grid.Row>
  //           </Grid>
  //         </Grid.Column>
  //       </Grid.Row>
  //     );
  //   });
  // };

  toggleFullMailPane = () => {
    // if (!toggleFullMailPane) {
    //   this.setState({ currentlyOpenMail: '' });
    // }
    const { toggleFullMailPane } = this.state;
    this.setState({ toggleFullMailPane: !toggleFullMailPane });
  };

  // renderFullMail = () => {
  //   const { toggleFullMailPane, currentlyOpenMail } = this.state;
  //   if (!toggleFullMailPane && currentlyOpenMail) {
  //     this.setState({ toggleFullMailPane: true });
  //   }
  //   console.log(toggleFullMailPane);
  //   console.log(currentlyOpenMail);
  //   if (toggleFullMailPane && currentlyOpenMail) {
  //     return (
  //       <Grid>
  //         <Grid.Row>
  //           <Grid.Column computer={16} mobile={16} floated='right'>
  //             {
  //               //close pane
  //             }
  //             <span
  //               style={{
  //                 color: 'lightgrey',
  //                 cursor: 'pointer',
  //                 padding: '8px',
  //                 color: 'red',
  //                 float: 'right',
  //               }}
  //               onClick={this.toggleFullMailPane}>
  //               X
  //             </span>
  //           </Grid.Column>
  //         </Grid.Row>
  //         <Grid.Row>
  //           <Grid.Column computer={8} mobile={8} floated='left'>
  //             {
  //               //allpayname
  //             }
  //             <span style={{ color: 'lightgrey' }}>aa/allpayname</span>
  //           </Grid.Column>
  //
  //           <Grid.Column computer={2} mobile={8} floated='right'>
  //             {
  //               //time
  //             }
  //             <span style={{ color: 'lightgrey', float: 'right' }}>10:10</span>
  //           </Grid.Column>
  //         </Grid.Row>
  //         <Grid.Row computer={16}>
  //           <Grid.Column computer='16' floated='left'>
  //             {
  //               //full subject
  //             }
  //             <b>Placeholder Subject line sdf sggs sfhfhs</b>
  //           </Grid.Column>
  //         </Grid.Row>
  //         <Grid.Row computer={16}>
  //           <Grid.Column computer='16' floated='left'>
  //             {
  //               //full message
  //             }
  //             <p>
  //               Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
  //               incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
  //               exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute
  //               irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
  //               pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia
  //               deserunt mollit anim id est laborum
  //             </p>
  //             <p>
  //               Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
  //               incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
  //               exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute
  //               irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
  //               pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia
  //               deserunt mollit anim id est laborum
  //             </p>
  //           </Grid.Column>
  //         </Grid.Row>
  //
  //         <Grid.Row>
  //           <Grid.Column>
  //             {
  //               //Attached files
  //             }
  //           </Grid.Column>
  //         </Grid.Row>
  //       </Grid>
  //     );
  //   }
  // };

  getWindowWidth = () => {
    const { innerWidth: width } = window;
    this.setState({ windowWidth: parseInt(width) });
  };

  render() {
    const {
      // sentMailSection,
      // inboxSection,
      toggleFullMailPane,
      currentlyOpenMailData,
      windowWidth,
    } = this.state;

    const { allpayHandles, mailTransactions, isLoadingMailTransactions } = this.props;
    if (allpayHandles && allpayHandles.length === 0) {
      return (
        <Grid>
          <Grid.Row>
            <Grid.Column textAlign='center'>
              <p>Please register an AllPay name to use voxMail</p>
              <Link to='/wallet/dashboard' className='ui coral button'>
                Continue
              </Link>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      );
    } else {
      return (
        <>
          <Grid stackable>
            <Grid.Row centered>
              <Grid.Column computer={16} tablet={16} mobile={16}>
                <Grid>
                  <Grid.Row verticalAlign='middle'>
                    <Grid.Column computer={4} tablet={8} mobile={8} floated='left'>
                      <Button className='peach' onClick={this.toggleSendMailModal}>
                        Send Mail
                      </Button>
                    </Grid.Column>
                    <Grid.Column computer={12} tablet={8} mobile={8}>
                      {
                        // <span className='sentInboxToggle'>
                        //   <span
                        //     className={inboxSection ? 'coral' : undefined}
                        //     id='inbox'
                        //     onClick={this.toggleFirstColumn}
                        //     style={{ padding: '10px', cursor: 'pointer' }}>
                        //     Inbox
                        //   </span>
                        //   <span
                        //     className={sentMailSection ? 'coral' : undefined}
                        //     id='sent'
                        //     onClick={this.toggleFirstColumn}
                        //     style={{ padding: '10px', cursor: 'pointer' }}>
                        //     Sent
                        //   </span>
                        // </span>
                      }
                    </Grid.Column>
                  </Grid.Row>
                </Grid>
              </Grid.Column>
            </Grid.Row>
            <Grid.Row>
              <Grid.Column computer={toggleFullMailPane ? '6' : '16'}>
                <Grid>
                  {
                    // this.inboxSection()
                    // this.sentMailSection()
                    //this.combinedMailsSection()
                  }
                  {
                    // inboxSection ? (
                    //   <RenderInbox mailOnClick={this.mailOnClick} />
                    // ) : (
                    //   <RenderSentMails mailOnClick={this.mailOnClick} />
                    // )
                  }
                  {
                    //<RenderCombinedMails mailOnClick={this.mailOnClick} />
                  }
                  <div style={{ width: '100%' }}>
                    {' '}
                    <Button
                      floated='right'
                      circular
                      icon
                      style={{
                        marginRight: '0px',
                      }}
                      className='peach'
                      disabled={isLoadingMailTransactions}
                      onClick={this.onRefresh}>
                      <Icon name='refresh' />
                    </Button>
                  </div>
                  {this.combinedMailsSection()}
                  {this.renderPagination()}
                </Grid>
              </Grid.Column>
              {toggleFullMailPane ? (
                windowWidth >= 770 || !windowWidth ? (
                  <Grid.Column computer='10'>
                    {
                      //this.renderFullMail()
                    }
                    {
                      <RenderFullMail
                        toggleFullMailPane={this.toggleFullMailPane}
                        threadId={currentlyOpenMailData[0].threadId}
                        currentlyOpenMailData={currentlyOpenMailData}
                      />
                    }
                  </Grid.Column>
                ) : (
                  this.renderFullMailModal()
                )
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
}
MailDashboard.propTypes = {
  dispatch: PropTypes.func.isRequired,
  mailTransactions: PropTypes.objectOf(PropTypes.array),
};

MailDashboard.defaultProps = { mailTransactions: {} };

const mapStateToProps = state => ({
  allpayHandles: state.wallet.allpayHandles,
  isLoadingMailTransactions: mailSelectors.isLoadingMailTransactions(state),
  mailTransactions: mailSelectors.getMailTransactions(state),
  nextTransactionCursor: state.mail.nextTransactionCursor,
});

export default withRouter(connect(mapStateToProps)(MailDashboard));
