import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter, Link } from 'react-router-dom';
import { Accordion, Button, Grid, Header, Icon, Label, Segment } from 'semantic-ui-react';
import { formatDistanceToNow } from 'date-fns';
import { utils } from 'allegory-allpay-sdk';
import RenderOutput from './RenderOutput';
import * as walletActions from '../walletActions';
import * as walletSelectors from '../walletSelectors';

class RecentTransaction extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      lastRefreshed: null,
      timeSinceLastRefreshed: null,
      activeIndex: [],
    };
  }

  async componentDidMount() {
    const { transactions, dispatch } = this.props;
    if (transactions.length === 0) {
      try {
        await dispatch(walletActions.getTransactions({ limit: 10 }));
        await dispatch(walletActions.updateTransactionsConfirmations());
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
    await dispatch(walletActions.getTransactions({ diff: true }));
    await dispatch(walletActions.updateTransactionsConfirmations());
    this.setState({
      lastRefreshed: new Date(),
      timeSinceLastRefreshed: new Date(),
    });
  };

  onNextPage = async () => {
    const { dispatch } = this.props;
    await dispatch(walletActions.getTransactions({ limit: 10 }));
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

  onTransactionTitleClick = async (e, titleProps) => {
    const { index } = titleProps;
    const { activeIndex } = this.state;
    let newIndex;
    if (activeIndex.includes(index)) {
      newIndex = activeIndex.filter(item => item !== index);
    } else {
      newIndex = [...activeIndex, index];
    }
    this.setState({ activeIndex: newIndex });
  };

  renderTransactionHeader(transaction) {
    if (
      transaction.additionalInfo &&
      (transaction.additionalInfo.type === 'Purchase' ||
        transaction.additionalInfo.type === 'Proxy registration')
    ) {
      return (
        <Grid.Column computer={10} mobile={9} className='recentTxidAddressColumn'>
          <Icon name='dropdown' className='dropdownTriangle' />
          <span className='monospace word-wrap recentTxidAddress purplefontcolor fontWeightBold'>
            {`${transaction.additionalInfo.type} : ${transaction.additionalInfo.value}`}
          </span>
        </Grid.Column>
      );
    } else if (transaction.additionalInfo && transaction.additionalInfo.type === 'Allpay Send') {
      return (
        <Grid.Column computer={10} mobile={9} className='recentTxidAddressColumn'>
          <Icon name='dropdown' className='dropdownTriangle purplefontcolor' />
          <span className='monospace word-wrap recentTxidAddress purplefontcolor fontWeightBold marginTopNeg3px'>
            {
              // `${transaction.additionalInfo.type} : `
            }
            {this.renderAllPaySendInfo(transaction.additionalInfo.value)}
          </span>
        </Grid.Column>
      );
    } else if (
      transaction.additionalInfo &&
      (transaction.additionalInfo.type === 'Allpay Meta Tx' ||
        transaction.additionalInfo.type === 'voxMail Tx')
    ) {
      return (
        <Grid.Column computer={10} mobile={9} className='recentTxidAddressColumn'>
          <Icon name='dropdown' className='dropdownTriangle purplefontcolor' />
          <span className='monospace word-wrap recentTxidAddress purplefontcolor fontWeightBold'>
            {transaction.additionalInfo.type}
          </span>
        </Grid.Column>
      );
    } else {
      return (
        <Grid.Column computer={10} mobile={9} className='recentTxidAddressColumn'>
          <Icon name='dropdown' className='dropdownTriangle purplefontcolor' />
          <span className='monospace word-wrap recentTxidAddress'>{transaction.txId}</span>{' '}
          <Link to={'/explorer/transaction/' + transaction.txId}>
            <span className='padding10px'>
              <i className='walletLink'></i>
            </span>
          </Link>
        </Grid.Column>
      );
    }
  }

  renderAllPaySendInfo({ senderInfo, recipientInfo }) {
    if (senderInfo) {
      return (
        <span>
          {senderInfo} <span className='toArrow'>&#129133; </span>
        </span>
      );
    } else if (recipientInfo) {
      return (
        <span>
          {recipientInfo} <span className='fromArrow'>&#129134; </span>
        </span>
      );
    }
  }

  renderTransaction() {
    const { activeIndex } = this.state;
    const { transactions } = this.props;

    if (transactions.length > 0) {
      return (
        <Accordion fluid exclusive={false}>
          {transactions.map((transaction, index) => {
            const { inputs: txInps, outputs: txOuts } = transaction;
            let totalInput = 0;
            let totalOutput = 0;
            let credit = 0;
            let debit = 0;
            let outgoing = 0;

            txInps.forEach(input => {
              totalInput = totalInput + input.value;
              if (input.isMine) {
                debit = debit + input.value;
              }
            });

            txOuts.forEach(output => {
              totalOutput = totalOutput + output.value;
              if (output.isMine) {
                credit = credit + output.value;
              } else {
                outgoing = outgoing + output.value;
              }
            });

            const renderCreditOrDebit = (credit, debit) => {
              if (credit > 0 && debit > 0) {
                return (
                  <>
                    <span className='monospace debit'>{`-${utils.satoshiToBSV(debit)}`}</span>
                    <span className='monospace'>{` / `}</span>
                    <span className='monospace credit'>{`+${utils.satoshiToBSV(credit)}`}</span>
                  </>
                );
              } else if (credit > 0) {
                return <span className='monospace credit'>{`+${utils.satoshiToBSV(credit)}`}</span>;
              } else if (debit > 0) {
                return <span className='monospace debit'>{`-${utils.satoshiToBSV(debit)}`}</span>;
              }
              return '';
            };
            return (
              <Segment key={index.toString()} className='transaction'>
                <Accordion.Title
                  active={activeIndex.includes(index)}
                  index={index}
                  onClick={this.onTransactionTitleClick}>
                  <Grid>
                    {this.renderTransactionHeader(transaction)}
                    <Grid.Column
                      computer={5}
                      tablet={5}
                      mobile={5}
                      textAlign='right'
                      className='word-wrap'>
                      {renderCreditOrDebit(credit, debit)}
                    </Grid.Column>
                    <Grid.Column computer={1} tablet={1} mobile={2} textAlign='right'>
                      <Label className='plain'>
                        <i
                          title={
                            transaction.confirmation !== null
                              ? transaction.confirmation > 6
                                ? 'More than 6 Confirmations'
                                : `${transaction.confirmation} Confirmations`
                              : 'Unconfirmed Transaction'
                          }
                          className={
                            transaction.confirmation !== null
                              ? transaction.confirmation > 6
                                ? 'green lock icon'
                                : 'warning unlock alternate icon'
                              : 'red unlock alternate icon'
                          }></i>
                      </Label>
                    </Grid.Column>
                  </Grid>
                </Accordion.Title>
                <Accordion.Content active={activeIndex.includes(index)}>
                  <Grid divided stackable columns='two'>
                    {!transaction.additionalInfo ? (
                      ''
                    ) : (
                      <Grid.Row className='paddingTop28px'>
                        <Grid.Column width='16' className='recentTxidAddressColumn'>
                          <span className='monospace word-wrap paddingLeftRight14px'>
                            <span className='purplefontcolor fontWeightBold'>TxID : </span>
                            {transaction.txId}
                          </span>{' '}
                          <Link to={'/explorer/transaction/' + transaction.txId}>
                            <span className='padding10px'>
                              <i className='walletLink'></i>
                            </span>
                          </Link>
                        </Grid.Column>
                      </Grid.Row>
                    )}
                    <Grid.Row>
                      <Grid.Column>
                        <div className='paddingLeftRight14px'>
                          <Header as='h5' className='monospace purplefontcolor'>
                            Inputs
                          </Header>
                          {txInps.map((input, index) => {
                            return (
                              <Grid key={index.toString()}>
                                <Grid.Column computer='12' tablet='11' mobile='11'>
                                  <p className='monospace word-wrap recentTxidAddressColumn'>
                                    <span
                                      className={input.isNUTXO ? 'nUTXO' : undefined}
                                      title={input.isNUTXO ? 'Name UTXO' : undefined}>
                                      {input.address}
                                    </span>

                                    <Link
                                      to={'/explorer/address/' + input.address}
                                      className='recentTxidAddress'>
                                      <span className='padding10px'>
                                        <i className='walletLink'></i>
                                      </span>
                                    </Link>
                                  </p>
                                </Grid.Column>
                                <Grid.Column computer='4' tablet='5' mobile='5' textAlign='right'>
                                  <p className='monospace'>
                                    <span className={input.isMine ? 'debit' : ''}>
                                      {utils.satoshiToBSV(input.value)}
                                    </span>
                                  </p>
                                </Grid.Column>
                              </Grid>
                            );
                          })}
                        </div>
                      </Grid.Column>
                      <Grid.Column>
                        <div className='paddingLeftRight14px'>
                          <Header as='h5' className='monospace purplefontcolor'>
                            Outputs
                          </Header>
                          {txOuts.map((output, index) => {
                            return (
                              <RenderOutput
                                key={index.toString()}
                                addressStyle={output.isNUTXO ? 'nUTXO' : ''}
                                address={output.address}
                                script={output.lockingScript}
                                title={output.isNUTXO ? 'Name UTXO' : undefined}
                                valueStyle={output.isMine ? 'credit' : ''}
                                value={output.value}
                              />
                            );
                          })}
                          <div className='ui right aligned grid'>
                            <div className='column'>
                              <Label className='monospace plain'>
                                {debit > 0 ? 'Total debit:' : 'Total credit:'}
                                <Label.Detail>
                                  {debit > 0
                                    ? utils.satoshiToBSV(outgoing)
                                    : utils.satoshiToBSV(credit)}
                                </Label.Detail>
                              </Label>
                            </div>
                          </div>
                          <div className='ui right aligned grid'>
                            <div className='column'>
                              <Label className='monospace plain'>
                                Fee:
                                <Label.Detail>
                                  {utils.satoshiToBSV(totalInput - totalOutput)}
                                </Label.Detail>
                              </Label>
                            </div>
                          </div>
                        </div>
                      </Grid.Column>
                    </Grid.Row>
                  </Grid>
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
          <Button className='coral' onClick={this.onNextPage}>
            Next Page
          </Button>
        </Segment>
      );
    }
    return null;
  }

  render() {
    const { isLoading } = this.props;
    return (
      <>
        <Grid stackable>
          <Grid.Row>
            <Grid.Column width={8} verticalAlign='middle' floated='left'>
              <h3 className='purplefontcolor'>Recent Transactions</h3>
            </Grid.Column>
            <Grid.Column width={8} verticalAlign='middle' floated='right'>
              <div className='floatRightOnComp'>
                {this.renderLastRefresh()}
                <Button
                  circular
                  icon
                  style={{
                    marginRight: '0px',
                  }}
                  className='peach'
                  disabled={isLoading}
                  onClick={this.onRefresh}>
                  <Icon name='refresh' />
                </Button>
              </div>
            </Grid.Column>
          </Grid.Row>
        </Grid>
        <div className='ui grid recent-transactions'>{this.renderTransaction()}</div>
        {this.renderPagination()}
      </>
    );
  }

  componentWillUnmount() {
    clearInterval(this.timerID);
    clearInterval(this.autoRefreshTimer);
  }
}

RecentTransaction.propTypes = {
  dispatch: PropTypes.func.isRequired,
  transactions: PropTypes.arrayOf(PropTypes.object),
};

RecentTransaction.defaultProps = {
  transactions: [],
};

const mapStateToProps = state => ({
  isLoading: walletSelectors.isLoadingTransactions(state),
  transactions: walletSelectors.getTransactions(state),
  nextTransactionCursor: state.wallet.nextTransactionCursor,
});

export default withRouter(connect(mapStateToProps)(RecentTransaction));
