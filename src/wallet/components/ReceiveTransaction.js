import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { satoshiToBSV } from '../../shared/utils';
import { Button, Divider, Icon, Label, Table } from 'semantic-ui-react';
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
    await dispatch(walletActions.getUsedDerivedKeys());
    await dispatch(walletActions.getUnusedDerivedKeys());
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
    dispatch(walletActions.getUnusedDerivedKeys());
  };

  renderUnusedDerivedKeys() {
    const { unusedDerivedAddresses } = this.props;
    const { copiedAddress } = this.state;
    if (unusedDerivedAddresses && unusedDerivedAddresses.length > 0) {
      return (
        <>
          <div className='ui grid'>
            <div className='left floated six wide middle aligned column'>
              <h4>Unused Addresses</h4>
            </div>
            <div className='right floated right aligned six wide column'>
              <Button
                color='yellow'
                disabled={unusedDerivedAddresses.length > 10 ? true : false}
                onClick={this.onNewUnusedAddress}>
                Get new Addresses
              </Button>
            </div>
          </div>
          <Divider />
          {unusedDerivedAddresses.map(({ address }, index) => (
            <div className='ui two column grid' key={index.toString()}>
              <div className='column'>
                <div className='ui fluid action input'>
                  <input type='text' className='monospace' readOnly value={address} />
                  <button className='ui yellow button' onClick={this.onCopy(address)}>
                    Copy
                  </button>
                </div>
              </div>
              {copiedAddress === address ? (
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
      );
    }
    return null;
  }

  renderUsedDerivedKeys() {
    const { usedDerivedKeys } = this.props;
    if (usedDerivedKeys && usedDerivedKeys.length > 0) {
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
              {usedDerivedKeys.map(
                (
                  { address, incomingBalance, outgoingBalance, currentBalance, lastTransaction },
                  index
                ) => (
                  <Table.Row key={index.toString()}>
                    <Table.Cell className='monospace'>{address}</Table.Cell>
                    <Table.Cell className='monospace'>
                      <div>
                        {incomingBalance !== null
                          ? `Total Incoming: ${satoshiToBSV(Number(incomingBalance))} BSV`
                          : ''}
                      </div>
                      <div>
                        {outgoingBalance !== null
                          ? `Total Outgoing: ${satoshiToBSV(Number(outgoingBalance))} BSV`
                          : ''}
                      </div>
                      <div>
                        {currentBalance !== null
                          ? `Current Balance: ${satoshiToBSV(Number(currentBalance))} BSV`
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
        {this.renderUnusedDerivedKeys()}
        {this.renderUsedDerivedKeys()}
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
  isLoading: walletSelectors.isLoading(state),
  usedDerivedKeys: state.wallet.usedDerivedKeys,
  unusedDerivedAddresses: state.wallet.unusedDerivedAddresses,
});

export default connect(mapStateToProps)(ReceiveTransaction);
