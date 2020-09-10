import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { Button, Icon, Modal, Pagination } from 'semantic-ui-react';
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
      sendTxModal: false,
      transactionModal: false,
      lastRefreshed: new Date(),
      autoRefreshToggle: false,
    };
  }

  async componentDidMount() {
    const { dispatch } = this.props;
    dispatch(walletActions.getOutputs());
    this.timerID = setInterval(
      () =>
        this.setState({
          timeSinceLastRefreshed: new Date(),
        }),
      10000
    );
    const autoRefreshTimeInSecs = (1 * 60 * 1000) / 2;
    this.autoRefreshTimer = setInterval(() => {
      console.log('auto refresh');
      this.onRefresh();
    }, autoRefreshTimeInSecs);
  }

  toggleTransactionModal = () => {
    const { transactionModal } = this.state;
    this.setState({ transactionModal: !transactionModal });
  };

  toggleSendTxPopup = () => {
    const { sendTxModal } = this.state;
    this.setState({ sendTxModal: !sendTxModal });
  };

  onRefresh = async () => {
    const { dispatch } = this.props;
    await dispatch(walletActions.getOutputs());
    this.setState({
      lastRefreshed: new Date(),
      timeSinceLastRefreshed: new Date(),
    });
  };

  renderLastRefresh() {
    const { lastRefreshed } = this.state;
    if (lastRefreshed) {
      return (
        <div className='right floated'>
          Last refreshed{': '}
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
      return Object.entries(outputsGroupedBy).map(tx => {
        return (
          <div key={tx[0]} className='card'>
            <div className='card-header' onClick={this.toggleTransactionModal}>
              {tx[0]}
            </div>
            <div className='card-body'>
              {tx[1].map(output => {
                return (
                  <div className='card'>
                    <div className='card-body'>
                      <p>{`Address: ${output.address}`}</p>
                      <p>{`BlockHash: ${output.blockHash}`}</p>
                      <p>{`BlockHeight: ${output.blockHeight}`}</p>
                      <p>{`OutputIndex: ${output.outputIndex}`}</p>
                      <p>{`OutputTxHash: ${output.outputTxHash}`}</p>
                      <p>{`Address: ${output.address}`}</p>
                      <p>{`SpendInfo: ${output.spendInfo}`}</p>
                      <p>{`TxIndex: ${output.txIndex}`}</p>
                      <p>{`Value: ${satoshiToBSV(output.value)}`}</p>
                      <h3>SpendInfo</h3>
                      {this.renderSpendInfo(output.spendInfo)}
                      <h3>PrevOutpoint</h3>
                      {output.prevOutpoint.map(pOutpoint => {
                        return (
                          <div>
                            <p>{`opIndex: ${pOutpoint[0].opIndex}`}</p>
                            <p>{`opTxHash: ${pOutpoint[0].opTxHash}`}</p>
                            <p>{pOutpoint[1]}</p>
                            <p>{pOutpoint[2]}</p>
                            <hr />
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

  renderSpendInfo(spendInfo) {
    if (spendInfo) {
      return (
        <div>
          <p>{`spendingBlockHash: ${spendInfo.spendingBlockHash}`}</p>
          <p>{`spendingBlockHeight: ${spendInfo.spendingBlockHeight}`}</p>
          <p>{`spendingTxId: ${spendInfo.spendingTxId}`}</p>
          <p>{`spendingTxIndex: ${spendInfo.spendingTxIndex}`}</p>
          <h4>Spend Data</h4>
          {spendInfo.spendData.map((sData, index) => {
            return (
              <div>
                <p>{`spendingOutputIndex: ${sData.spendingOutputIndex}`}</p>
                <p>{`value: ${sData.value}`}</p>
                <p>{`outputAddress: ${sData.outputAddress}`}</p>
                <hr />
              </div>
            );
          })}
        </div>
      );
    }
    return <p>null</p>;
  }
  // renderTransaction() {
  //   const { isLoading, outputs } = this.props;
  //   if (!isLoading && outputs.length > 0) {
  //     return outputs.map(({ outputTxHash, value, address }, index) => {
  //       return (
  //         <div key={index} className='card'>
  //           <div className='card-header' onClick={this.toggleTransactionModal}>
  //             {outputTxHash}
  //           </div>
  //           <div className='card-body'>
  //             <div className='row'>
  //               <div className='col-md-6'></div>
  //               <div className='col-md-6'>
  //                 <p>{address}</p>
  //                 <p>{satoshiToBSV(value)}</p>
  //               </div>
  //             </div>
  //           </div>
  //         </div>
  //       );
  //     });
  //   }
  //   return null;
  // }

  renderPagination() {
    return <Pagination size='mini' defaultActivePage={5} totalPages={10} />;
  }

  renderSendTransactionModal() {
    const { sendTxModal } = this.state;
    return (
      <Modal open={sendTxModal} onClose={this.toggleSendTxPopup} onOpen={this.toggleSendTxPopup}>
        <Modal.Header>Send Transactions</Modal.Header>
        <Modal.Content>
          <Modal.Description>
            <SendTransaction onClose={this.toggleSendTxPopup} />
          </Modal.Description>
        </Modal.Content>
      </Modal>
    );
  }

  renderTransactionModal() {
    const { transactionModal } = this.state;
    return (
      <Modal
        open={transactionModal}
        onClose={this.toggleTransactionModal}
        onOpen={this.toggleTransactionModal}>
        <Modal.Header>Transaction</Modal.Header>
        <Modal.Content>
          <Modal.Description></Modal.Description>
        </Modal.Content>
        <Modal.Actions>
          <Button primary onClick={this.toggleTransactionModal}>
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
            <button className='txbtn' onClick={this.logout}>
              Logout
            </button>
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
                  <div className='txbtn' onClick={this.toggleSendTxPopup}>
                    Send
                  </div>
                </>
              )}
            </center>
          </div>
        </div>
        <div class='ui two column centered grid'>
          <div class='column'></div>
          <div class='four column centered row'>
            <div class='column'></div>
            <div class='column'></div>
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
        <div className='row'>
          <div className='col-md-12'>{this.renderTransaction()}</div>
        </div>
        <div className='row'>
          {/* <div className='col-md-12'>{this.renderPagination()}</div> */}
        </div>
        {/* {this.renderTransactionModal()} */}
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
});

export default withRouter(connect(mapStateToProps)(WalletDashboard));
