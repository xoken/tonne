import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { Button, Dropdown, Icon, Loader, Modal } from 'semantic-ui-react';
import SendTransaction from '../components/SendTransaction';
import ReceiveTransaction from '../components/ReceiveTransaction';
import RenameProfile from '../components/RenameProfile';
import * as authActions from '../../auth/authActions';
import * as walletSelectors from '../walletSelectors';
import { satoshiToBSV } from '../../shared/utils';
import images from '../../shared/images';
import RecentTransaction from '../components/RecentTransaction';
// import { wallet } from 'nipkow-sdk';

class WalletDashboard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      sendTransactionModal: false,
      receiveTransactionModal: false,
      renameProfileModal: false,
    };
  }

  toggleSendTransactionModal = () => {
    const { sendTransactionModal } = this.state;
    this.setState({ sendTransactionModal: !sendTransactionModal });
  };

  toggleReceiveTransactionModal = () => {
    const { receiveTransactionModal } = this.state;
    this.setState({ receiveTransactionModal: !receiveTransactionModal });
  };

  onRenameProfile = () => {
    const { renameProfileModal } = this.state;
    this.setState({ renameProfileModal: !renameProfileModal });
  };

  onLogout = () => {
    const { dispatch } = this.props;
    dispatch(authActions.logout());
  };

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

  renderReceiveTransactionModal() {
    const { receiveTransactionModal } = this.state;
    return (
      <Modal className='receive-modal' open={receiveTransactionModal}>
        <i className='close icon' onClick={this.toggleReceiveTransactionModal}></i>
        <Modal.Header>My Addresses</Modal.Header>
        <Modal.Content>
          <Modal.Description>
            <ReceiveTransaction onClose={this.toggleReceiveTransactionModal} />
          </Modal.Description>
        </Modal.Content>
        <Modal.Actions>
          <Button content='Close' onClick={this.toggleReceiveTransactionModal} />
        </Modal.Actions>
      </Modal>
    );
  }

  renderRenameProfileModal() {
    const { renameProfileModal } = this.state;
    return (
      <Modal open={renameProfileModal}>
        <RenameProfile onClose={this.onRenameProfile} onLogout={this.onLogout} />
      </Modal>
    );
  }

  render() {
    const { balance, isLoading } = this.props;
    return (
      <>
        {/* <Button color='yellow' onClick={() => wallet.runScript()}>
          Run
        </Button> */}
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
                <Dropdown.Item text='Logout' onClick={this.onLogout} />
              </Dropdown.Menu>
            </Dropdown>
          </div>
          {isLoading ? (
            <Loader active />
          ) : (
            <>
              {/* FIXME find correct way to do this */}
              {/* <img className='ui small centered image' src={images.bsv} /> */}
              <Icon name='btc' size='big' alt='BitcoinSV' />
              <div className='ui header'>
                Your Current Balance is
                <br />
                {satoshiToBSV(balance)} BSV
              </div>
              <Button color='yellow' onClick={this.toggleSendTransactionModal}>
                Send
              </Button>
              <Button color='yellow' onClick={this.toggleReceiveTransactionModal}>
                Receive
              </Button>
            </>
          )}
        </div>
        <RecentTransaction />
        {this.renderSendTransactionModal()}
        {this.renderReceiveTransactionModal()}
        {this.renderRenameProfileModal()}
      </>
    );
  }
}

WalletDashboard.propTypes = {
  dispatch: PropTypes.func.isRequired,
  isLoading: PropTypes.bool.isRequired,
  balance: PropTypes.number.isRequired,
};

WalletDashboard.defaultProps = {};

const mapStateToProps = state => ({
  isLoading: walletSelectors.isLoading(state),
  balance: walletSelectors.getBalance(state),
});

export default withRouter(connect(mapStateToProps)(WalletDashboard));
