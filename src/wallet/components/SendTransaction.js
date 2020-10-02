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
      transactionFee: 5,
      isError: false,
      message: '',
      sliderValue: 0,
    };
  }

  async componentDidMount() {
    const { dispatch } = this.props;
    await dispatch(walletActions.getUTXOs());
  }

  onAmountChange = async event => {
    const { dispatch } = this.props;
    const { receiverAddress } = this.state;
    this.setState({ amountInSatoshi: event.target.value });
    try {
      const transactionFee = await dispatch(
        walletActions.getTransactionFee(receiverAddress, event.target.value)
      );
      this.setState({ isError: false, message: '', transactionFee });
    } catch (error) {
      this.setState({ isError: true, message: error.message });
    }
  };

  onSend = async () => {
    const { dispatch } = this.props;
    const { receiverAddress, amountInSatoshi, transactionFee } = this.state;
    if (receiverAddress && amountInSatoshi) {
      try {
        await dispatch(
          walletActions.createSendTransaction(
            receiverAddress,
            amountInSatoshi,
            Number(transactionFee)
          )
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

  onexponentialSliderChange = event => {
    //Math.floor(a * Math.pow(b, x.value));1.03
    this.setState({
      transactionFee: Math.floor(Math.pow(1.03, event.target.value)),
      sliderValue: event.target.value,
    });
  };

  onTransactionFeeChange = event => {
    this.setState({
      transactionFee: event.target.value,
    });
    if (event.target.value !== '' && event.target.value !== '0') {
      this.setState({
        sliderValue: Math.log(event.target.value) / Math.log(1.03),
      });
    } else {
      this.setState({
        sliderValue: 0,
      });
    }
  };

  render() {
    const { receiverAddress, amountInSatoshi, transactionFee, sliderValue } = this.state;
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
                onChange={event => this.setState({ amountInSatoshi: event.target.value })}
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
          {/* <div className='form-group row'>
            <label htmlFor='transactionFee' className='col-sm-4 col-form-label'>
              Fee
            </label>
            <div className='col-sm-5'>
              <input
                type='number'
                className='form-control'
                id='transactionFee'
                value={transactionFee}
                onChange={this.onTransactionFeeChange}
              />
            </div>
            <div className='col-sm-3'>
              <input
                type='text'
                readOnly
                className='form-control-plaintext'
                value={satoshiToBSV(Number(transactionFee)) + ' BSV'}
              />
            </div>
            <div className='col-sm-3'>
              <input
                type='text'
                readOnly
                className='form-control-plaintext'
                value={satoshiToBSV(Number(transactionFee)) + ' BSV'}
              />
            </div>
          </div> */}
          {/* <div className='form-group row'>
            <label className='col-sm-4 control-label'>Bitcoin SV Network Fee</label>
            <div className='col-sm-4'>
              <p className='form-control-static'>{`${5} satoshis per byte`}</p>
            </div>
          </div> */}
          <div className='form-group row'>
            <label htmlFor='transactionFee' className='col-sm-4 col-form-label'>
              Bitcoin SV Network Fee
            </label>
            <div className='col-sm-5'>
              <input
                type='range'
                min='0'
                max='1200'
                step='1'
                value={sliderValue}
                onChange={this.onexponentialSliderChange}
                style={{ width: '100%' }}
              />
            </div>
            <div className='col-sm-3'>
              <input
                type='text'
                readOnly
                className='form-control-plaintext'
                value={satoshiToBSV(Number(transactionFee)) + ' BSV'}
              />
            </div>
          </div>
          {/* <div className='form-group row'>
            <label className='col-sm-4 control-label'>Bitcoin SV Network Fee</label>
            <div className='col-sm-4'>
              <p className='form-control-static'>{`${5} satoshis per byte`}</p>
            </div>
          </div> */}
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
