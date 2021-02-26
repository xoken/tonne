import React from 'react';
import { connect } from 'react-redux';
import { withRouter, Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Grid, Header, Segment } from 'semantic-ui-react';
import RenderOutput from '../../wallet/components/RenderOutput';
import { utils } from 'allegory-allpay-sdk';

class RenderTransaction extends React.Component {
  renderTransaction() {
    const { psbt, inputs, ownOutputs, snv } = this.props;
    if (psbt) {
      const { txInputs, txOutputs } = psbt;

      return (
        <>
          <Segment className='transaction'>
            <Grid stackable>
              <Grid.Column width={10}>
                <span className='monospace word-wrap'>{`${psbt.toHex().substring(0, 20)}...`}</span>
              </Grid.Column>
              <Grid.Column width={6} textAlign='right'>
                {snv !== null ? (
                  <div className='ui green label'>
                    SNV
                    <div className='detail'>
                      {snv ? <span>&#10003;</span> : <span>&#10005;</span>}
                    </div>
                  </div>
                ) : null}
              </Grid.Column>
            </Grid>
            <Grid divided columns='two' stackable>
              <Grid.Row className='paddingLeftRight14px'>
                <Grid.Column>
                  <Header as='h5' className='monospace paddingLeftRight14px'>
                    Inputs
                  </Header>
                  {txInputs.map((input, index) => {
                    const transactionId = Buffer.from(input.hash).reverse().toString('hex');
                    const value = psbt.data.inputs[index].witnessUtxo?.value;
                    const isMine = inputs.find(inp => {
                      return inp.outputTxHash === transactionId && inp.outputIndex === input.index;
                    });
                    return (
                      <Grid key={String(index)}>
                        <Grid.Column computer='12' tablet='11' mobile='11'>
                          <p className='monospace word-wrap'>
                            <span
                              className={
                                isMine && isMine.isNameOutpoint
                                  ? 'nUTXO recentTxidAddressColumn'
                                  : 'recentTxidAddressColumn'
                              }
                              title={
                                isMine && isMine.isNameOutpoint
                                  ? `Name Outpoint: ${transactionId}`
                                  : transactionId
                              }>
                              <span className='recentTxidAddress'>{`${transactionId.substring(
                                0,
                                30
                              )}...[${input.index}]`}</span>
                              <Link to={'/explorer/transaction/' + transactionId}>
                                <span className='padding5px'>
                                  <i className='walletLink'></i>
                                </span>
                              </Link>
                            </span>
                          </p>
                        </Grid.Column>
                        <Grid.Column computer='4' tablet='5' mobile='5' textAlign='right'>
                          <p className='monospace'>
                            <span className={isMine ? 'debit' : ''}>
                              {value && utils.satoshiToBSV(value)}
                            </span>
                          </p>
                        </Grid.Column>
                      </Grid>
                    );
                  })}
                </Grid.Column>
                <Grid.Column>
                  <Header as='h5' className='monospace paddingLeftRight14px'>
                    Outputs
                  </Header>
                  {txOutputs.map((output, index) => {
                    const isMine = ownOutputs.find(
                      ownOutput => ownOutput.address === output.address
                    );
                    return (
                      <RenderOutput
                        key={String(index)}
                        addressStyle={isMine && isMine.type === 'nUTXO' ? 'nUTXO' : undefined}
                        address={output.address}
                        script={Buffer.from(output.script).toString('hex')}
                        title={isMine ? isMine.title : undefined}
                        valueStyle={isMine ? 'credit' : ''}
                        value={output.value}
                      />
                    );
                  })}
                </Grid.Column>
              </Grid.Row>
            </Grid>
          </Segment>
        </>
      );
    }
    return null;
  }

  render() {
    return (
      <>
        <div className='ui grid'>
          <div className='column'>{this.renderTransaction()}</div>
        </div>
      </>
    );
  }
}

RenderTransaction.propTypes = {
  dispatch: PropTypes.func.isRequired,
};

RenderTransaction.defaultProps = {};

const mapStateToProps = state => ({
  psbt: state.allpay.psbt,
  name: state.allpay.name,
  inputs: state.allpay.inputs,
  ownOutputs: state.allpay.ownOutputs,
  snv: state.allpay.snv,
});

export default withRouter(connect(mapStateToProps)(RenderTransaction));
