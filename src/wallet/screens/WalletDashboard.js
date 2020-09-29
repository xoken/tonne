import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { Button, Dropdown, Icon, Modal, Segment } from 'semantic-ui-react';
import { formatDistanceToNow } from 'date-fns';
import SendTransaction from '../components/SendTransaction';
import RenameProfile from '../components/RenameProfile';
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
      renameProfileModal: false,
      lastRefreshed: null,
      timeSinceLastRefreshed: null,
    };
  }

  async componentDidMount() {
    const { dispatch } = this.props;
    await dispatch(walletActions.getOutputs({ limit: 5 }));
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
      this.onRefresh();
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

  onRenameProfile = () => {
    const { renameProfileModal } = this.state;
    this.setState({ renameProfileModal: !renameProfileModal });
  };

  onRefresh = async () => {
    const { dispatch } = this.props;
    await dispatch(walletActions.getOutputs({ diff: true }));
    this.setState({
      lastRefreshed: new Date(),
      timeSinceLastRefreshed: new Date(),
    });
  };

  onNextPage = async () => {
    const { dispatch } = this.props;
    await dispatch(walletActions.getOutputs({ limit: 5 }));
  };

  renderLastRefresh() {
    const { lastRefreshed } = this.state;
    if (lastRefreshed) {
      return (
        <div className='right floated'>
          <p>
            Last refreshed{`: `}
            {formatDistanceToNow(lastRefreshed, {
              includeSeconds: true,
              addSuffix: true,
            })}
          </p>
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
            <div className='ui grey inverted segment'>
              <h4 className='ui header'>{`OutputTxHash: ${tx[0]}`}</h4>
            </div>
            <div className='ui segments'>
              {tx[1].map((output, txIndex) => {
                return (
                  <div key={txIndex.toString()} className='ui basic segment'>
                    <p>{`Address: ${output.address}`}</p>
                    <p>{`BlockHash: ${output.blockHash}`}</p>
                    <p>{`BlockHeight: ${output.blockHeight}`}</p>
                    <p>{`OutputIndex: ${output.outputIndex}`}</p>
                    <p>{`TxIndex: ${output.txIndex}`}</p>
                    <p>{`Value: ${satoshiToBSV(output.value)} BSV`}</p>

                    <div className='ui segments'>
                      <div className='ui grey secondary inverted segment'>
                        <h4 className='ui header'>SpendInfo</h4>
                      </div>
                      {output.spendInfo ? (
                        <div className='ui segment'>
                          <p>{`spendingBlockHash: ${output.spendInfo.spendingBlockHash}`}</p>
                          <p>{`spendingBlockHeight: ${output.spendInfo.spendingBlockHeight}`}</p>
                          <p>{`spendingTxId: ${output.spendInfo.spendingTxId}`}</p>
                          <p>{`spendingTxIndex: ${output.spendInfo.spendingTxIndex}`}</p>
                          <div className='ui segments'>
                            <div className='ui grey tertiary inverted segment'>
                              <h4 className='ui header'>Spend Data</h4>
                            </div>
                            {output.spendInfo.spendData.map((sData, sDataIndex) => {
                              return (
                                <div key={sDataIndex.toString()} className='ui segment'>
                                  <p>{`spendingOutputIndex: ${sData.spendingOutputIndex}`}</p>
                                  <p>{`value: ${sData.value}`}</p>
                                  <p>{`outputAddress: ${sData.outputAddress}`}</p>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      ) : (
                        <div className='ui segment'>
                          <p>null</p>
                        </div>
                      )}
                    </div>
                    <div className='ui segments'>
                      <div className='ui grey secondary inverted segment'>
                        <h4 className='ui header'>PrevOutpoint</h4>
                      </div>
                      {output.prevOutpoint &&
                        output.prevOutpoint.map((pOutpoint, pOutpointIndex) => {
                          return (
                            <div key={pOutpointIndex.toString()} className='ui segment'>
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

  renderRenameProfileModal() {
    const { renameProfileModal } = this.state;
    return (
      <Modal open={renameProfileModal}>
        <RenameProfile onClose={this.onRenameProfile} logout={this.logout} />
      </Modal>
    );
  }

  render() {
    const { balance, isLoading } = this.props;
    return (
      <>
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
                <Dropdown.Item text='Logout' onClick={this.logout} />
              </Dropdown.Menu>
            </Dropdown>
          </div>
          {isLoading ? (
            <img alt='Loading' src={images.loading} className='loadinggif' />
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
            </>
          )}
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
