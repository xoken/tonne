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
      sliderValue: 1,
      maxSliderValue: Math.floor(Math.log(1000000000) / Math.log(1.05)),
    };
  }

  async componentDidMount() {
    document.getElementById('feerate').max = this.state.maxSliderValue;
    const { dispatch } = this.props;
    await dispatch(walletActions.getUTXOs());
  }

  componentDidUpdate() {
    document.getElementById('feerate').max = this.state.maxSliderValue;
  }

  onAmountChange = async event => {
    const { dispatch } = this.props;
    const { receiverAddress, feeRate } = this.state;
    this.setState({ amountInSatoshi: event.target.value });
    try {
      const transactionFee = await dispatch(
        walletActions.getTransactionFee(receiverAddress, event.target.value, Number(feeRate))
      );
      if (Number(transactionFee) >= 50000000) {
        this.setState({
          isError: false,
          message: '',
          transactionFee: 50000000,
        });
      } else {
        this.setState({
          isError: false,
          message: '',
          transactionFee,
        });
      }
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
    const feeRate = event.target.value;
    const { receiverAddress, amountInSatoshi } = this.state;
    const tempFeeRate = Math.floor(Math.pow(1.05, feeRate));
    if (tempFeeRate <= 5) {
      this.setState({
        feeRate: 5,
        sliderValue: feeRate,
      });
    }
    // else if (tempFeeRate >= 1000000000) {
    //   this.setState({
    //     feeRate: 1000000000,
    //     sliderValue: event.target.value
    //   });
    // }
    else {
      this.setState({
        feeRate: Math.floor(Math.pow(1.05, feeRate)),
        sliderValue: feeRate,
      });
    }
    if (Number(amountInSatoshi) > 0) {
      try {
        const transactionFee = await dispatch(
          walletActions.getTransactionFee(
            receiverAddress,
            amountInSatoshi,
            Math.floor(Math.pow(1.05, Number(feeRate)))
          )
        );
        console.log(transactionFee);
        if (Number(transactionFee) >= 50000000) {
          this.setState({
            isError: false,
            message: '',
            transactionFee: 50000000,
            //  sliderDisabled: true,
            maxSliderValue: feeRate,
            //sliderValue: feeRate
          });
        } else {
          this.setState({
            isError: false,
            message: '',
            //  sliderDisabled: false,
            transactionFee,
          });
        }
      } catch (error) {
        this.setState({ isError: true, message: error.message });
      }
    } else {
      this.setState({
        isError: false,
        message: '',
        transactionFee: 0,
      });
    }
  };

  render() {
    const { receiverAddress, amountInSatoshi, transactionFee, feeRate, sliderValue } = this.state;
    return (
      <div className='container'>
        <form>
          <div
            className='form-group row'
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              marginRight: '-15px',
              marginLeft: '-15px',
            }}>
            <label htmlFor='receiverAddress' className='col-sm-3 col-form-label'>
              Pay to
            </label>
            <div className='col-sm-6'>
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
          <div
            className='form-group row'
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              marginRight: '-15px',
              marginLeft: '-15px',
            }}>
            <label htmlFor='amount' className='col-sm-3 col-form-label'>
              Amount
            </label>
            <div className='col-sm-6'>
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
          <div
            className='form-group row'
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              marginRight: '-15px',
              marginLeft: '-15px',
            }}>
            <label htmlFor='transactionFee' className='col-sm-3 col-form-label'>
              Network Fee (Satoshis/byte)
            </label>
            <div className='col-sm-6'>
              <input
                id='feerate'
                type='range'
                min='1'
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
                value={`${satoshiToBSV(Number(transactionFee))} BSV (${feeRate} satoshis/byte)`}
              />
            </div>
          </div>
          <div
            className='form-group row'
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              marginRight: '-15px',
              marginLeft: '-15px',
            }}>
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
