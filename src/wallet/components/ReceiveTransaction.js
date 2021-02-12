import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Button, Divider, Icon, Label, Table, Message } from 'semantic-ui-react';
import { utils } from 'allegory-allpay-sdk';
import * as walletSelectors from '../walletSelectors';
import * as walletActions from '../walletActions';

class ReceiveTransaction extends React.Component {
  constructor(props) {
    super(props);
    this.state = { copiedAddress: null };
    this.timers = [];
  }

  async componentDidMount() {
    const { dispatch } = this.props;
    await dispatch(walletActions.getUsedAddresses());
    await dispatch(walletActions.getUnusedAddresses());
  }

  onCopy = address => () => {
    this.timers.forEach(timer => {
      clearTimeout(timer);
    });
    navigator.clipboard.writeText(address);
    this.setState({ copiedAddress: address });
    this.timers.push(
      setTimeout(() => {
        this.setState({
          copiedAddress: null,
        });
      }, 3000)
    );
  };

  onNewUnusedAddress = () => {
    const { dispatch } = this.props;
    dispatch(walletActions.getUnusedAddresses());
  };

  renderAllpayHandle() {
    const { allpayHandles } = this.props;
    const { copiedAddress } = this.state;
    return (
      <>
        {allpayHandles && allpayHandles.length > 0 && (
          <>
            <div className='ui grid stackable'>
              <div className='left floated six wide middle aligned column'>
                <h4>My AllPay handle</h4>
              </div>
            </div>
            <Message color='yellow' className='allpay-receive-message'>
              <p>
                AllPay enabled wallets can send you BSV directly to your AllPay handle
                <b>{` "${allpayHandles[0]}" `}</b>. The addresses are generated from on-chain
                registrations and hence provably correct.
              </p>
            </Message>
            {allpayHandles.map((allpayHandle, index) => (
              <div className='ui two column grid stackable' key={index.toString()}>
                <div className='column'>
                  <div className='ui fluid action input'>
                    <input
                      type='text'
                      className='purple'
                      style={{ fontWeight: 'bold' }}
                      readOnly
                      value={allpayHandle}
                    />

                    <button className='ui coral button' onClick={this.onCopy(allpayHandle)}>
                      Copy
                    </button>
                  </div>
                </div>
                {copiedAddress && copiedAddress === allpayHandle ? (
                  <div className='column middle aligned'>
                    <Label>
                      <Icon name='check' color='green' />
                      Copied!
                    </Label>
                  </div>
                ) : null}
              </div>
            ))}
          </>
        )}
      </>
    );
  }

  renderUnusedAddresses() {
    const { unusedAddresses } = this.props;
    const { copiedAddress } = this.state;
    if (unusedAddresses && unusedAddresses.length > 0) {
      return (
        <>
          <div className='ui grid stackable mobile reversed'>
            <div className='left floated eight wide middle aligned column'>
              <h4>Unused Addresses</h4>
            </div>
            <div className='right floated right aligned eight wide column'>
              <div className='floatRightOnComp'>
                <Button
                  className='coral'
                  disabled={unusedAddresses.length > 10 ? true : false}
                  onClick={this.onNewUnusedAddress}>
                  Get new Addresses
                </Button>
              </div>
            </div>
          </div>
          <Divider />
          {unusedAddresses.map((unusedAddress, index) => (
            <div className='ui two column grid stackable' key={index.toString()}>
              <div className='twelve wide column'>
                <div className='ui fluid action input'>
                  <input
                    type='text'
                    className='monospace inputWidth'
                    readOnly
                    value={unusedAddress}
                  />
                  <button className='ui coral button' onClick={this.onCopy(unusedAddress)}>
                    Copy
                  </button>
                </div>
              </div>
              {copiedAddress && copiedAddress === unusedAddress ? (
                <div className='column three wide middle aligned'>
                  <Label>
                    <Icon name='check' color='green' />
                    Copied!
                  </Label>
                </div>
              ) : null}
            </div>
          ))}
        </>
      );
    }
    return null;
  }

  renderUsedAddresses() {
    const { usedAddresses } = this.props;
    if (usedAddresses && usedAddresses.length > 0) {
      return (
        <>
          <Table striped>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell>Used Addresses</Table.HeaderCell>
                <Table.HeaderCell>Status</Table.HeaderCell>
                <Table.HeaderCell>Last Sender/ Receipient Address</Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {usedAddresses.map(
                (
                  { address, incomingBalance, outgoingBalance, currentBalance, lastTransaction },
                  index
                ) => (
                  <Table.Row key={index.toString()}>
                    <Table.Cell className='monospace'>{address}</Table.Cell>
                    <Table.Cell className='monospace'>
                      <div>
                        {incomingBalance !== null
                          ? `Total Incoming: ${utils.satoshiToBSV(Number(incomingBalance))}`
                          : ''}
                      </div>
                      <div>
                        {outgoingBalance !== null
                          ? `Total Outgoing: ${utils.satoshiToBSV(Number(outgoingBalance))}`
                          : ''}
                      </div>
                      <div>
                        {currentBalance !== null
                          ? `Current Balance: ${utils.satoshiToBSV(Number(currentBalance))}`
                          : ''}
                      </div>
                    </Table.Cell>
                    <Table.Cell className='monospace'>{lastTransaction}</Table.Cell>
                  </Table.Row>
                )
              )}
            </Table.Body>
          </Table>
        </>
      );
    }
    return null;
  }

  render() {
    return (
      <>
        {this.renderAllpayHandle()}
        {this.renderUnusedAddresses()}
        {this.renderUsedAddresses()}
      </>
    );
  }

  componentWillUnmount() {
    this.timers.forEach(timer => {
      clearTimeout(timer);
    });
  }
}

ReceiveTransaction.propTypes = {
  dispatch: PropTypes.func.isRequired,
};

ReceiveTransaction.defaultProps = {};

const mapStateToProps = state => ({
  isLoading: walletSelectors.isLoadingAddresses(state),
  usedAddresses: state.wallet.usedAddresses,
  unusedAddresses: state.wallet.unusedAddresses,
  allpayHandles: state.wallet.allpayHandles,
});

export default connect(mapStateToProps)(ReceiveTransaction);
