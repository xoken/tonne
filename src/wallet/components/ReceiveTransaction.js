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
          <h3 className='ui header'>Unused address</h3>
          <div className='ui icon message'>
            <i className='copy outline link icon' onClick={this.onCopy}></i>
            <div className='content'>
              <div className='header'>{unusedAddress}</div>
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
            <h3 className='ui header'>Used address</h3>
            <Table celled>
              <Table.Header>
                <Table.Row>
                  <Table.HeaderCell>Address</Table.HeaderCell>
                  <Table.HeaderCell>Balance</Table.HeaderCell>
                  <Table.HeaderCell>Last Transaction By</Table.HeaderCell>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {usedAddressInfo.map(
                  ({ address, incoming, outgoing, currentBalance, lastTransaction }, index) => (
                    <Table.Row key={index.toString()}>
                      <Table.Cell className='used-address'>{address}</Table.Cell>
                      <Table.Cell>
                        <div>
                          {incoming !== null
                            ? `Total Incoming: ${satoshiToBSV(Number(incoming))} BSV`
                            : ''}
                        </div>
                        <div>
                          {outgoing !== null
                            ? `Total Outgoing: ${satoshiToBSV(Number(outgoing))} BSV`
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
