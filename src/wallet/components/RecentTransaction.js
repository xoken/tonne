import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import {
  Accordion,
  Button,
  Grid,
  Header,
  Icon,
  Label,
  Placeholder,
  Segment,
} from 'semantic-ui-react';
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
      // this.onRefresh();
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

  renderTransactionDetail(txId, outputs) {
    const { transactionDetails } = this.state;
    const transactionDetail = transactionDetails[txId];
    if (transactionDetail) {
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

    const renderAddress = inputs => {
      if (inputs.length > 1) {
        return `${inputs[0].address} ...`;
      } else if (inputs.length > 0) {
        return `${inputs[0].address}`;
      }
    };

    if (!isLoading && transactions.length > 0) {
      return (
        <Accordion fluid exclusive={false}>
          {transactions.map((transaction, index) => {
            const { inputs: txInps, outputs: txOuts } = transaction;
            const totalInput = txInps.reduce((acc, currInput) => {
              acc = acc + currInput.value;
              return acc;
            }, 0);
            let credit = 0;
            let debit = 0;
            txInps.forEach(input => {
              if (input.isMine) {
                debit = debit + input.value;
              }
            });
            txOuts.forEach(output => {
              if (output.isMine) {
                credit = credit + output.value;
              }
            });
            const renderCreditOrDebit = (credit, debit) => {
              if (credit > 0 && debit > 0) {
                return (
                  <>
                    <span>{`-${satoshiToBSV(debit)} BSV`}</span>
                    <span>{` / `}</span>
                    <span>{`+${satoshiToBSV(credit)} BSV`}</span>
                  </>
                );
              } else if (credit > 0) {
                return <span>{`+${satoshiToBSV(credit)} BSV`}</span>;
              } else if (debit > 0) {
                return <span>{`-${satoshiToBSV(debit)} BSV`}</span>;
              }
              return '';
            };
            const totalCredit = txOuts.reduce((acc, currOutput) => {
              if (currOutput.isMine) {
                acc = acc + currOutput.value;
              }
              return acc;
            }, 0);

            return (
              <Segment key={index.toString()}>
                <Accordion.Title
                  active={activeIndex.includes(index)}
                  index={index}
                  txid={transaction.txId}
                  onClick={this.onTransactionTitleClick}>
                  <Grid>
                    <Grid.Column width={10}>
                      <Icon name='dropdown' />
                      <span>{`${renderAddress(txInps)}`}</span>
                      <span>{` | `}</span>
                      <span title={transaction.txId}>{`${transaction.txId.substring(0, 7)}`}</span>
                    </Grid.Column>
                    <Grid.Column width={5} textAlign='right'>
                      {renderCreditOrDebit(credit, debit)}
                    </Grid.Column>
                    <Grid.Column width={1} textAlign='right'>
                      <Label className='plain'>
                        <i
                          title={`${transaction.confirmations} Confirmations`}
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
                  <Grid>
                    <Grid.Column>
                      <p>{`Transaction Id: ${transaction.txId}`}</p>
                    </Grid.Column>
                  </Grid>
                  <Grid divided columns='two'>
                    <Grid.Row>
                      <Grid.Column>
                        <Header as='h6'>Inputs</Header>
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
                        <Header as='h6'>Outputs</Header>
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
                          <div class='column'>
                            <Label className='plain'>
                              Total credits:
                              <Label.Detail>{`${satoshiToBSV(totalCredit)} BSV`}</Label.Detail>
                            </Label>
                          </div>
                        </div>
                        <div class='ui right aligned grid'>
                          <div class='column'>
                            <Label className='plain'>
                              Change/Other:
                              <Label.Detail>{`${satoshiToBSV(
                                totalInput - totalCredit
                              )} BSV`}</Label.Detail>
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
