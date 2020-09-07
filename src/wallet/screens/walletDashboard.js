import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { Button, Checkbox, Icon, Modal, Pagination } from 'semantic-ui-react';
import { formatDistanceToNow } from 'date-fns';
import SendTransaction from '../components/sendTransaction';
import * as authActions from '../../auth/authActions';
import * as walletActions from '../walletActions';
import * as walletSelectors from '../walletSelectors';
import { satoshiToBSV } from '../../shared/utils';
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
  }

  toggleTransactionModal = () => {
    const { transactionModal } = this.state;
    this.setState({ transactionModal: !transactionModal });
  };

  toggleSendTxPopup = () => {
    const { sendTxModal } = this.state;
    this.setState({ sendTxModal: !sendTxModal });
  };

  onAutoRefresh = () => {
    const { autoRefreshToggle } = this.state;
    clearInterval(this.autoRefreshTimer);
    if (!autoRefreshToggle) {
      const autoRefreshTimeInSecs = 1 * 60 * 1000;
      this.autoRefreshTimer = setInterval(() => {
        console.log('Hello');
      }, autoRefreshTimeInSecs);
    }
    this.setState({ autoRefreshToggle: !autoRefreshToggle });
  };

  onRefresh = () => {
    this.setState({
      lastRefreshed: new Date(),
      timeSinceLastRefreshed: new Date(),
    });
  };

  renderAutoRefresh() {
    const { lastRefreshed, autoRefreshToggle } = this.state;
    if (lastRefreshed) {
      return (
        <div className='auto-refresh'>
          <span className='autorefresh-label'>Auto-refresh</span>
          <Checkbox toggle checked={autoRefreshToggle} onChange={this.onAutoRefresh} />
        </div>
      );
    }
  }

  renderLastRefresh() {
    const { lastRefreshed } = this.state;
    if (lastRefreshed) {
      return (
        <div className='manual-refresh'>
          <span className='text'>
            Last refreshed{': '}
            {formatDistanceToNow(lastRefreshed, {
              includeSeconds: true,
              addSuffix: true,
            })}
          </span>
          <button className='icon' onClick={this.onRefresh}>
            <Icon name='refresh' />
          </button>
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
      return outputs.map(({ outputTxHash, value, address }, index) => {
        return (
          <div key={index} className='card'>
            <div className='card-header' onClick={this.toggleTransactionModal}>
              {outputTxHash}
            </div>
            <div className='card-body'>
              <div className='row'>
                <div className='col-md-6'></div>
                <div className='col-md-6'>
                  <p>{address}</p>
                  <p>{satoshiToBSV(value)}</p>
                </div>
              </div>
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
    const { sendTxModal } = this.state;
    return (
      <Modal open={sendTxModal} onClose={this.toggleSendTxPopup} onOpen={this.toggleSendTxPopup}>
        <Modal.Header>Send Transactions</Modal.Header>
        <Modal.Content>
          <Modal.Description>
            <SendTransaction />
          </Modal.Description>
        </Modal.Content>
        <Modal.Actions>
          <Button onClick={this.toggleSendTxPopup}>Cancel</Button>
          <Button onClick={this.toggleSendTxPopup} positive>
            Send
          </Button>
        </Modal.Actions>
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

        <div className='row'>
          <div className='col-md-12'>
            <h3>Recent Transactions</h3>
          </div>
        </div>
        <div className='row'>
          <div className='col-md-12'>
            {this.renderAutoRefresh()}
            {this.renderLastRefresh()}
          </div>
        </div>
        <div className='row'>
          <div className='col-md-12'>{this.renderTransaction()}</div>
        </div>
        <div className='row'>
          <div className='col-md-12'>{this.renderPagination()}</div>
        </div>
        {this.renderTransactionModal()}
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
