import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import * as walletActions from '../walletActions';
import * as walletSelectors from '../walletSelectors';
import { satoshiToBSV } from '../../shared/utils';
import bsvlogo from '../../shared/images/bsv.png';

class WalletHome extends React.Component {
  constructor(props) {
    super(props);
    this.state = { sendTxPopup: false };
  }

  componentDidMount() {
    const { dispatch } = this.props;
    // dispatch(walletActions.getOutputs());
    dispatch(walletActions.getCurrentBalance());
  }

  toggleSendTxPopup = () => {
    // const { sendTxPopup } = this.state;
    // this.setState({ sendTxPopup: !sendTxPopup });
    this.props.history.push('/wallet/send');
  };

  onBack = () => {
    this.props.history.goBack();
  };

  renderTransaction() {
    const { outputs } = this.props;
    return outputs.map((transaction) => {
      return (
        <tr>
          <td></td>
          <td></td>
        </tr>
      );
    });
  }

  renderPagination() {
    return (
      <nav aria-label="transactions navigation">
        <ul className="pagination justify-content-center" id="pagination"></ul>
      </nav>
    );
  }

  render() {
    const { currBal } = this.props;
    return (
      <>
        <div className="container nonheader">
          <div className="row">
            <div className="col-lg-12 col-md-12 col-sm-12 border-left-right">
              <center>
                <div className="cryptologo">
                  <img src={bsvlogo} alt="" />
                </div>
                <h5>Your Current Balance is</h5>
                <h4>{satoshiToBSV(currBal)} BSV</h4>
                <div className="txbtn" onClick={this.toggleSendTxPopup}>
                  Send
                </div>
              </center>
            </div>
          </div>
          <div className="row">
            <div className="col-md-12 col-lg-12">
              <h3>Recent Transactions</h3>
              <table id="txlist" className="table">
                <thead>
                  <tr>
                    <th scope="col">To / From (Address)</th>
                    <th scope="col">Sent Amount / Received Amount</th>
                    <th scope="col">Transaction ID</th>
                  </tr>
                </thead>
                <tbody>{this.renderTransaction()}</tbody>
              </table>
            </div>
          </div>
          <div className="row">
            <div className="col-md-12 col-lg-12">{this.renderPagination()}</div>
          </div>
        </div>
        <button type="button" className="btn btn-primary" onClick={this.onBack}>
          Back
        </button>
      </>
    );
  }
}

WalletHome.propTypes = {
  dispatch: PropTypes.func.isRequired,
  isLoading: PropTypes.bool.isRequired,
  currBal: PropTypes.number.isRequired,
  outputs: PropTypes.arrayOf(
    PropTypes.shape({
      date: PropTypes.string.isRequired,
      amount: PropTypes.number.isRequired,
    })
  ),
};

WalletHome.defaultProps = {
  outputs: [],
};

const mapStateToProps = (state) => ({
  isLoading: walletSelectors.isLoading(state),
  currBal: walletSelectors.getCurrentBalance(state),
  outputs: walletSelectors.getOutputs(state),
});

export default connect(mapStateToProps)(WalletHome);
