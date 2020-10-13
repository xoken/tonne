import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { Accordion, Button, Grid, Header, Icon, Label, Segment } from 'semantic-ui-react';
import { formatDistanceToNow } from 'date-fns';
import * as walletActions from '../walletActions';
import * as walletSelectors from '../walletSelectors';
import { satoshiToBSV } from '../../shared/utils';

class RecentTransaction extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      lastRefreshed: null,
      timeSinceLastRefreshed: null,
      activeIndex: [],
      transactionDetails: {},
    };
  }

  async componentDidMount() {
    const { dispatch } = this.props;
    await dispatch(walletActions.getTransactions({ limit: 10 }));
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

  renderTransaction() {
    const { activeIndex } = this.state;
    const { isLoading, transactions } = this.props;

    if (!isLoading && transactions.length > 0) {
      return (
        <Accordion fluid exclusive={false}>
          {transactions.map((transaction, index) => {
            const { inputs: txInps, outputs: txOuts } = transaction;

            let totalInput = 0;
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
                    <span className='debit'>{`-${satoshiToBSV(debit)} BSV`}</span>
                    <span>{` / `}</span>
                    <span className='credit'>{`+${satoshiToBSV(credit)} BSV`}</span>
                  </>
                );
              } else if (credit > 0) {
                return <span className='credit'>{`+${satoshiToBSV(credit)} BSV`}</span>;
              } else if (debit > 0) {
                return <span className='debit'>{`-${satoshiToBSV(debit)} BSV`}</span>;
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
                    <Grid.Column width={10}>
                      <Icon name='dropdown' />
                      <span>{transaction.txId}</span>
                    </Grid.Column>
                    <Grid.Column width={5} textAlign='right'>
                      {renderCreditOrDebit(credit, debit)}
                    </Grid.Column>
                    <Grid.Column width={1} textAlign='right'>
                      <Label className='plain'>
                        <i
                          title={
                            transaction.confirmations > 10
                              ? 'More than 10 Confirmations'
                              : `${transaction.confirmations} Confirmations`
                          }
                          className={
                            transaction.confirmations > 10
                              ? 'green lock icon'
                              : 'warning unlock alternate icon'
                          }></i>
                      </Label>
                    </Grid.Column>
                  </Grid>
                </Accordion.Title>
                <Accordion.Content active={activeIndex.includes(index)}>
                  <Grid divided columns='two'>
                    <Grid.Row>
                      <Grid.Column>
                        <Header as='h6'>Inputs</Header>
                        {txInps.map(input => {
                          return (
                            <Grid key={input.txInputIndex}>
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
                        <Header as='h6'>Outputs</Header>
                        {txOuts.map(output => {
                          return (
                            <Grid key={output.outputIndex}>
                              <Grid.Column width='10'>
                                <p>{output.address}</p>
                              </Grid.Column>
                              <Grid.Column width='6' textAlign='right'>
                                <p>{`${satoshiToBSV(output.value)} BSV`}</p>
                              </Grid.Column>
                            </Grid>
                          );
                        })}
                        <div className='ui right aligned grid'>
                          <div className='column'>
                            <Label className='plain'>
                              {debit > 0 ? 'Total debit:' : 'Total credit:'}
                              <Label.Detail>
                                {debit > 0
                                  ? `${satoshiToBSV(outgoing)} BSV`
                                  : `${satoshiToBSV(credit)} BSV`}
                              </Label.Detail>
                            </Label>
                          </div>
                        </div>
                        <div className='ui right aligned grid'>
                          <div className='column'>
                            <Label className='plain'>
                              Change/Other:
                              <Label.Detail>
                                {debit > 0
                                  ? `${satoshiToBSV(totalInput - outgoing)} BSV`
                                  : `${satoshiToBSV(totalInput - credit)} BSV`}
                              </Label.Detail>
                            </Label>
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
          <Button color='yellow' onClick={this.onNextPage}>
            Next Page
          </Button>
        </Segment>
      );
    }
    return null;
  }

  render() {
    // const { isLoading } = this.props;
    return (
      <>
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
  isLoading: PropTypes.bool.isRequired,
  transactions: PropTypes.arrayOf(PropTypes.object),
};

RecentTransaction.defaultProps = {
  transactions: [],
};

const mapStateToProps = state => ({
  isLoading: walletSelectors.isLoading(state),
  transactions: walletSelectors.getTransactions(state),
  nextTransactionCursor: state.wallet.nextTransactionCursor,
});

export default withRouter(connect(mapStateToProps)(RecentTransaction));
