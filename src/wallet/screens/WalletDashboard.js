import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import {
  Accordion,
  Button,
  Dropdown,
  Grid,
  Header,
  Icon,
  Label,
  Loader,
  Modal,
  Placeholder,
  Segment,
} from 'semantic-ui-react';
import { formatDistanceToNow } from 'date-fns';
import SendTransaction from '../components/SendTransaction';
import ReceiveTransaction from '../components/ReceiveTransaction';
import RenameProfile from '../components/RenameProfile';
import * as authActions from '../../auth/authActions';
import * as walletActions from '../walletActions';
import * as walletSelectors from '../walletSelectors';
import { satoshiToBSV } from '../../shared/utils';
import images from '../../shared/images';
// import { wallet } from 'nipkow-sdk';

class WalletDashboard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      sendTransactionModal: false,
      receiveTransactionModal: false,
      renameProfileModal: false,
      lastRefreshed: null,
      timeSinceLastRefreshed: null,
      activeIndex: [],
      transactionDetails: {},
    };
  }

  async componentDidMount() {
    const { dispatch } = this.props;
    await dispatch(walletActions.getTransactions({ limit: 5 }));
    await dispatch(walletActions.updateUnconfirmedTransactions());
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
  }

  toggleSendTransactionModal = () => {
    const { sendTransactionModal } = this.state;
    this.setState({ sendTransactionModal: !sendTransactionModal });
  };

  toggleReceiveTransactionModal = () => {
    const { receiveTransactionModal } = this.state;
    this.setState({ receiveTransactionModal: !receiveTransactionModal });
  };

  onRenameProfile = () => {
    const { renameProfileModal } = this.state;
    this.setState({ renameProfileModal: !renameProfileModal });
  };

  onRefresh = async () => {
    const { dispatch } = this.props;
    await dispatch(walletActions.getTransactions({ diff: true }));
    await dispatch(walletActions.updateUnconfirmedTransactions());
    this.setState({
      lastRefreshed: new Date(),
      timeSinceLastRefreshed: new Date(),
    });
  };

  onNextPage = async () => {
    const { dispatch } = this.props;
    await dispatch(walletActions.getTransactions({ limit: 5 }));
  };

  renderLastRefresh() {
    const { lastRefreshed } = this.state;
    if (lastRefreshed) {
      return (
        <span className='last-refresh'>
          Last refreshed{`: `}
          {formatDistanceToNow(lastRefreshed, {
            includeSeconds: true,
            addSuffix: true,
          })}
        </span>
      );
    }
  }

  onLogout = () => {
    const { dispatch } = this.props;
    dispatch(authActions.logout());
  };

  onTransactionTitleClick = async (e, titleProps) => {
    const { index, txid: txId } = titleProps;
    const { activeIndex, transactionDetails } = this.state;
    const { dispatch } = this.props;
    let newIndex;
    if (activeIndex.includes(index)) {
      newIndex = activeIndex.filter(item => item !== index);
    } else {
      newIndex = [...activeIndex, index];
    }
    this.setState({ activeIndex: newIndex });
    if (!transactionDetails[txId]) {
      const tx = await dispatch(walletActions.getTransaction(txId));
      this.setState({
        transactionDetails: { ...transactionDetails, [txId]: tx },
      });
    }
  };

  renderTransactionDetail(txId, outputs) {
    const { transactionDetails } = this.state;
    const transactionDetail = transactionDetails[txId];
    if (transactionDetail) {
      const {
        tx: { txInps, txOuts },
      } = transactionDetail;
      const totalOutput = txOuts.reduce((acc, currOutput) => {
        acc = acc + currOutput.value;
        return acc;
      }, 0);
      const totalCredit = txOuts.reduce((acc, currOutput) => {
        const isFound = outputs.find(output => output.address === currOutput.address);
        if (isFound) {
          acc = acc + currOutput.value;
        }
        return acc;
      }, 0);
      return (
        <Grid divided columns='two'>
          <Grid.Row>
            <Grid.Column>
              <Header as='h4'>Inputs</Header>
              {txInps.map(input => {
                return (
                  <Grid>
                    <Grid.Column width='10'>
                      <p>{input.address}</p>
                    </Grid.Column>
                    <Grid.Column width='6' textAlign='right'>
                      <p>{`${satoshiToBSV(input.value)} BSV`}</p>
                    </Grid.Column>
                  </Grid>
                );
              })}
            </Grid.Column>
            <Grid.Column>
              <Header as='h4'>Outputs</Header>
              {txOuts.map(output => {
                return (
                  <Grid>
                    <Grid.Column width='10'>
                      <p>{output.address}</p>
                    </Grid.Column>
                    <Grid.Column width='6' textAlign='right'>
                      <p>{`${satoshiToBSV(output.value)} BSV`}</p>
                    </Grid.Column>
                  </Grid>
                );
              })}
              <div class='ui right aligned grid'>
                <div class='sixteen wide column'>
                  <Label className='plain'>
                    Total credits:
                    <Label.Detail>{`${satoshiToBSV(totalCredit)} BSV`}</Label.Detail>
                  </Label>
                </div>
              </div>
              <div class='ui right aligned grid'>
                <div class='sixteen wide column'>
                  <Label className='plain'>
                    Change/Other:
                    <Label.Detail>{`${satoshiToBSV(totalOutput - totalCredit)} BSV`}</Label.Detail>
                  </Label>
                </div>
              </div>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      );
    }
    return (
      <Placeholder>
        <Placeholder.Paragraph>
          <Placeholder.Line />
          <Placeholder.Line />
          <Placeholder.Line />
          <Placeholder.Line />
          <Placeholder.Line />
        </Placeholder.Paragraph>
      </Placeholder>
    );
  }

  renderTransaction() {
    const { activeIndex } = this.state;
    const { isLoading, transactions } = this.props;

    const renderAddress = transaction => {
      const { outputs } = transaction;
      if (outputs) {
        if (outputs.length > 1) {
          return `${outputs[0].address} ...`;
        } else if (outputs.length > 0) {
          return `${outputs[0].address}`;
        }
      }
    };

    if (!isLoading && transactions.length > 0) {
      return (
        <Accordion fluid exclusive={false}>
          {transactions.map((transaction, index) => {
            let credit = 0;
            let debit = 0;
            transaction.outputs.forEach(output => {
              if (output.spendInfo) {
                debit = debit + output.value;
              } else {
                credit = credit + output.value;
              }
            });
            const printCreditOrDebit = (credit, debit) => {
              if (credit > 0 && debit > 0) {
                return `${satoshiToBSV(credit)} BSV Credit | ${satoshiToBSV(debit)} BSV Debit`;
              } else if (credit > 0) {
                return `${satoshiToBSV(credit)} BSV Credit`;
              } else if (debit > 0) {
                return `${satoshiToBSV(debit)} BSV Debit`;
              }
              return '';
            };
            return (
              <Segment key={index.toString()}>
                <Accordion.Title
                  active={activeIndex.includes(index)}
                  index={index}
                  txid={transaction.txId}
                  onClick={this.onTransactionTitleClick}>
                  <Grid>
                    <Grid.Column floated='left' width={10}>
                      <Icon name='dropdown' />
                      {`${renderAddress(transaction)} | ${transaction.txId}`}
                    </Grid.Column>
                    <Grid.Column floated='right' width={4}>
                      {printCreditOrDebit(credit, debit)}
                    </Grid.Column>
                    <Grid.Column floated='right' width={2}>
                      {transaction.confirmations > 20
                        ? 'Confirmed'
                        : `${transaction.confirmations} Confirmations`}
                    </Grid.Column>
                  </Grid>
                </Accordion.Title>
                <Accordion.Content active={activeIndex.includes(index)}>
                  {this.renderTransactionDetail(transaction.txId, transaction.outputs)}
                </Accordion.Content>
              </Segment>
            );
          })}
        </Accordion>
      );
    }
    return null;
  }

  renderPagination() {
    const { nextTransactionCursor } = this.props;
    if (nextTransactionCursor) {
      return (
        <Segment basic textAlign='center'>
          <Button color='yellow' onClick={this.onNextPage}>
            Next Page
          </Button>
        </Segment>
      );
    }
    return null;
  }

  renderSendTransactionModal() {
    const { sendTransactionModal } = this.state;
    return (
      <Modal open={sendTransactionModal}>
        <Modal.Header>Send Transactions</Modal.Header>
        <Modal.Content>
          <Modal.Description>
            <SendTransaction onClose={this.toggleSendTransactionModal} />
          </Modal.Description>
        </Modal.Content>
      </Modal>
    );
  }

  renderReceiveTransactionModal() {
    const { receiveTransactionModal } = this.state;
    return (
      <Modal size='large' open={receiveTransactionModal}>
        <Modal.Header>Receive Transactions</Modal.Header>
        <Modal.Content>
          <Modal.Description>
            <ReceiveTransaction onClose={this.toggleReceiveTransactionModal} />
          </Modal.Description>
        </Modal.Content>
        <Modal.Actions>
          <Button content='Ok' onClick={this.toggleReceiveTransactionModal} positive />
        </Modal.Actions>
      </Modal>
    );
  }

  renderRenameProfileModal() {
    const { renameProfileModal } = this.state;
    return (
      <Modal open={renameProfileModal}>
        <RenameProfile onClose={this.onRenameProfile} onLogout={this.onLogout} />
      </Modal>
    );
  }

  render() {
    const { balance, isLoading } = this.props;
    return (
      <>
        {/* <Button color='yellow' onClick={() => wallet.runScript()}>
          Run
        </Button> */}
        <div className='ui center aligned segment'>
          <div className='ui basic clearing segment'>
            <Dropdown
              button
              className='circular icon top left right floated'
              icon='setting'
              additionPosition='top'
              pointing>
              <Dropdown.Menu>
                <Dropdown.Item text='Rename Profile' onClick={this.onRenameProfile} />
                <Dropdown.Divider />
                <Dropdown.Item text='Logout' onClick={this.onLogout} />
              </Dropdown.Menu>
            </Dropdown>
          </div>
          {isLoading ? (
            <Loader active />
          ) : (
            <>
              <img className='ui small centered image' src={images.bsv} alt='BitcoinSV' />
              <div className='ui header'>
                Your Current Balance is
                <br />
                {satoshiToBSV(balance)} BSV
              </div>
              <Button color='yellow' onClick={this.toggleSendTransactionModal}>
                Send
              </Button>
              <Button color='yellow' onClick={this.toggleReceiveTransactionModal}>
                Receive
              </Button>
            </>
          )}
        </div>
        <div className='ui grid'>
          <div className='left floated six wide column'>
            <h3>Recent Transactions</h3>
          </div>
          <div className='right floated right aligned six wide column'>
            <div className='ui grid'>
              <div className='column'>
                {this.renderLastRefresh()}
                <Button className='' icon onClick={this.onRefresh}>
                  <Icon name='refresh' />
                </Button>
              </div>
            </div>
          </div>
        </div>
        <div className='ui grid'>{this.renderTransaction()}</div>
        {this.renderPagination()}
        {this.renderSendTransactionModal()}
        {this.renderReceiveTransactionModal()}
        {this.renderRenameProfileModal()}
      </>
    );
  }

  componentWillUnmount() {
    clearInterval(this.timerID);
    clearInterval(this.autoRefreshTimer);
  }
}

WalletDashboard.propTypes = {
  dispatch: PropTypes.func.isRequired,
  isLoading: PropTypes.bool.isRequired,
  balance: PropTypes.number.isRequired,
  transactions: PropTypes.arrayOf(PropTypes.object),
};

WalletDashboard.defaultProps = {
  transactions: [],
};

const mapStateToProps = state => ({
  isLoading: walletSelectors.isLoading(state),
  balance: walletSelectors.getBalance(state),
  transactions: walletSelectors.getTransactions(state),
  nextTransactionCursor: state.wallet.nextTransactionCursor,
});

export default withRouter(connect(mapStateToProps)(WalletDashboard));
