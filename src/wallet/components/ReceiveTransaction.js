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

  renderAddressInfo() {
    const { addressInfo } = this.props;
    return addressInfo.map(({ address, currentBalance, isUsed, lastTransaction }) => (
      <Table.Row>
        <Table.Cell disabled={isUsed}>{address}</Table.Cell>
        <Table.Cell>
          {currentBalance !== null ? satoshiToBSV(Number(currentBalance)) + ' BSV' : ''}
        </Table.Cell>
        <Table.Cell>{lastTransaction}</Table.Cell>
      </Table.Row>
    ));
  }

  render() {
    return (
      <Table celled>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Address</Table.HeaderCell>
            <Table.HeaderCell>Current Balance</Table.HeaderCell>
            <Table.HeaderCell>Last Transaction By</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>{this.renderAddressInfo()}</Table.Body>
      </Table>
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
