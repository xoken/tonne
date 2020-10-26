import React from 'react';
import { Link, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { Segment, Grid } from 'semantic-ui-react';
import ExplorerHttpsReq from '../modules/ExplorerHttpsReq.js';

class ExplorerTransaction extends React.Component {
  constructor(props) {
    super(props);
    this.state = { loaded: false };
  }
  rjdecoded;
  transactionparam;
  tempoutputstring = [];
  summarysect1 = [];
  summarysect2 = [];
  inputaddress = [];
  inputs;
  outputs;
  txid;
  backblockHeight;
  backtxIndex;

  initTransaction = async () => {
    if (
      this.props.match.params.txid !== undefined ||
      (this.props.txid !== undefined && this.props.txid !== '')
    ) {
      if (this.props.txid !== '' && this.props.txid !== undefined) {
        this.transactionparam = this.props.txid;
      } else {
        this.transactionparam = this.props.match.params.txid;
      }
    }
    this.rjdecoded = await ExplorerHttpsReq.httpsreq('getTransactionByTxID', this.transactionparam);
    if (this.rjdecoded === undefined) {
      if (this.props.match.params.txid !== undefined) {
        this.props.history.push(`/explorer/404`);
      }
      console.log(this.props.match.params.txid + 'this.props.match.params.txid');
      console.log(this.props.txid + 'this.props.txid');
    } else {
      this.printresults();
    }
  };

  printresults = () => {
    this.tempoutputstring.length = 0;
    this.inputaddress.length = 0;
    this.summarysect1.length = 0;
    this.summarysect2.length = 0;
    this.backblockHeight = this.rjdecoded.tx.blockHeight;
    this.backtxIndex = this.rjdecoded.tx.txIndex;
    function checkforinvalidtxid(txaddress, txidpar, outpointindex) {
      if (txidpar !== '0000000000000000000000000000000000000000000000000000000000000000') {
        return (
          <>
            <Grid.Row columns={2}>
              <Grid.Column width={3}>
                <b>Address</b>
              </Grid.Column>
              <Grid.Column className='tdwordbreak' width={13}>
                {checkforemptyaddress(txaddress)}
              </Grid.Column>
            </Grid.Row>
            <Grid.Row columns={2}>
              <Grid.Column width={3}>
                <b>Outpoint TxID / Index</b>
              </Grid.Column>
              <Grid.Column className='tdwordbreak' width={13}>
                <Link to={'/explorer/transaction/' + txidpar}>{txidpar}</Link> / {outpointindex}
              </Grid.Column>
            </Grid.Row>
          </>
        );
      } else {
        return (
          <Grid.Row>
            <Grid.Column width={16}>Newly minted coins</Grid.Column>
          </Grid.Row>
        );
      }
    }

    function checkforemptyaddress(txaddress) {
      if (txaddress) {
        return <Link to={'/explorer/address/' + txaddress}>{txaddress}</Link>;
      } else {
        return <div>n/a</div>;
      }
    }
    this.summarysect1.push(
      <>
        <Grid>
          <Grid.Row columns={2}>
            <Grid.Column width='3'>
              <b>Block</b>
            </Grid.Column>
            <Grid.Column width='13'>
              (#
              <Link to={'/explorer/blockheight/' + this.rjdecoded.tx.blockHeight + '/""'}>
                {this.rjdecoded.tx.blockHeight}
              </Link>
              )
              <div id='blockhash'>
                Block Hash:
                <br />
                <Link to={'/explorer/blockhash/' + this.rjdecoded.tx.blockHash + '/""'}>
                  {this.rjdecoded.tx.blockHash}
                </Link>
              </div>
            </Grid.Column>
          </Grid.Row>
          <Grid.Row columns={2}>
            <Grid.Column width='3'>
              <b>Transaction Version</b>
            </Grid.Column>
            <Grid.Column width='13'>
              <div id='txversion'>{this.rjdecoded.tx.tx.txVersion}</div>
            </Grid.Column>
          </Grid.Row>
          <Grid.Row columns={2}>
            <Grid.Column width='3'>
              <b>Locktime</b>
            </Grid.Column>
            <Grid.Column width='13'>
              <div id='txlocktime'>{this.rjdecoded.tx.tx.txLockTime}</div>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </>
    );
    this.summarysect2.push(
      <>
        <Grid>
          <Grid.Row columns={2}>
            <Grid.Column width='9'>
              <b>Transaction Index</b>
            </Grid.Column>
            <Grid.Column width='7'>
              <div id='txindex'>{this.rjdecoded.tx.txIndex}</div>
            </Grid.Column>
          </Grid.Row>
          <Grid.Row columns={2}>
            <Grid.Column width='9'>
              <b>Size</b>
            </Grid.Column>
            <Grid.Column width='7'>
              <div>{this.rjdecoded.tx.size}</div>
            </Grid.Column>
          </Grid.Row>
          <Grid.Row columns={2}>
            <Grid.Column width='9'>
              <b>Fees</b>
            </Grid.Column>
            <Grid.Column width='7'>
              <div>{this.rjdecoded.tx.fees}</div>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </>
    );

    var inps = Object.keys(this.rjdecoded.tx.tx.txInps).length,
      outps = Object.keys(this.rjdecoded.tx.tx.txOuts).length;

    if (inps > 1) {
      this.inputs = `${inps} inputs`;
    } else {
      this.inputs = `${inps} input`;
    }

    if (outps > 1) {
      this.outputs = `${outps} outputs`;
    } else {
      this.outputs = `${outps} output`;
    }

    this.txid = this.rjdecoded.tx.txId;
    this.inputaddress.push(
      <Grid>
        <Grid.Row columns={1}>
          <Grid.Column width='1'></Grid.Column>
          <Grid.Column width='15'>
            <b>Inputs:</b>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    );
    this.tempoutputstring.push(
      <Grid>
        <Grid.Row columns={1}>
          <Grid.Column width='1'></Grid.Column>
          <Grid.Column width='15'>
            <b>Outputs:</b>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    );
    for (var j = 0; j < inps; j++) {
      this.inputaddress.push(
        <Grid>
          <Grid.Row columns={2}>
            <Grid.Column width={1}>({j + 1}). </Grid.Column>
            <Grid.Column width={15}>
              <Grid>
                {checkforinvalidtxid(
                  this.rjdecoded.tx.tx.txInps[j].address,
                  this.rjdecoded.tx.tx.txInps[j].outpointTxID,
                  this.rjdecoded.tx.tx.txInps[j].outpointIndex
                )}
                <Grid.Row columns={2}>
                  <Grid.Column width={3}>
                    <b>Satoshis</b>
                  </Grid.Column>
                  <Grid.Column width={13}>{this.rjdecoded.tx.tx.txInps[j].value}</Grid.Column>
                </Grid.Row>
              </Grid>
            </Grid.Column>
          </Grid.Row>
          <Grid.Row columns={1}>
            <Grid.Column width={16}>
              <div className='horizontaldivider'></div>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      );
    }
    for (var z = 0; z < outps; z++) {
      this.tempoutputstring.push(
        <Grid>
          <Grid.Row columns={2}>
            <Grid.Column width={1}>({z + 1}).</Grid.Column>
            <Grid.Column width={15}>
              <Grid>
                <Grid.Row columns={2}>
                  <Grid.Column width={3}>
                    <b>Address</b>
                  </Grid.Column>
                  <Grid.Column className='tdwordbreak' width={13}>
                    {checkforemptyaddress(this.rjdecoded.tx.tx.txOuts[z].address)}
                  </Grid.Column>
                </Grid.Row>
                <Grid.Row columns={2}>
                  <Grid.Column width={3}>
                    <b>Locking Script</b>
                  </Grid.Column>
                  <Grid.Column
                    className='tdwordbreak'
                    width={13}
                    style={{ overflowX: 'auto', maxHeight: '100px' }}>
                    {this.rjdecoded.tx.tx.txOuts[z].lockingScript}
                  </Grid.Column>
                </Grid.Row>
                <Grid.Row columns={2}>
                  <Grid.Column width={3}>
                    <b>Satoshis</b>
                  </Grid.Column>
                  <Grid.Column width={13}>{this.rjdecoded.tx.tx.txOuts[z].value} </Grid.Column>
                </Grid.Row>
              </Grid>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      );
      if (this.rjdecoded.tx.tx.txOuts[z].txSpendInfo != null) {
        this.tempoutputstring.push(
          <Grid>
            <Grid.Row columns={2}>
              <Grid.Column width='1'></Grid.Column>
              <Grid.Column width='15'>
                <div className='thinnerhorizontaldivider'></div>
                <b>
                  <h5>Spending Information</h5>
                </b>
              </Grid.Column>
            </Grid.Row>
            <Grid.Row columns={2}>
              <Grid.Column width={1}></Grid.Column>
              <Grid.Column width={15}>
                <Grid>
                  <Grid.Row columns={2}>
                    <Grid.Column width={3}>
                      <b>Spending Block Hash</b>
                    </Grid.Column>
                    <Grid.Column className='tdwordbreak' width={13}>
                      <Link
                        to={
                          '/explorer/blockhash/' +
                          this.rjdecoded.tx.tx.txOuts[z].txSpendInfo.spendingBlockHash +
                          '/""'
                        }>
                        {this.rjdecoded.tx.tx.txOuts[z].txSpendInfo.spendingBlockHash}
                      </Link>
                    </Grid.Column>
                  </Grid.Row>
                  <Grid.Row columns={2}>
                    <Grid.Column width={3}>
                      <b>Spending Block Height</b>
                    </Grid.Column>
                    <Grid.Column width={13}>
                      <Link
                        to={
                          '/explorer/blockheight/' +
                          this.rjdecoded.tx.tx.txOuts[z].txSpendInfo.spendingBlockHeight +
                          '/""'
                        }>
                        {this.rjdecoded.tx.tx.txOuts[z].txSpendInfo.spendingBlockHeight}
                      </Link>
                    </Grid.Column>
                  </Grid.Row>
                  <Grid.Row columns={2}>
                    <Grid.Column width={3}>
                      <b>Spending TxID / Index</b>
                    </Grid.Column>
                    <Grid.Column className='tdwordbreak' width={13}>
                      <Link
                        to={
                          '/explorer/transaction/' +
                          this.rjdecoded.tx.tx.txOuts[z].txSpendInfo.spendingTxId
                        }>
                        {this.rjdecoded.tx.tx.txOuts[z].txSpendInfo.spendingTxId}
                      </Link>{' '}
                      / {this.rjdecoded.tx.tx.txOuts[z].txSpendInfo.spendingTxIndex}
                    </Grid.Column>
                  </Grid.Row>
                </Grid>
              </Grid.Column>
            </Grid.Row>
            <Grid.Row columns={1}>
              <Grid.Column width={16}>
                <div className='horizontaldivider'></div>
              </Grid.Column>
            </Grid.Row>
          </Grid>
        );
      } else {
        this.tempoutputstring.push(
          <Grid>
            <Grid.Row columns={1}>
              <Grid.Column width={16}>
                <div className='horizontaldivider'></div>
              </Grid.Column>
            </Grid.Row>
          </Grid>
        );
      }
    }
    this.setState({ loaded: true });
  };

  componentDidMount() {
    this.initTransaction();
  }
  componentDidUpdate(latestprops) {
    if (this.props.match.params.txid !== latestprops.match.params.txid) {
      this.initTransaction();
    }
  }
  render() {
    return (
      <>
        <Segment className='noborder'>
          <Link
            className='ui button explorerbuttoncolor'
            to={'/explorer/blockheight/' + this.backblockHeight + '/' + this.backtxIndex}>
            Back
          </Link>
        </Segment>
        <div className='opacitywhileload'>
          <Segment.Group>
            <Segment>
              <h4>
                Transaction &nbsp;
                <Link to={'/explorer/transaction/' + this.txid}>{this.txid}</Link>
              </h4>
            </Segment>
            <Segment>
              <h4>Summary</h4>
            </Segment>
            <Segment>
              <Grid columns={2} divided>
                <Grid.Row>
                  <Grid.Column width='12'>{this.summarysect1}</Grid.Column>
                  <Grid.Column width='4'>{this.summarysect2}</Grid.Column>
                </Grid.Row>
              </Grid>
            </Segment>
            <Segment>
              <h4>
                <div>
                  {this.inputs}, {this.outputs}
                </div>
              </h4>
            </Segment>
            <Segment>
              <Grid columns={2}>
                <Grid.Row>
                  <Grid.Column>{this.inputaddress}</Grid.Column>
                  <Grid.Column>{this.tempoutputstring}</Grid.Column>
                </Grid.Row>
              </Grid>
            </Segment>
          </Segment.Group>
        </div>
      </>
    );
  }
}

const mapStateToProps = state => ({});

export default withRouter(connect(mapStateToProps)(ExplorerTransaction));
