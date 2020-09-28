import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { Button, Icon, Modal, Grid } from 'semantic-ui-react';
import { formatDistanceToNow } from 'date-fns';
import SendTransaction from '../components/SendTransaction';
import * as authActions from '../../auth/authActions';
import * as walletActions from '../walletActions';
import * as walletSelectors from '../walletSelectors';
import { groupBy, satoshiToBSV } from '../../shared/utils';
import images from '../../shared/images';

class WalletDashboard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      sendTransactionModal: false,
      transactionDetailModal: false,
      lastRefreshed: null,
      timeSinceLastRefreshed: null,
    };
  }

  async componentDidMount() {
    const { dispatch } = this.props;
    await dispatch(walletActions.getOutputs({ limit: 10 }));
    await dispatch(walletActions.getBalance());
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

  toggleTransactionDetailModal = () => {
    const { transactionDetailModal } = this.state;
    if (transactionDetailModal) {
    }
    this.setState({ transactionDetailModal: !transactionDetailModal });
  };

  toggleSendTransactionModal = () => {
    const { sendTransactionModal } = this.state;
    this.setState({ sendTransactionModal: !sendTransactionModal });
  };

  onRefresh = async () => {
    // const { dispatch } = this.props;
    // await dispatch(walletActions.getOutputs({ limit: 2 }));
    this.setState({
      lastRefreshed: new Date(),
      timeSinceLastRefreshed: new Date(),
    });
  };

  onNextPage = async () => {
    const { dispatch } = this.props;
    await dispatch(walletActions.getOutputs({ limit: 10 }));
  };

  renderLastRefresh() {
    const { lastRefreshed } = this.state;
    if (lastRefreshed) {
      return (
        <div className='right floated'>
          Last refreshed{`: `}
          {formatDistanceToNow(lastRefreshed, {
            includeSeconds: true,
            addSuffix: true,
          })}
        </div>
      );
    }
  }

  logout = () => {
    const { dispatch } = this.props;
    dispatch(authActions.logout());
  };

  renderTransaction() {
    const { isLoading, outputs } = this.props;
    if (!isLoading && outputs.length > 0) {
      const outputsGroupedBy = groupBy(outputs, 'outputTxHash');
      return Object.entries(outputsGroupedBy).map((tx, index) => {
        return (
          <div
            key={index.toString()}
            className='ui segments'
            onClick={this.toggleTransactionDetailModal}>
            <div className='ui segment'>
              <h4 className='ui header'>{`OutputTxHash: ${tx[0]}`}</h4>
            </div>
            <div className='ui segments'>
              {tx[1].map((output, txIndex) => {
                return (
                  <div key={txIndex.toString()} className='ui secondary segment'>
                    <p>{`Address: ${output.address}`}</p>
                    <p>{`BlockHash: ${output.blockHash}`}</p>
                    <p>{`BlockHeight: ${output.blockHeight}`}</p>
                    <p>{`OutputIndex: ${output.outputIndex}`}</p>
                    <p>{`TxIndex: ${output.txIndex}`}</p>
                    <p>{`Value: ${satoshiToBSV(output.value)} BSV`}</p>

                    <div className='ui segments'>
                      <div className='ui segment'>
                        <h4 className='ui header'>SpendInfo</h4>
                      </div>
                      {output.spendInfo ? (
                        <div className='ui secondary segment'>
                          <p>{`spendingBlockHash: ${output.spendInfo.spendingBlockHash}`}</p>
                          <p>{`spendingBlockHeight: ${output.spendInfo.spendingBlockHeight}`}</p>
                          <p>{`spendingTxId: ${output.spendInfo.spendingTxId}`}</p>
                          <p>{`spendingTxIndex: ${output.spendInfo.spendingTxIndex}`}</p>
                          <div className='ui segments'>
                            <div className='ui segment'>
                              <h4 className='ui header'>Spend Data</h4>
                            </div>
                            {output.spendInfo.spendData.map((sData, sDataIndex) => {
                              return (
                                <div key={sDataIndex.toString()} className='ui secondary segment'>
                                  <p>{`spendingOutputIndex: ${sData.spendingOutputIndex}`}</p>
                                  <p>{`value: ${sData.value}`}</p>
                                  <p>{`outputAddress: ${sData.outputAddress}`}</p>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      ) : (
                        <div className='ui secondary segment'>
                          <p>null</p>
                        </div>
                      )}
                    </div>
                    <div className='ui segments'>
                      <div className='ui segment'>
                        <h4 className='ui header'>PrevOutpoint</h4>
                      </div>
                      {output.prevOutpoint.map((pOutpoint, pOutpointIndex) => {
                        return (
                          <div key={pOutpointIndex.toString()} className='ui secondary segment'>
                            <p>{`opIndex: ${pOutpoint[0].opIndex}`}</p>
                            <p>{`opTxHash: ${pOutpoint[0].opTxHash}`}</p>
                            <p>{pOutpoint[1]}</p>
                            <p>{pOutpoint[2]}</p>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      });
    }
    return null;
  }

  renderPagination() {
    const { nextOutputsCursor } = this.props;
    if (nextOutputsCursor) {
      return (
        <Grid centered columns={1}>
          <Grid.Column>
            <Button color='yellow' onClick={this.onNextPage}>
              Next Page
            </Button>
          </Grid.Column>
        </Grid>
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

  renderTransactionModal() {
    const { transactionDetailModal } = this.state;
    return (
      <Modal
        open={transactionDetailModal}
        onClose={this.toggleTransactionDetailModal}
        onOpen={this.toggleTransactionDetailModal}>
        <Modal.Header>Transaction</Modal.Header>
        <Modal.Content>
          <Modal.Description></Modal.Description>
        </Modal.Content>
        <Modal.Actions>
          <Button primary onClick={this.toggleTransactionDetailModal}>
            Ok
          </Button>
        </Modal.Actions>
      </Modal>
    );
  }

  render() {
    const { balance, isLoading } = this.props;
    return (
      <>
        <div className='row'>
          <div className='col-md-12'>
            <Button className='txbtn' onClick={this.logout}>
              Logout
            </Button>
          </div>
        </div>
        <div className='row'>
          <div className='col-md-12 border-left-right'>
            <center>
              <div className='cryptologo'>
                <img src={images.bsv} alt='' />
              </div>
              {isLoading ? (
                <img alt='Loading' src={images.loading} className='loadinggif' />
              ) : (
                <>
                  <div className='gracefuload'>
                    <h5>Your Current Balance is</h5>
                    <h4>{satoshiToBSV(balance)} BSV</h4>
                  </div>
                  <Button className='txbtn' onClick={this.toggleSendTransactionModal}>
                    Send
                  </Button>
                </>
              )}
            </center>
          </div>
        </div>
        <div className='ui two column centered grid'>
          <div className='column'></div>
          <div className='four column centered row'>
            <div className='column'></div>
            <div className='column'></div>
          </div>
        </div>

        <div className='ui grid'>
          <div className='left floated six wide column'>
            <h3>Recent Transactions</h3>
          </div>
          <div className='right floated right aligned six wide column'>
            <Button className='right floated' icon onClick={this.onRefresh}>
              <Icon name='refresh' />
            </Button>
            {this.renderLastRefresh()}
          </div>
        </div>
        {this.renderTransaction()}
        {this.renderPagination()}
        {this.renderSendTransactionModal()}
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
  outputs: PropTypes.arrayOf(PropTypes.object),
};

WalletDashboard.defaultProps = {
  outputs: [],
};

const mapStateToProps = state => ({
  isLoading: walletSelectors.isLoading(state),
  balance: walletSelectors.getBalance(state),
  outputs: walletSelectors.getOutputs(state),
  nextOutputsCursor: state.wallet.nextOutputsCursor,
});

export default withRouter(connect(mapStateToProps)(WalletDashboard));
