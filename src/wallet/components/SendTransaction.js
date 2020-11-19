import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Button, Grid, Input } from 'semantic-ui-react';
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
      receiverAllpayNameOrAddress: '',
      feeRate: 5,
      isError: false,
      message: '',
      sliderValue: 1,
      maxSliderValue: Math.floor(Math.log(1000000000) / Math.log(1.05)),
      sliderDisabled: true,
    };
  }

  async componentDidMount() {
    document.getElementById('feerate').max = this.state.maxSliderValue;
    // const { dispatch } = this.props;
    // await dispatch(walletActions.getUTXOs());
  }

  componentDidUpdate() {
    document.getElementById('feerate').max = this.state.maxSliderValue;
    document.getElementById('feerate').disabled = this.state.sliderDisabled;
  }

  onPaytoNameAddressChange = event => {
    const receiverAllpayNameOrAddress = event.target.value;
    var receiverAddress = '';
    if (
      receiverAllpayNameOrAddress.length === 36 &&
      (receiverAllpayNameOrAddress.substring(0, 1) === 'm' ||
        receiverAllpayNameOrAddress.substring(0, 1) === 'n')
    ) {
      receiverAddress = receiverAllpayNameOrAddress;
      this.setState({ receiverAddress: receiverAllpayNameOrAddress });
    }
  };

  onAmountChange = async event => {
    const { dispatch } = this.props;
    const { receiverAddress, feeRate, sliderValue } = this.state;
    this.setState({ amountInSatoshi: event.target.value });
    if (event.target.value <= 0) {
      this.setState({ sliderValue: 1, sliderDisabled: true, feeRate: 5, transactionFee: 0 });
    } else {
      this.setState({ sliderDisabled: false });
      try {
        const transactionFee = await dispatch(
          walletActions.getTransactionFee(receiverAddress, event.target.value, Number(feeRate))
        );
        if (Number(transactionFee) >= 50000000) {
          this.setState({
            isError: false,
            message: '',
            transactionFee: 50000000,
            maxSliderValue: sliderValue,
            feeRate: Math.floor(Math.pow(1.05, sliderValue)),
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
    const sliderVal = event.target.value;
    const { receiverAddress, amountInSatoshi } = this.state;
    const tempFeeRate = Math.floor(Math.pow(1.05, sliderVal));
    if (tempFeeRate <= 5) {
      if (Number(amountInSatoshi) > 0) {
        try {
          const transactionFee = await dispatch(
            walletActions.getTransactionFee(receiverAddress, amountInSatoshi, 5)
          );
          this.setState({
            isError: false,
            message: '',
            feeRate: 5,
            sliderValue: sliderVal,
            transactionFee: transactionFee,
          });
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
    }
    // else if (tempFeeRate >= 1000000000) {
    //   this.setState({
    //     feeRate: 1000000000,
    //     sliderValue: event.target.value
    //   });
    // }
    else {
      this.setState({
        feeRate: Math.floor(Math.pow(1.05, sliderVal)),
        sliderValue: sliderVal,
      });

      if (Number(amountInSatoshi) > 0) {
        try {
          const transactionFee = await dispatch(
            walletActions.getTransactionFee(
              receiverAddress,
              amountInSatoshi,
              Math.floor(Math.pow(1.05, Number(sliderVal)))
            )
          );
          if (Number(transactionFee) >= 50000000) {
            this.setState({
              isError: false,
              message: '',
              transactionFee: 50000000,
              //  sliderDisabled: true,
              maxSliderValue: sliderVal,
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
    }
  };

  render() {
    const { receiverAddress, amountInSatoshi, transactionFee, feeRate, sliderValue } = this.state;
    return (
      <Grid>
        <Grid.Row>
          <Grid.Column width={4} verticalAlign='middle'>
            Pay to
          </Grid.Column>
          <Grid.Column width={6}>
            <Input
              fluid
              placeholder='allpay name / address'
              onChange={this.onPaytoNameAddressChange}
            />
          </Grid.Column>
          <Grid.Column width={6}>
            <Input
              fluid
              type='text'
              readOnly
              id='receiverAddress'
              value={receiverAddress}
              placeholder='xxxxxxxxxxxxxxxxxxxxxxxxx'
            />
          </Grid.Column>
        </Grid.Row>
        <Grid.Row>
          <Grid.Column width={4} verticalAlign='middle'>
            Amount
          </Grid.Column>
          <Grid.Column width={6}>
            <Input
              fluid
              type='text'
              className='form-control'
              id='amount'
              disabled={receiverAddress === '' ? true : false}
              value={amountInSatoshi}
              onChange={this.onAmountChange}
            />
          </Grid.Column>
          <Grid.Column width={6}>
            <Input
              fluid
              type='text'
              readOnly
              className='form-control-plaintext'
              value={satoshiToBSV(Number(amountInSatoshi)) + ' BSV'}
            />
          </Grid.Column>
        </Grid.Row>
        <Grid.Row>
          <Grid.Column width={4} verticalAlign='middle'>
            Network Fee (Satoshis/byte)
          </Grid.Column>
          <Grid.Column width={6} verticalAlign='middle'>
            <input
              id='feerate'
              type='range'
              min='1'
              step='1'
              value={sliderValue}
              onChange={this.onexponentialSliderChange}
              style={{ width: '100%' }}
            />
          </Grid.Column>
          <Grid.Column width={6}>
            <Input
              fluid
              type='text'
              readOnly
              className='form-control-plaintext'
              value={`${satoshiToBSV(Number(transactionFee))} BSV (${feeRate} satoshis/byte)`}
            />
          </Grid.Column>
        </Grid.Row>
        <Grid.Row>
          <Grid.Column width={16}>
            {this.renderMessage()}
            {receiverAddress === '' ? (
              <div className='ui negative message'>
                <p>Enter correct Address or Allpay Name</p>
              </div>
            ) : (
              <></>
            )}{' '}
          </Grid.Column>
        </Grid.Row>
        <Grid.Row centered>
          <center>
            <Grid.Column>
              <Button
                color='yellow'
                onClick={this.onSend}
                disabled={receiverAddress === '' ? true : false}>
                Send
              </Button>

              <Button color='yellow' onClick={this.onClose}>
                Close
              </Button>
            </Grid.Column>
          </center>
        </Grid.Row>
      </Grid>
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
