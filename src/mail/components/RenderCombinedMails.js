import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Grid, Segment, Button } from 'semantic-ui-react';
import * as mailActions from '../mailActions';
import * as mailSelectors from '../mailSelectors';

class RenderCombinedMails extends React.Component {
  constructor(props) {
    super(props);
    this.state = { lastRefreshed: null, timeSinceLastRefreshed: null };
  }
  async componentDidMount() {
    const { mailTransactions, dispatch } = this.props;
    if (mailTransactions.length === 0) {
      try {
        const mtx = await dispatch(mailActions.getMailTransactions({ limit: 10 }));
        this.setState({ lastRefreshed: new Date() });
        this.timerID = setInterval(
          () =>
            this.setState({
              timeSinceLastRefreshed: new Date(),
            }),
          1000
        );
        const autoRefreshTimeInSecs = 1 * 60 * 1000;
        this.autoRefreshTimer = setInterval(() => {
          this.onRefresh();
        }, autoRefreshTimeInSecs);
      } catch (error) {}
    }
  }

  onRefresh = async () => {
    const { dispatch } = this.props;
    await dispatch(mailActions.getMailTransactions({ diff: true }));
    this.setState({
      lastRefreshed: new Date(),
      timeSinceLastRefreshed: new Date(),
    });
  };
  onNextPage = async () => {
    const { dispatch } = this.props;
    await dispatch(mailActions.getMailTransactions({ limit: 10 }));
  };
  renderPagination = () => {
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
  };

  combinedMailsSection = () => {
    const { mailTransactions } = this.props;
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
    if (mailTransactions.length !== 0) {
      return mailTransactions.map((mail, index) => {
        let mailData = null,
          sentMail = false,
          receivedMail = false;
        if (mail.additionalInfo.value.senderInfo) {
          mailData = mail.additionalInfo.value.senderInfo;
          sentMail = true;
        } else {
          mailData = mail.additionalInfo.value.recipientInfo;
          receivedMail = true;
        }

        return (
          <Grid.Row
            style={{ cursor: 'pointer' }}
            onClick={() =>
              this.props.mailOnClick(mailData.threadId, mailData, sentMail, receivedMail)
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
                  <Grid.Column computer={8} mobile={8} floated='left'>
                    <span style={{ color: 'lightGrey' }} className='word-wrap'>
                      {sentMail
                        ? mailData.commonMetaData.recepient
                        : mailData.commonMetaData.sender}
                    </span>
                  </Grid.Column>
                  <Grid.Column computer={4} mobile={8} floated='right'>
                    <span style={{ color: 'lightGrey', float: 'right' }} className='word-wrap'>
                      {mailData.createdAt}
                    </span>
                  </Grid.Column>
                </Grid.Row>
                <Grid.Row>
                  <Grid.Column computer={16} floated='left'>
                    <b>{mailData.commonMetaData.subject}</b>
                  </Grid.Column>
                </Grid.Row>
              </Grid>
            </Grid.Column>
          </Grid.Row>
        );
      });
    } else {
      return (
        <Grid>
          <Grid.Row>
            <Grid.Column width={16}>You have no mails.</Grid.Column>
          </Grid.Row>
        </Grid>
      );
    }
  };
  render() {
    return (
      <>
        {this.combinedMailsSection()}
        {this.renderPagination()}
      </>
    );
  }
}

RenderCombinedMails.propTypes = {
  dispatch: PropTypes.func.isRequired,
  mailTransactions: PropTypes.arrayOf(PropTypes.object),
};

RenderCombinedMails.defaultProps = {
  mailTransactions: [],
};

const mapStateToProps = state => ({
  isLoadingMailTransactions: mailSelectors.isLoadingMailTransactions(state),
  mailTransactions: mailSelectors.getMailTransactions(state),
  nextTransactionCursor: state.mail.nextTransactionCursor,
});

export default withRouter(connect(mapStateToProps)(RenderCombinedMails));
