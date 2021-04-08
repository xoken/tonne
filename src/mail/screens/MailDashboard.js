import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter, Link } from 'react-router-dom';
import { Grid, Button, Icon, Loader, Modal } from 'semantic-ui-react';
import SendMail from '../components/SendMail';
import RenderFullMail from '../components/RenderFullMail';
import * as mailActions from '../mailActions';
import * as mailSelectors from '../mailSelectors';
import { format } from 'date-fns';
import images from '../../shared/images';

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
    };
  }

  async componentDidMount() {
    const { mailTransactions, dispatch } = this.props;
    if (Object.keys(mailTransactions).length === 0) {
      try {
        await dispatch(mailActions.getMailTransactions({}));
        const autoRefreshTimeInSecs = 1 * 60 * 1000;
        this.autoRefreshTimer = setInterval(() => {
          this.onRefresh();
        }, autoRefreshTimeInSecs);
      } catch (error) {
        console.log(error);
      }
    }
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.getWindowWidth);
    clearInterval(this.autoRefreshTimer);
  }

  componentDidUpdate() {
    const { mailTransactions } = this.props;
    const { toggleFullMailPane, currentlyOpenMailData } = this.state;
    if (mailTransactions && Object.keys(mailTransactions).length !== 0) {
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
    }
  }

  onRefresh = async () => {
    const { dispatch } = this.props;
    await dispatch(mailActions.getMailTransactions({ diff: true }));
  };

  combinedMailsSection() {
    const { mailTransactions } = this.props;

    if (Object.keys(mailTransactions).length !== 0) {
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

        let dateTime = null;
        if (mail[0].createdAt) {
          dateTime = format(new Date(mail[0].createdAt), 'dd-MM-yyyy hh:mm:ss');
        }

        return (
          <Grid.Row
            key={index.toString()}
            style={{ cursor: 'pointer' }}
            onClick={() => this.mailOnClick(mail)}>
            <Grid.Column
              className={mail[0].isReadMail ? 'readMail' : 'unreadMail'}
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
                        <img alt='To' src={images.yellowArrow} className='toFromIcons' />
                      ) : (
                        <img alt='From' src={images.greenArrow} className='toFromIcons' />
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
            className='unreadMail'
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
                    <img alt='From' src={images.greenArrow} className='toFromIcons' />
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

  mailOnClick = async currOpenMailData => {
    const { toggleFullMailPane } = this.state;
    const { dispatch } = this.props;
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
    if (currOpenMailData[0].txId && !currOpenMailData[0].isReadMail) {
      try {
        await dispatch(
          mailActions.updateTransaction({ ...currOpenMailData[0], ...{ isReadMail: true } })
        );
      } catch (e) {
        console.log(e);
      }
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

  toggleFullMailPane = () => {
    const { toggleFullMailPane } = this.state;
    this.setState({ toggleFullMailPane: !toggleFullMailPane });
  };

  getWindowWidth = () => {
    const { innerWidth: width } = window;
    this.setState({ windowWidth: parseInt(width) });
  };

  render() {
    const { toggleFullMailPane, currentlyOpenMailData, windowWidth } = this.state;
    const { allpayHandles, isLoadingMailTransactions } = this.props;

    if (allpayHandles && allpayHandles.length === 0 && isLoadingMailTransactions) {
      return <Loader active />;
    }
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
                  </Grid.Row>
                </Grid>
              </Grid.Column>
            </Grid.Row>
            <Grid.Row>
              <Grid.Column computer={toggleFullMailPane ? '6' : '16'}>
                <Grid>
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
                </Grid>
              </Grid.Column>
              {toggleFullMailPane ? (
                windowWidth >= 770 || !windowWidth ? (
                  <Grid.Column
                    computer='10'
                    style={{
                      boxShadow: '5px 5px 5px #fafafa',
                    }}>
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
