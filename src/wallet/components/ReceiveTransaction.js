import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { satoshiToBSV } from '../../shared/utils';
import { Table } from 'semantic-ui-react';
import * as walletSelectors from '../walletSelectors';
import * as walletActions from '../walletActions';

class ReceiveTransaction extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  async componentDidMount() {
    const { dispatch } = this.props;
    await dispatch(walletActions.getAddressInfo());
  }

  onCopy = () => {
    const {
      addressInfo: { unusedAddress },
    } = this.props;
    navigator.clipboard.writeText(unusedAddress);
  };

  renderUnusedAddressInfo() {
    const { addressInfo } = this.props;
    if (addressInfo) {
      const { unusedAddress } = addressInfo;
      return (
        <>
          <h4 className='ui horizontal divider header'>Unused address</h4>
          <div className='ui two column centered grid'>
            <div className='column'>
              <div className='ui fluid action input'>
                <input type='text' readOnly value={unusedAddress} />
                <button className='ui yellow icon button' onClick={this.onCopy}>
                  <i className='copy icon'></i>
                </button>
              </div>
            </div>
          </div>
        </>
      );
    }
    return null;
  }

  renderUsedAddressInfo() {
    const { addressInfo } = this.props;
    if (addressInfo) {
      const { usedAddressInfo } = addressInfo;
      if (usedAddressInfo.length > 0) {
        return (
          <>
            <h4 className='ui horizontal divider header'>Used address</h4>
            <Table striped>
              <Table.Header>
                <Table.Row>
                  <Table.HeaderCell>Address</Table.HeaderCell>
                  <Table.HeaderCell>Balance</Table.HeaderCell>
                  <Table.HeaderCell>Last Transaction By</Table.HeaderCell>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {usedAddressInfo.map(
                  (
                    { address, incomingBalance, outgoingBalance, currentBalance, lastTransaction },
                    index
                  ) => (
                    <Table.Row key={index.toString()}>
                      <Table.Cell className='used-address'>{address}</Table.Cell>
                      <Table.Cell>
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
                      <Table.Cell>{lastTransaction}</Table.Cell>
                    </Table.Row>
                  )
                )}
              </Table.Body>
            </Table>
          </>
        );
      }
    }
    return null;
  }

  render() {
    return (
      <>
        {this.renderUnusedAddressInfo()}
        {this.renderUsedAddressInfo()}
      </>
    );
  }
}

ReceiveTransaction.propTypes = {
  dispatch: PropTypes.func.isRequired,
};

ReceiveTransaction.defaultProps = {};

const mapStateToProps = state => ({
  isLoading: walletSelectors.isLoading(state),
  addressInfo: state.wallet.addressInfo,
});

export default connect(mapStateToProps)(ReceiveTransaction);
