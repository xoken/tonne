import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Button, Grid, Header } from 'semantic-ui-react';
import RenderTransaction from '../components/RenderTransaction';
import * as allpayActions from '../allpayActions';

class PartiallySignTransaction extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isError: false,
      message: '',
    };
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
          this.timerID = setTimeout(() => {
            this.props.history.push('/wallet/dashboard');
          }, 3000);
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

  render() {
    return (
      <>
        <Header as='h2' textAlign='center'>
          Signed Transaction
        </Header>
        <RenderTransaction />
        <Grid>
          <Grid.Row>
            <Grid.Column textAlign='right'>
              <Button className='coral' onClick={this.onSignRelay}>
                Send
              </Button>
            </Grid.Column>
          </Grid.Row>
        </Grid>
        <Grid>
          <Grid.Row>
            <Grid.Column width={16}>{this.renderMessage()}</Grid.Column>
          </Grid.Row>
        </Grid>
      </>
    );
  }

  componentWillUnmount() {
    clearTimeout(this.timerID);
  }
}

PartiallySignTransaction.propTypes = {
  dispatch: PropTypes.func.isRequired,
};

PartiallySignTransaction.defaultProps = {};

const mapStateToProps = state => ({
  psbt: state.allpay.psbt,
  name: state.allpay.name,
  inputs: state.allpay.inputs,
  ownOutputs: state.allpay.ownOutputs,
  snv: state.allpay.snv,
});

export default withRouter(connect(mapStateToProps)(PartiallySignTransaction));
