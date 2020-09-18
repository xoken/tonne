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
import ExplorerTransaction from '../../explorer/screens/ExplorerTransaction';

class WalletDashboard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      sendTxModal: false,
      transactionModal: false,
      lastRefreshed: new Date(),
      autoRefreshToggle: false,
      selectnum: '',
      txid: '',
    };
  }
  transactionList = [];
  numberofpages;
  pagearray = [];
  index;
  pagearrlength = 9;
  selected = 1;
  pagescontainer = [];
  outputTempCache = [];

  async componentDidMount() {
    const { dispatch } = this.props;
    dispatch(walletActions.getOutputs());
    // this.timerID = setInterval(
    //   () =>
    //     this.setState({
    //       timeSinceLastRefreshed: new Date(),
    //     }),
    //   10000
    // );
    // const autoRefreshTimeInSecs = 59 * 60 * 1000;
    // this.autoRefreshTimer = setInterval(() => {
    //   this.onRefresh();
    // }, autoRefreshTimeInSecs);
  }

  toggleTransactionModal = txidpar => {
    const { transactionModal } = this.state;
    if (transactionModal) {
      this.setState({ txid: txidpar });
    }
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
          <div key={tx[0]} className='card' onClick={this.toggleTransactionModal(tx[0])}>
            <div className='card-header'>{tx[0]}</div>
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
  //     const outputsGroupedBy = groupBy(outputs, 'outputTxHash');
  //     console.table(Object.entries(outputsGroupedBy));
  //     this.outputTempCache = outputsGroupedBy;
  //     this.numberofpages = Math.ceil(Object.entries(outputsGroupedBy).length / 10);
  //     console.log(this.numberofpages + 'this.numberofpages');
  //     if (this.numberofpages < 10) {
  //       this.pagearrlength = this.numberofpages;
  //       for (var b = 0; b < this.numberofpages; b++) {
  //         this.pagearray[b] = b + 1;
  //       }
  //     } else {
  //       this.pagearray = [1, 2, 3, 4, 5, 6, 7, '-', this.numberofpages];
  //     }
  //     //localStorage.setItem('outputCache', outputsGroupedBy);
  //     this.updatepagearray();
  //     this.printtransactions();
  //     debugger;
  //   }
  // }

  printtransactions = () => {
    Object.entries(this.outputTempCache).forEach(([, tx], outindex) => {
      this.transactionList.push(
        <div key={tx[0]} className='card' onClick={this.toggleTransactionModal(tx[0])}>
          <div className='card-header'>{tx[0]}</div>
          <div className='card-body'>{this.trxs(tx[1])}</div>
        </div>
      );
    });
  };

  trxs = tx1 => {
    if (tx1 !== null && tx1 !== undefined) {
      Object.entries(tx1).map(output => {
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
              {}
            </div>
          </div>
        );
      });
    }
  };

  prevouts = prevOutpoint => {
    if (prevOutpoint !== null && prevOutpoint !== undefined) {
      Object.entries(prevOutpoint).map(pOutpoint => {
        return (
          <div>
            <p>{`opIndex: ${pOutpoint[0].opIndex}`}</p>
            <p>{`opTxHash: ${pOutpoint[0].opTxHash}`}</p>
            <p>{pOutpoint[1]}</p>
            <p>{pOutpoint[2]}</p>
            <hr />
          </div>
        );
      });
    }
  };

  renderPagination() {
    return <Pagination size='mini' defaultActivePage={5} totalPages={10} />;
  }

  pagebutton = event => {
    event.preventDefault();
    if (
      this.state.selectnum !== '' &&
      this.state.selectnum <= this.numberofpages &&
      this.state.selectnum > 0
    ) {
      this.selected = this.state.selectnum;
      this.transactionList = this.printtransactions();
      console.log(this.selected);
      if (this.selected <= this.pagearrlength - 2) {
        this.index = 1;
      } else if (this.selected >= this.numberofpages - (this.pagearrlength - 2)) {
        this.index = this.pagearrlength;
      }
      this.updatepagearray();
    }
  };

  addlistener = event => {
    this.selected = event.target.value;
    this.updatepagearray();
    this.transactionList = this.printtransactions();
  };

  updatepagearray = () => {
    if (this.numberofpages > this.pagearrlength) {
      var b, tempindex;
      if (this.pagearray.indexOf(parseInt(this.selected)) >= 0) {
        this.index = this.pagearray.indexOf(parseInt(this.selected));
      }

      if (
        this.index <= Math.floor(this.pagearrlength / 2) &&
        this.selected <= Math.ceil(this.numberofpages / 3) &&
        this.selected <= this.pagearrlength - 2
      ) {
        this.pagearray[this.pagearrlength - 2] = '-';
        for (b = 0; b < this.pagearrlength - 2; b++) {
          this.pagearray[b] = b + 1;
        }
      } else if (
        this.index >= Math.floor(this.pagearrlength / 2) &&
        this.selected >= Math.ceil((this.numberofpages / 3) * 2) &&
        this.selected >= this.numberofpages - (Math.floor(this.pagearrlength / 3) + 2)
      ) {
        var temppages = this.numberofpages;
        this.pagearray[1] = '-';
        for (b = this.pagearrlength - 1; b >= 2; b--) {
          this.pagearray[b] = temppages--;
        }
      } else {
        tempindex = this.selected - 2;
        this.pagearray[this.pagearrlength - 2] = '-';
        this.pagearray[1] = '-';
        for (b = 2; b < this.pagearrlength - 2; b++) {
          this.pagearray[b] = tempindex++;
        }
      }
    }
    this.printpagination();
  };

  printpagination = () => {
    this.pagescontainer.length = 0;
    for (var i = 0; i < this.pagearrlength; i++) {
      if (this.pagearray[i] === this.selected) {
        this.pagescontainer.push(
          <li key={this.pagearray[i]} className='page-item active'>
            <button className='page-link' onClick={this.addlistener} value={this.pagearray[i]}>
              {this.pagearray[i]}
            </button>
          </li>
        );
      } else if (this.pagearray[i] !== '-') {
        this.pagescontainer.push(
          <li key={this.pagearray[i]} className='page-item'>
            <button className='page-link' onClick={this.addlistener} value={this.pagearray[i]}>
              {this.pagearray[i]}
            </button>
          </li>
        );
      } else {
        this.pagescontainer.push(
          <li key={this.pagearray[i - 1] + '-'} className='page-item disabled'>
            <button className='emptypagelink'>...</button>
          </li>
        );
      }
    }
  };

  renderSendTransactionModal() {
    const { sendTransactionModal } = this.state;
    return (
      <Modal open={sendTransactionModal}>
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
          {
            //  <ExplorerTransaction txid={this.state.txid} />
          }
          {
            //          <ExplorerTransaction txid='098ec555381e7f61a5b80e106fc2d65381b308d21a376db0e3316c4c2eaa2616' />
          }
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
            {/* {this.renderLastRefresh()} */}
          </div>
        </div>
        <div className='row'>
          <div className='col-md-12'>
            {}
            {this.transactionList}
          </div>
        </div>
        <div className='row'>
          {
            //  <div className='col-md-12'>{this.renderPagination()}</div>
          }
          <div className='col-md-12 col-lg-12 text-center'>
            <nav aria-label='transactions navigation'>
              <ul className='pagination justify-content-center'>{this.pagescontainer}</ul>
            </nav>
            Enter page number
            <form onSubmit={this.pagebutton}>
              <input
                className='pagenuminput'
                size='5'
                type='text'
                onChange={event =>
                  this.setState({
                    selectnum: event.target.value,
                  })
                }
              />
              <button className='btn btn-primary' type='submit'>
                Go
              </button>
            </form>
          </div>
        </div>
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
