import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { Button, Icon, Loader, Modal } from 'semantic-ui-react';
import SendTransaction from '../components/SendTransaction';
import ReceiveTransaction from '../components/ReceiveTransaction';
import RecentTransaction from '../components/RecentTransaction';
import { satoshiToBSV } from '../../shared/utils';
import { wallet } from 'allegory-allpay-sdk';
import * as walletActions from '../walletActions';
import * as walletSelectors from '../walletSelectors';

class WalletDashboard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      sendTransactionModal: false,
      receiveTransactionModal: false,
    };
  }

  toggleSendTransactionModal = () => {
    const { sendTransactionModal } = this.state;
    this.setState({ sendTransactionModal: !sendTransactionModal });
  };

  toggleReceiveTransactionModal = () => {
    const { dispatch } = this.props;
    const { receiveTransactionModal } = this.state;
    if (receiveTransactionModal) dispatch(walletActions.clearUsedUnusedAddresses());
    this.setState({ receiveTransactionModal: !receiveTransactionModal });
  };

  renderSendTransactionModal() {
    const { sendTransactionModal } = this.state;
    return (
      <Modal open={sendTransactionModal}>
        <Modal.Header className='purplefontcolor'>Send Transactions</Modal.Header>
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
      <Modal className='receive-modal' open={receiveTransactionModal}>
        <i className='close icon' onClick={this.toggleReceiveTransactionModal}></i>
        <Modal.Header className='purplefontcolor'>My Addresses</Modal.Header>
        <Modal.Content>
          <Modal.Description>
            <ReceiveTransaction onClose={this.toggleReceiveTransactionModal} />
          </Modal.Description>
        </Modal.Content>
        <Modal.Actions>
          <Button className='peach' content='Close' onClick={this.toggleReceiveTransactionModal} />
        </Modal.Actions>
      </Modal>
    );
  }

  runScript = () => {
    wallet.runScript();
  };

  render() {
    const { isLoading, balance } = this.props;
    return (
      <>
        {process.env.REACT_APP_ENVIRONMENT === 'development' && (
          <Button onClick={this.runScript}>Run</Button>
        )}
        <div className='ui center aligned segment'>
          <div className='ui center aligned icon header'>
            <Icon name='btc' size='big' alt='BitcoinSV' />
            <div className='content'>
              Your Current Balance is
              <div className='balance purplefontcolor'>
                {isLoading ? <Loader inline active /> : satoshiToBSV(balance)}
              </div>
            </div>
          </div>
          <div className='inline'>
            <Button className='coral' onClick={this.toggleSendTransactionModal}>
              Send
            </Button>
            <Button className='coral' onClick={this.toggleReceiveTransactionModal}>
              Receive
            </Button>
          </div>
        </div>
        <RecentTransaction />
        {this.renderSendTransactionModal()}
        {this.renderReceiveTransactionModal()}
      </>
    );
  }
}

WalletDashboard.propTypes = {
  dispatch: PropTypes.func.isRequired,
  balance: PropTypes.number,
};

WalletDashboard.defaultProps = {
  balance: null,
};

const mapStateToProps = state => ({
  isLoading: walletSelectors.isLoading(state),
  balance: walletSelectors.getBalance(state),
});

export default withRouter(connect(mapStateToProps)(WalletDashboard));
