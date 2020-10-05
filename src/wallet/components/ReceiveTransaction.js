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
          <h3 class='ui header'>Unused address</h3>
          <div class='ui icon message'>
            <i class='copy outline link icon' onClick={this.onCopy}></i>
            <div class='content'>
              <div class='header'>{unusedAddress}</div>
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
            <h3 class='ui header'>Used address</h3>
            <Table celled>
              <Table.Header>
                <Table.Row>
                  <Table.HeaderCell>Address</Table.HeaderCell>
                  <Table.HeaderCell>Current Balance</Table.HeaderCell>
                  <Table.HeaderCell>Last Transaction By</Table.HeaderCell>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {usedAddressInfo.map(({ address, currentBalance, lastTransaction }) => (
                  <Table.Row>
                    <Table.Cell className='used-address'>{address}</Table.Cell>
                    <Table.Cell>
                      {currentBalance !== null ? satoshiToBSV(Number(currentBalance)) + ' BSV' : ''}
                    </Table.Cell>
                    <Table.Cell>{lastTransaction}</Table.Cell>
                  </Table.Row>
                ))}
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
