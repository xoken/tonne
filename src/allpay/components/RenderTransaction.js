import React from 'react';
import { connect } from 'react-redux';
import { withRouter, Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Grid, Header, Segment } from 'semantic-ui-react';
import RenderOutput from '../../wallet/components/RenderOutput';
import { utils } from 'allegory-allpay-sdk';

class RenderTransaction extends React.Component {
  renderTransaction() {
    const { psbt, inputs, ownOutputs, snv, addressCommitment, utxoCommitment } = this.props;
    if (psbt) {
      const { txInputs, txOutputs } = psbt;
      // let totalInput = 0;
      // let totalOutput = 0;
      // let credit = 0;
      // let debit = 0;
      // let outgoing = 0;

      // txInps.forEach(input => {
      //   totalInput = totalInput + input.value;
      //   if (input.isMine) {
      //     debit = debit + input.value;
      //   }
      // });

      // txOuts.forEach(output => {
      //   totalOutput = totalOutput + output.value;
      //   if (output.isMine) {
      //     credit = credit + output.value;
      //   } else {
      //     outgoing = outgoing + output.value;
      //   }
      // });

      // const renderCreditOrDebit = (credit, debit) => {
      //   if (credit > 0 && debit > 0) {
      //     return (
      //       <>
      //         <span className='monospace debit'>{`-${utils.satoshiToBSV(debit)} BSV`}</span>
      //         <span className='monospace'>{` / `}</span>
      //         <span className='monospace credit'>{`+${utils.satoshiToBSV(credit)} BSV`}</span>
      //       </>
      //     );
      //   } else if (credit > 0) {
      //     return <span className='monospace credit'>{`+${utils.satoshiToBSV(credit)} BSV`}</span>;
      //   } else if (debit > 0) {
      //     return <span className='monospace debit'>{`-${utils.satoshiToBSV(debit)} BSV`}</span>;
      //   }
      //   return '';
      // };

      return (
        <>
          <Segment className='transaction'>
            <Grid stackable>
              <Grid.Column width={10}>
                <span className='monospace word-wrap'>{`${psbt.toHex().substring(0, 20)}...`}</span>
              </Grid.Column>
              {/* <Grid.Column width={5} textAlign='right'>
                {renderCreditOrDebit(credit, debit)}
              </Grid.Column> */}
              <Grid.Column width={6} textAlign='right'>
                {/* <Label className='plain'>
                  <i title={''} className={''}></i>
                </Label> */}
                {snv !== null ? (
                  <div className='ui green label'>
                    SNV
                    <div className='detail'>
                      {snv ? <span>&#10003;</span> : <span>&#10005;</span>}
                    </div>
                  </div>
                ) : null}
                {addressCommitment !== null ? (
                  <div className='ui green label'>
                    Address Commitment
                    <div className='detail'>
                      {addressCommitment ? <span>&#10003;</span> : <span>&#10005;</span>}
                    </div>
                  </div>
                ) : null}
                {utxoCommitment !== null ? (
                  <div className='ui green label'>
                    UTXO Commitment
                    <div className='detail'>
                      {utxoCommitment ? <span>&#10003;</span> : <span>&#10005;</span>}
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
                        <Grid.Column width='12'>
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
                        <Grid.Column width='4' textAlign='right'>
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
                  <div className='ui right aligned grid'>
                    <div className='column'>
                      {/* <Label className='monospace plain'>
                      {debit > 0 ? 'Total debit:' : 'Total credit:'}
                      <Label.Detail>
                        {debit > 0
                          ? utils.satoshiToBSV(outgoing)
                          : utils.satoshiToBSV(credit)}
                      </Label.Detail>
                    </Label> */}
                    </div>
                  </div>
                  <div className='ui right aligned grid'>
                    <div className='column'>
                      {/* <Label className='monospace plain'>
                      Fee:
                      <Label.Detail>{utils.satoshiToBSV(totalInput - totalOutput)}</Label.Detail>
                    </Label> */}
                    </div>
                  </div>
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
  addressCommitment: state.allpay.addressCommitment,
  utxoCommitment: state.allpay.utxoCommitment,
});

export default withRouter(connect(mapStateToProps)(RenderTransaction));
