import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link, withRouter } from 'react-router-dom';
import { Button, Dropdown, Icon, Loader, Modal } from 'semantic-ui-react';
import SendTransaction from '../components/SendTransaction';
import ReceiveTransaction from '../components/ReceiveTransaction';
import RenameProfile from '../components/RenameProfile';
import * as authActions from '../../auth/authActions';
import * as walletSelectors from '../walletSelectors';
import { satoshiToBSV } from '../../shared/utils';
import RecentTransaction from '../components/RecentTransaction';
import { wallet } from 'nipkow-sdk';

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

  runScript = () => {
    wallet.runScript();
  };

  render() {
    const { profile, balance } = this.props;
    return (
      <>
        <Button onClick={this.runScript}>Run</Button>
        <div className='ui center aligned segment'>
          <div className='ui grid'>
            <div className='column'>
              <Dropdown
                button
                className='circular icon top left right floated profile'
                icon={null}
                text={profile ? profile.charAt(0) : ''}
                additionPosition='top'
                pointing>
                <Dropdown.Menu>
                  <Dropdown.Item>
                    <Link to={`/wallet/allpay/buy`}>Buy Allpay Name</Link>
                  </Dropdown.Item>
                  <Dropdown.Item>
                    <Link to={`/wallet/allpay/register`}>Register with Proxy</Link>
                  </Dropdown.Item>
                  <Dropdown.Divider />
                  <Dropdown.Item text='Rename Profile' onClick={this.onRenameProfile} />
                  <Dropdown.Divider />
                  <Dropdown.Item text='Logout' onClick={this.onLogout} />
                </Dropdown.Menu>
              </Dropdown>
              <Dropdown
                button
                className='circular icon top left right floated profile'
                icon='bell outline'
                additionPosition='top'
                pointing>
                <Dropdown.Menu>
                  <Dropdown.Item text='' />
                </Dropdown.Menu>
              </Dropdown>
            </div>
          </div>
          <div className='ui center aligned icon header'>
            <Icon name='btc' size='big' alt='BitcoinSV' />
            <div className='content'>
              Your Current Balance is
              <div className='sub header'>
                {balance ? `${satoshiToBSV(balance)} BSV` : <Loader inline active />}
              </div>
            </div>
          </div>
          <div className='inline'>
            <Button color='yellow' onClick={this.toggleSendTransactionModal}>
              Send
            </Button>
            <Button color='yellow' onClick={this.toggleReceiveTransactionModal}>
              Receive
            </Button>
          </div>
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
  profile: PropTypes.string.isRequired,
  balance: PropTypes.number,
};

WalletDashboard.defaultProps = {
  balance: null,
};

const mapStateToProps = state => ({
  profile: state.auth.profile,
  balance: walletSelectors.getBalance(state),
});

export default withRouter(connect(mapStateToProps)(WalletDashboard));
