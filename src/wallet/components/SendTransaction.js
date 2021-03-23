import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Button, Grid, Input, Divider } from 'semantic-ui-react';
import { utils } from 'allegory-allpay-sdk';
import * as walletActions from '../walletActions';

class SendTransaction extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      receiverAddress: '',
      amountInSatoshi: 600,
      transactionFee: '',
      message: '',
      feeRate: 1,
      isAllpayName: false,
      isError: false,
      sliderValue: 1,
      // maxSliderValue: Math.floor(Math.log(1000000000) / Math.log(1.05)),
      maxSliderValue: 20,
      sliderDisabled: true,
    };
  }

  async componentDidMount() {
    document.getElementById('feerate').max = this.state.maxSliderValue;
  }

  componentDidUpdate() {
    document.getElementById('feerate').max = this.state.maxSliderValue;
    document.getElementById('feerate').disabled = this.state.sliderDisabled;
  }

  onPaytoNameAddressChange = event => {
    const receiverAllpayNameOrAddress = event.target.value;
    if (
      receiverAllpayNameOrAddress.substring(0, 1) === 'm' ||
      receiverAllpayNameOrAddress.substring(0, 1) === 'n'
    ) {
      this.setState({
        isError: false,
        receiverAddress: receiverAllpayNameOrAddress,
        isAllpayName: false,
      });
    } else {
      if (
        receiverAllpayNameOrAddress.substring(
          0,
          receiverAllpayNameOrAddress.length <= 3 ? receiverAllpayNameOrAddress.length : 3
        ) ===
          (receiverAllpayNameOrAddress.length <= 3
            ? 'aa/'.substring(0, receiverAllpayNameOrAddress.length)
            : 'aa/') ||
        receiverAllpayNameOrAddress.substring(
          0,
          receiverAllpayNameOrAddress.length <= 3 ? receiverAllpayNameOrAddress.length : 3
        ) ===
          (receiverAllpayNameOrAddress.length <= 3
            ? 'tw/'.substring(0, receiverAllpayNameOrAddress.length)
            : 'tw/')
      ) {
        this.setState({
          isError: false,
          receiverAddress: receiverAllpayNameOrAddress,
          isAllpayName: true,
          message: '',
        });
      } else {
        this.setState({
          isError: true,
          receiverAddress: receiverAllpayNameOrAddress,
          isAllpayName: false,
          message: "Namespace should be either 'aa/' or 'tw/'",
        });
      }
    }
  };

  onAmountChange = async event => {
    const { dispatch } = this.props;
    const { receiverAddress, feeRate, sliderValue } = this.state;
    this.setState({ amountInSatoshi: Number(event.target.value) });
    if (event.target.value <= 0) {
      this.setState({ sliderValue: 1, sliderDisabled: true, feeRate: 1, transactionFee: 0 });
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
            feeRate: parseInt(sliderValue),
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
    const { receiverAddress, amountInSatoshi, feeRate, isAllpayName } = this.state;
    if (receiverAddress && amountInSatoshi) {
      if (isAllpayName) {
        try {
          await dispatch(
            walletActions.createAllpayTransaction({
              allpayName: receiverAddress,
              amountInSatoshi,
              feeRate: Number(feeRate),
            })
          );
          this.setState({ isError: false, message: 'Transaction Successful' });
        } catch (error) {
          this.setState({
            isError: true,
            message: error.response && error.response.data ? error.response.data : error.message,
          });
        }
      } else {
        try {
          await dispatch(
            walletActions.createTransaction({
              receiverAddress,
              amountInSatoshi,
              feeRate: Number(feeRate),
              relay: true,
            })
          );
          this.setState({ isError: false, message: 'Transaction Successful' });
        } catch (error) {
          this.setState({
            isError: true,
            message: error.response && error.response.data ? error.response.data : error.message,
          });
        }
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
    const tempFeeRate = parseInt(sliderVal);

    this.setState({
      feeRate: tempFeeRate,
      sliderValue: sliderVal,
    });

    if (amountInSatoshi > 0) {
      try {
        const transactionFee = await dispatch(
          walletActions.getTransactionFee(receiverAddress, amountInSatoshi, tempFeeRate)
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
    // }
  };

  render() {
    const { receiverAddress, amountInSatoshi, transactionFee, feeRate, sliderValue } = this.state;
    return (
      <Grid stackable>
        <Grid.Row>
          <Grid.Column width={4} verticalAlign='middle'>
            <b>Pay to</b>
          </Grid.Column>
          <Grid.Column width={7}>
            <Input
              fluid
              type='text'
              placeholder='allpay name / address'
              value={receiverAddress}
              onChange={this.onPaytoNameAddressChange}
            />
          </Grid.Column>
        </Grid.Row>
        <Divider className='walletHomeDividerHorizontal' />
        <Grid.Row>
          <Grid.Column width={4} verticalAlign='middle'>
            <b>Amount</b>
          </Grid.Column>
          <Grid.Column width={7}>
            <Input
              fluid
              type='number'
              className='form-control'
              id='amount'
              // disabled={receiverAddress === '' ? true : false}
              value={amountInSatoshi}
              onChange={this.onAmountChange}
            />
          </Grid.Column>
          <Grid.Column width={5}>
            <p className='form-control-plaintext'>{utils.satoshiToBSV(amountInSatoshi)}</p>
          </Grid.Column>
        </Grid.Row>
        <Divider className='walletHomeDividerHorizontal' />
        <Grid.Row>
          <Grid.Column width={4} verticalAlign='middle'>
            <b>Network Fee (Satoshis/byte)</b>
          </Grid.Column>
          <Grid.Column width={7} verticalAlign='middle'>
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
          <Grid.Column width={5}>
            <p>{`${utils.satoshiToBSV(Number(transactionFee))} (${feeRate} satoshis/byte)`}</p>
          </Grid.Column>
        </Grid.Row>
        <Divider className='walletHomeDividerHorizontal' />
        <Grid.Row>
          <Grid.Column width={16}>{this.renderMessage()}</Grid.Column>
        </Grid.Row>
        <Grid.Row centered>
          <Grid.Column>
            <Button
              className='coral'
              onClick={this.onSend}
              disabled={receiverAddress === '' ? true : false}>
              Send
            </Button>
            <Button className='peach' onClick={this.onClose}>
              Close
            </Button>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    );
  }
}

SendTransaction.propTypes = {
  dispatch: PropTypes.func.isRequired,
};

SendTransaction.defaultProps = {};

const mapStateToProps = state => ({});

export default withRouter(connect(mapStateToProps)(SendTransaction));
