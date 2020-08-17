import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { satoshiToBSV } from '../../shared/utils';
import * as walletSelectors from '../walletSelectors';
import * as walletActions from '../walletActions';

class SendTransaction extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      receiverAddress: '',
      amountInSatoshi: '',
      transactionFee: '',
    };
  }

  onSend = async () => {
    const { dispatch } = this.props;
    const { receiverAddress, amountInSatoshi, transactionFee } = this.state;
    await dispatch(
      walletActions.createSendTransaction(
        receiverAddress,
        amountInSatoshi,
        transactionFee
      )
    );
  };

  render() {
    const { receiverAddress, amountInSatoshi, transactionFee } = this.state;
    return (
      <div className="modal1" tabIndex="-1">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Send BSV</h5>
              <button
                type="button"
                className="close"
                data-dismiss="modal"
                aria-label="Close"
              >
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body">
              <div className="container">
                <form>
                  <div className="form-group row">
                    <label
                      htmlFor="receiverAddress"
                      className="col-sm-2 col-form-label"
                    >
                      Pay to
                    </label>
                    <div className="col-sm-10">
                      <input
                        type="text"
                        className="form-control"
                        id="receiverAddress"
                        value={receiverAddress}
                        placeholder="1xxxxxxxxxxxxxxxxxxxxxxxx"
                        onChange={(event) =>
                          this.setState({ receiverAddress: event.target.value })
                        }
                      />
                    </div>
                  </div>
                  <div className="form-group row">
                    <label htmlFor="amount" className="col-sm-2 col-form-label">
                      Amount
                    </label>
                    <div className="col-sm-5">
                      <input
                        type="number"
                        className="form-control"
                        id="amount"
                        value={amountInSatoshi}
                        onChange={(event) =>
                          this.setState({ amountInSatoshi: event.target.value })
                        }
                      />
                    </div>
                    <div className="col-sm-5">
                      <input
                        type="text"
                        readOnly
                        className="form-control-plaintext"
                        id="receiverAddress"
                        value={satoshiToBSV(amountInSatoshi) + ' BSV'}
                      />
                    </div>
                  </div>
                  <div className="form-group row">
                    <label
                      htmlFor="transactionFee"
                      className="col-sm-2 col-form-label"
                    >
                      Fee
                    </label>
                    <div className="col-sm-5">
                      <input
                        type="number"
                        className="form-control"
                        id="transactionFee"
                        value={transactionFee}
                        onChange={(event) =>
                          this.setState({ transactionFee: event.target.value })
                        }
                      />
                    </div>
                  </div>
                </form>
              </div>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-dismiss="modal"
              >
                Close
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={this.onSend}
              >
                Send
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

SendTransaction.propTypes = {
  dispatch: PropTypes.func.isRequired,
};

SendTransaction.defaultProps = {};

const mapStateToProps = (state) => ({
  isLoading: walletSelectors.isLoading(state),
});

export default connect(mapStateToProps)(SendTransaction);
