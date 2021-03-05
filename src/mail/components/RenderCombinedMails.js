import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Grid, Segment, Button, Loader, Icon } from 'semantic-ui-react';
import * as mailActions from '../mailActions';
import * as mailSelectors from '../mailSelectors';

class RenderCombinedMails extends React.Component {
  constructor(props) {
    super(props);
    this.state = { lastRefreshed: null, timeSinceLastRefreshed: null, loading: false };
  }
  async componentDidMount() {
    const { mailTransactions, dispatch } = this.props;
    if (mailTransactions && Object.keys(mailTransactions).length === 0) {
      this.setState({ loading: true });
      try {
        await dispatch(mailActions.getMailTransactions({ limit: 10 }));
        this.setState({ lastRefreshed: new Date() });
        this.timerID = setInterval(
          () =>
            this.setState({
              timeSinceLastRefreshed: new Date(),
            }),
          1000
        );
        const autoRefreshTimeInSecs = 1 * 30 * 1000;
        this.autoRefreshTimer = setInterval(() => {
          this.onRefresh();
        }, autoRefreshTimeInSecs);
        this.setState({ loading: false });
      } catch (error) {
        console.log(error);
      }
    }
  }

  onRefresh = async () => {
    this.setState({ loading: true });
    const { dispatch } = this.props;
    await dispatch(mailActions.getMailTransactions({ diff: true }));
    this.setState({
      lastRefreshed: new Date(),
      timeSinceLastRefreshed: new Date(),
      loading: false,
    });
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
    const { loading } = this.state;
    const { mailTransactions, dispatch } = this.props;
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
      return Object.values(mailTransactions).map((mail, index) => {
        let mailData = null,
          sentMail = false,
          receivedMail = false,
          numberOfMails = mail.length;

        if (mail[0].additionalInfo.value.senderInfo) {
          mailData = mail[0].additionalInfo.value.senderInfo;
          sentMail = true;
        } else {
          mailData = mail[0].additionalInfo.value.recipientInfo;
          receivedMail = true;
        }

        return (
          <Grid.Row
            key={index.toString()}
            style={{ cursor: 'pointer' }}
            onClick={() => this.props.mailOnClick(mail)}>
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
                      {mail[0].createdAt}
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
      return loading ? (
        ''
      ) : (
        <Grid>
          <Grid.Row>
            <Grid.Column width={16}>You have no mails.</Grid.Column>
          </Grid.Row>
        </Grid>
      );
    }
  }
  render() {
    const { loading } = this.state;
    return (
      <>
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
            disabled={loading}
            onClick={this.onRefresh}>
            <Icon name='refresh' />
          </Button>
        </div>
        {loading ? <Loader active /> : ''}
        {this.combinedMailsSection()}
        {this.renderPagination()}
      </>
    );
  }
}

RenderCombinedMails.propTypes = {
  dispatch: PropTypes.func.isRequired,
  mailTransactions: PropTypes.objectOf(PropTypes.array),
};

RenderCombinedMails.defaultProps = {
  mailTransactions: {},
};

const mapStateToProps = state => ({
  isLoadingMailTransactions: mailSelectors.isLoadingMailTransactions(state),
  mailTransactions: mailSelectors.getMailTransactions(state),
  nextTransactionCursor: state.mail.nextTransactionCursor,
});

export default withRouter(connect(mapStateToProps)(RenderCombinedMails));
