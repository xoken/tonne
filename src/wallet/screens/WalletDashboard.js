import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { Button, Icon, Modal, Pagination, Dropdown, Grid } from 'semantic-ui-react';
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
    await dispatch(walletActions.getOutputs());
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
          <div key={index.toString()} className='card' onClick={this.toggleTransactionDetailModal}>
            <div className='card-header'>{tx[0]}</div>
            <div className='card-body'>
              {tx[1].map((output, txIndex) => {
                return (
                  <div key={txIndex.toString()} className='card'>
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
                      {output.spendInfo && (
                        <div>
                          <p>{`spendingBlockHash: ${output.spendInfo.spendingBlockHash}`}</p>
                          <p>{`spendingBlockHeight: ${output.spendInfo.spendingBlockHeight}`}</p>
                          <p>{`spendingTxId: ${output.spendInfo.spendingTxId}`}</p>
                          <p>{`spendingTxIndex: ${output.spendInfo.spendingTxIndex}`}</p>
                          <h4>Spend Data</h4>
                          {output.spendInfo.spendData.map((sData, sDataIndex) => {
                            return (
                              <div key={sDataIndex.toString()}>
                                <p>{`spendingOutputIndex: ${sData.spendingOutputIndex}`}</p>
                                <p>{`value: ${sData.value}`}</p>
                                <p>{`outputAddress: ${sData.outputAddress}`}</p>
                                <hr />
                              </div>
                            );
                          })}
                        </div>
                      )}
                      <h3>PrevOutpoint</h3>
                      {output.prevOutpoint.map((pOutpoint, pOutpointIndex) => {
                        return (
                          <div key={pOutpointIndex.toString()}>
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

  renderPagination() {
    return <Pagination size='mini' defaultActivePage={5} totalPages={10} />;
  }

  renderSendTransactionModal() {
    const { sendTransactionModal } = this.state;
    return (
      <Modal
        open={sendTransactionModal}
        onClose={this.toggleSendTransactionModal}
        onOpen={this.toggleSendTransactionModal}>
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
      <Modal open={renameProfileModal} onClose={this.onRenameProfile} onOpen={this.onRenameProfile}>
        <RenameProfile onClose={this.onRenameProfile} logout={this.logout} />
      </Modal>
    );
  }

  render() {
    const { balance, isLoading } = this.props;
    return (
      <>
        {
          // <div className='row'>
          //   <div className='col-md-12'>
          //     <button className='txbtn' onClick={this.logout}>
          //       Logout
          //     </button>
          //   </div>
          // </div>
        }
        <Grid>
          <Grid.Column floated='right' width={2}>
            <Dropdown icon={null} trigger={<Icon name='setting' size='large' />}>
              <Dropdown.Menu>
                <Dropdown.Item text='Rename Profile' onClick={this.onRenameProfile} />
                <Dropdown.Divider />
                <Dropdown.Item icon='sign out' text='Logout' onClick={this.logout} />
              </Dropdown.Menu>
            </Dropdown>
          </Grid.Column>
        </Grid>
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
        <div className='row'>
          <div className='col-md-12'>{this.renderTransaction()}</div>
        </div>
        <div className='row'>
          <div className='col-md-12 col-lg-12 text-center'>
            <nav aria-label='transactions navigation'>
              <ul className='pagination justify-content-center'></ul>
            </nav>
            Enter page number
            <form>
              <input className='pagenuminput' size='5' type='text' />
              <button className='btn btn-primary' type='submit'>
                Go
              </button>
            </form>
          </div>
        </div>
        {
          //this.renderTransactionModal()
        }
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
});

export default withRouter(connect(mapStateToProps)(WalletDashboard));
