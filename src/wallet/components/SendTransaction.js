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
      feeRate: 5,
      isError: false,
      message: '',
    };
  }

  async componentDidMount() {
    const { dispatch } = this.props;
    await dispatch(walletActions.getUTXOs());
  }

  onAmountChange = async event => {
    const { dispatch } = this.props;
    const { receiverAddress, feeRate } = this.state;
    this.setState({ amountInSatoshi: event.target.value });
    try {
      debugger;
      const transactionFee = await dispatch(
        walletActions.getTransactionFee(receiverAddress, event.target.value, Number(feeRate))
      );
      this.setState({ isError: false, message: '', transactionFee });
    } catch (error) {
      this.setState({ isError: true, message: error.message });
    }
  };

  onSend = async () => {
    const { dispatch } = this.props;
    const { receiverAddress, amountInSatoshi, feeRate } = this.state;
    if (receiverAddress && amountInSatoshi) {
      try {
        await dispatch(
          walletActions.createSendTransaction(receiverAddress, amountInSatoshi, Number(feeRate))
        );
        this.setState({ isError: false, message: 'Transaction Successful' });
      } catch (error) {
        this.setState({ isError: true, message: error.message });
      }
    } else {
      this.setState({ isError: true, message: 'Please enter receiver address and amount' });
    }
  };

  onClose = () => {
    this.props.onClose();
  };

  renderMessage() {
    const { isError, message } = this.state;
    if (message) {
      if (isError) {
        return (
          <div className='ui negative message'>
            <p>{message}</p>
          </div>
        );
      } else {
        return (
          <div className='ui success message'>
            <p>{message}</p>
          </div>
        );
      }
    }
  }

  onexponentialSliderChange = async event => {
    const { dispatch } = this.props;
    const { receiverAddress, amountInSatoshi } = this.state;
    this.setState({
      feeRate: event.target.value,
      // fee: Math.floor(Math.pow(1.03, event.target.value)),
    });
    if (Number(amountInSatoshi) > 0) {
      try {
        const transactionFee = await dispatch(
          walletActions.getTransactionFee(
            receiverAddress,
            amountInSatoshi,
            Number(event.target.value)
          )
        );
        console.log(transactionFee);
        this.setState({ isError: false, message: '', transactionFee });
      } catch (error) {
        this.setState({ isError: true, message: error.message });
      }
    }
  };

  render() {
    const { receiverAddress, amountInSatoshi, transactionFee, feeRate } = this.state;
    return (
      <div className='container'>
        <form>
          <div className='form-group row'>
            <label htmlFor='receiverAddress' className='col-sm-4 col-form-label'>
              Pay to
            </label>
            <div className='col-sm-5'>
              <input
                type='text'
                className='form-control'
                id='receiverAddress'
                value={receiverAddress}
                placeholder='xxxxxxxxxxxxxxxxxxxxxxxxx'
                onChange={event => this.setState({ receiverAddress: event.target.value })}
              />
            </div>
          </div>
          <div className='form-group row'>
            <label htmlFor='amount' className='col-sm-4 col-form-label'>
              Amount
            </label>
            <div className='col-sm-5'>
              <input
                type='text'
                className='form-control'
                id='amount'
                value={amountInSatoshi}
                onChange={this.onAmountChange}
              />
            </div>
            <div className='col-sm-3'>
              <input
                type='text'
                readOnly
                className='form-control-plaintext'
                value={satoshiToBSV(Number(amountInSatoshi)) + ' BSV'}
              />
            </div>
          </div>
          <div className='form-group row'>
            <label htmlFor='transactionFee' className='col-sm-4 col-form-label'>
              Network Fee (Satoshis/byte)
            </label>
            <div className='col-sm-5'>
              <input
                type='range'
                min='5'
                max='50000000'
                step='1'
                value={feeRate}
                onChange={this.onexponentialSliderChange}
                style={{ width: '100%' }}
              />
            </div>
            <div className='col-sm-3'>
              <input
                type='text'
                readOnly
                className='form-control-plaintext'
                value={`${satoshiToBSV(Number(transactionFee))} BSV (${feeRate} satoshis/byte)`}
              />
            </div>
          </div>
          <div className='form-group row'>
            <div className='col-sm-12'>{this.renderMessage()}</div>
          </div>
          <button type='button' className='btn btn-primary' onClick={this.onSend}>
            Send
          </button>
          <button type='button' className='btn btn-primary' onClick={this.onClose}>
            Close
          </button>
        </form>
      </div>
    );
  }
}

SendTransaction.propTypes = {
  dispatch: PropTypes.func.isRequired,
};

SendTransaction.defaultProps = {};

const mapStateToProps = state => ({
  isLoading: walletSelectors.isLoading(state),
});

export default connect(mapStateToProps)(SendTransaction);
