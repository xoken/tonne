import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Grid, Header, Label, Segment, Button } from 'semantic-ui-react';
import { getCodePoint, satoshiToBSV } from '../../shared/utils';
import * as allpayActions from '../allpayActions';

class RenderTransaction extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  renderTransaction() {
    const { transaction } = this.props;
    if (transaction && false) {
      const { inputs: txInps, outputs: txOuts } = transaction;

      let totalInput = 0;
      let totalOutput = 0;
      let credit = 0;
      let debit = 0;
      let outgoing = 0;

      txInps.forEach(input => {
        totalInput = totalInput + input.value;
        if (input.isMine) {
          debit = debit + input.value;
        }
      });

      txOuts.forEach(output => {
        totalOutput = totalOutput + output.value;
        if (output.isMine) {
          credit = credit + output.value;
        } else {
          outgoing = outgoing + output.value;
        }
      });

      const renderCreditOrDebit = (credit, debit) => {
        if (credit > 0 && debit > 0) {
          return (
            <>
              <span className='monospace debit'>{`-${satoshiToBSV(debit)} BSV`}</span>
              <span className='monospace'>{` / `}</span>
              <span className='monospace credit'>{`+${satoshiToBSV(credit)} BSV`}</span>
            </>
          );
        } else if (credit > 0) {
          return <span className='monospace credit'>{`+${satoshiToBSV(credit)} BSV`}</span>;
        } else if (debit > 0) {
          return <span className='monospace debit'>{`-${satoshiToBSV(debit)} BSV`}</span>;
        }
        return '';
      };

      return (
        <Segment className='transaction'>
          <Grid>
            <Grid.Column width={10}>
              <span className='monospace'>{transaction.txId}</span>
            </Grid.Column>
            <Grid.Column width={5} textAlign='right'>
              {renderCreditOrDebit(credit, debit)}
            </Grid.Column>
            <Grid.Column width={1} textAlign='right'>
              <Label className='plain'>
                <i
                  title={
                    transaction.confirmations > 10
                      ? 'More than 10 Confirmations'
                      : `${transaction.confirmations} Confirmations`
                  }
                  className={
                    transaction.confirmations > 10
                      ? 'green lock icon'
                      : 'warning unlock alternate icon'
                  }></i>
              </Label>
            </Grid.Column>
          </Grid>
          <Grid divided columns='two'>
            <Grid.Row>
              <Grid.Column>
                <Header as='h6' className='monospace'>
                  Inputs
                </Header>
                {txInps.map(input => {
                  return (
                    <Grid key={input.txInputIndex}>
                      <Grid.Column width='10'>
                        <p className='monospace'>{input.address}</p>
                      </Grid.Column>
                      <Grid.Column width='6' textAlign='right'>
                        <p className='monospace'>
                          <span className={input.isMine ? 'debit' : ''}>
                            {`${satoshiToBSV(input.value)} BSV`}
                          </span>
                        </p>
                      </Grid.Column>
                    </Grid>
                  );
                })}
              </Grid.Column>
              <Grid.Column>
                <Header as='h6' className='monospace'>
                  Outputs
                </Header>
                {txOuts.map(output => {
                  return (
                    <Grid key={output.outputIndex}>
                      <Grid.Column width='10'>
                        <p className='monospace'>{output.address}</p>
                      </Grid.Column>
                      <Grid.Column width='6' textAlign='right'>
                        <p className='monospace'>
                          <span className={output.isMine ? 'credit' : ''}>
                            {`${satoshiToBSV(output.value)} BSV`}
                          </span>
                        </p>
                      </Grid.Column>
                    </Grid>
                  );
                })}
                <div className='ui right aligned grid'>
                  <div className='column'>
                    <Label className='monospace plain'>
                      {debit > 0 ? 'Total debit:' : 'Total credit:'}
                      <Label.Detail>
                        {debit > 0
                          ? `${satoshiToBSV(outgoing)} BSV`
                          : `${satoshiToBSV(credit)} BSV`}
                      </Label.Detail>
                    </Label>
                  </div>
                </div>
                <div className='ui right aligned grid'>
                  <div className='column'>
                    <Label className='monospace plain'>
                      Fee:
                      <Label.Detail>{`${satoshiToBSV(totalInput - totalOutput)} BSV`}</Label.Detail>
                    </Label>
                  </div>
                </div>
              </Grid.Column>
            </Grid.Row>
          </Grid>
          <Grid>
            <Grid.Row>
              <Grid.Column textAlign='right'>
                <Button color='yellow'>Sign and Relay</Button>
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Segment>
      );
    }
    return null;
  }

  render() {
    return (
      <>
        <Header as='h2' textAlign='center'>
          Partially Sign Transaction
        </Header>
        <div className='ui grid'>
          <div className='ten wide column centered row'>
            <div className='column'>{this.renderTransaction()}</div>
          </div>
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
  transaction: state.allpay.psaTx,
});

export default withRouter(connect(mapStateToProps)(RenderTransaction));
