import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { utils } from 'allegory-allpay-sdk';
import RenderTransaction from '../components/RenderTransaction';
import * as allpayActions from '../allpayActions';

class ConfirmRegistration extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showTxDetails: false,
      isError: false,
      message: '',
    };
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch(
      allpayActions.updateScreenProps({
        title: 'Confirm AllPay Name Registration',
        activeStep: 4,
      })
    );
  }

  onSignRelay = async () => {
    const { psbt, inputs, ownOutputs } = this.props;
    if (psbt) {
      try {
        const { dispatch } = this.props;
        const { txBroadcast } = await dispatch(
          allpayActions.signRelayTransaction({
            psbtHex: psbt.toHex(),
            inputs,
            ownOutputs,
          })
        );
        if (txBroadcast) {
          this.setState({ isError: false, message: 'Transaction signed and relayed successfully' });
          this.props.history.push('/wallet/allpay/register-success');
        } else {
          this.setState({ isError: true, message: 'Error in relaying Transaction' });
        }
      } catch (error) {
        this.setState({ isError: true, message: error.message });
      }
    }
  };

  renderMessage() {
    const { isError, message } = this.state;
    if (message) {
      if (isError) {
        return (
          <div className='ui negative message'>
            <p className='word-wrap'>{message}</p>
          </div>
        );
      } else {
        return (
          <div className='ui success message'>
            <p className='word-wrap'>{message}</p>
          </div>
        );
      }
    }
  }

  renderTxDetail() {
    if (this.state.showTxDetails) {
      return <RenderTransaction />;
    }
    return null;
  }

  renderPurchaseCost() {
    const { psbt, ownOutputs } = this.props;
    if (psbt) {
      const { txOutputs } = psbt;
      const nameOutpoint = txOutputs.find(output => {
        const isMine = ownOutputs.find(ownOutput => ownOutput.address === output.address);
        if (isMine && isMine.type === 'nUTXO') {
          return true;
        }
        return false;
      });
      if (nameOutpoint) {
        return utils.satoshiToBSV(nameOutpoint.value);
      }
    }
    return null;
  }

  renderTransactionFee() {
    const { psbt, ownOutputs, inputs } = this.props;
    if (psbt) {
      const totalOwnInput = inputs.reduce((acc, currInput) => {
        acc = acc + currInput.value;
        return acc;
      }, 0);

      const { txOutputs } = psbt;
      const ownOutputsWithValue = txOutputs.filter(output => {
        const isMine = ownOutputs.find(ownOutput => ownOutput.address === output.address);
        if (isMine) {
          return true;
        }
        return false;
      });

      const totalOwnOutput = ownOutputsWithValue.reduce((acc, currOutput) => {
        acc = acc + currOutput.value;
        return acc;
      }, 0);

      return utils.satoshiToBSV(totalOwnInput - totalOwnOutput);
    }
    return null;
  }

  render() {
    const {
      outpoint: { name },
    } = this.props;
    const { showTxDetails } = this.state;
    return (
      <>
        <div className='ui grid stackable'>
          <div className='twelve wide column'>
            <div className='ui list'>
              <div className='item'>
                <div className='ui large custom label'>
                  AllPay Name:
                  <div className='detail'>{utils.codePointToName(name)}</div>
                </div>
              </div>
              {/* <div className='item'>
                <div className='ui large custom label'>
                  Name Price:
                  <div className='detail'>{this.renderPurchaseCost()}</div>
                </div>
              </div> */}
              <div className='item'>
                <div className='ui large custom label'>
                  Transaction Fee:
                  <div className='detail'>{this.renderTransactionFee()}</div>
                </div>
              </div>
              <div className='item'>
                <div className='ui large custom label'>
                  Note:
                  <div className='detail'>This is not reversible</div>
                </div>
              </div>
            </div>
          </div>
          <div className='four wide middle aligned column'>
            <h4 className='ui center aligned header'>{this.renderPurchaseCost()}</h4>
            <button className='fluid ui coral button' onClick={this.onSignRelay}>
              Confirm Registration
            </button>
            <button
              className='fluid ui basic borderless button'
              onClick={() => this.setState({ showTxDetails: !showTxDetails })}>
              {`${!showTxDetails ? 'View' : 'Hide'} transaction details`}
            </button>
          </div>
        </div>
        <div className='ui grid'>
          <div className='sixteen wide column'>{this.renderTxDetail()}</div>
        </div>
      </>
    );
  }
}

const mapStateToProps = state => ({
  psbt: state.allpay.psbt,
  outpoint: state.allpay.outpoint,
  inputs: state.allpay.inputs,
  ownOutputs: state.allpay.ownOutputs,
  snv: state.allpay.snv,
});

export default withRouter(connect(mapStateToProps)(ConfirmRegistration));
