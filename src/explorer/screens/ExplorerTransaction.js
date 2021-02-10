import React from 'react';
import { Link, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { Segment, Grid, Loader } from 'semantic-ui-react';
import ExplorerHttpsReq from '../modules/ExplorerHttpsReq.js';

class ExplorerTransaction extends React.Component {
  constructor(props) {
    super(props);
    this.state = { loaded: false, loading: true };
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
    } else {
      this.setState({ loading: false });
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
            <Grid.Row columns={2} className='paddbottom5px'>
              <Grid.Column computer={3} mobile={5}>
                <b>Address</b>
              </Grid.Column>
              <Grid.Column
                className='tdwordbreak noPaddingTopBottomFormobiles'
                computer={13}
                mobile={11}>
                {checkforemptyaddress(txaddress)}
              </Grid.Column>
            </Grid.Row>
            <Grid.Row columns={2} className='paddtopbottom5px'>
              <Grid.Column computer={3} mobile={5}>
                <b>Outpoint TxID / Index</b>
              </Grid.Column>
              <Grid.Column
                className='tdwordbreak noPaddingTopBottomFormobiles'
                computer={13}
                mobile={11}>
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
            <Grid.Column computer='3' mobile={5}>
              <b>Block</b>
            </Grid.Column>
            <Grid.Column computer='13' mobile={11}>
              <span id='blockhash'>
                <Link to={'/explorer/blockhash/' + this.rjdecoded.tx.blockHash}>
                  {this.rjdecoded.tx.blockHash}
                </Link>
              </span>{' '}
              &nbsp; (#
              <Link to={'/explorer/blockheight/' + this.rjdecoded.tx.blockHeight}>
                {this.rjdecoded.tx.blockHeight}
              </Link>
              )
            </Grid.Column>
          </Grid.Row>
          <Grid.Row columns={2}>
            <Grid.Column computer='3' mobile={5}>
              <b>Transaction Version</b>
            </Grid.Column>
            <Grid.Column computer='13' mobile={11}>
              <div id='txversion'>{this.rjdecoded.tx.tx.txVersion}</div>
            </Grid.Column>
          </Grid.Row>
          <Grid.Row columns={2}>
            <Grid.Column computer={3} mobile={5}>
              <b>Locktime</b>
            </Grid.Column>
            <Grid.Column computer={13} mobile={11}>
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
            <Grid.Column computer='9' mobile={5}>
              <b>Transaction Index</b>
            </Grid.Column>
            <Grid.Column computer='7' mobile={11}>
              <div id='txindex'>{this.rjdecoded.tx.txIndex}</div>
            </Grid.Column>
          </Grid.Row>
          <Grid.Row columns={2}>
            <Grid.Column computer='9' mobile={5}>
              <b>Size</b>
            </Grid.Column>
            <Grid.Column computer='7' mobile={11}>
              <div>{this.rjdecoded.tx.size} bytes</div>
            </Grid.Column>
          </Grid.Row>
          <Grid.Row columns={2}>
            <Grid.Column computer='9' mobile={5}>
              <b>Fees</b>
            </Grid.Column>
            <Grid.Column computer='7' mobile={11}>
              <div>{this.rjdecoded.tx.fees} sats</div>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </>
    );

    var inps = Object.keys(this.rjdecoded.tx.tx.txInps).length,
      outps = Object.keys(this.rjdecoded.tx.tx.txOuts).length;

    if (inps > 1) {
      this.inputs = `Inputs (${inps})`;
    } else {
      this.inputs = `Input (${inps})`;
    }

    if (outps > 1) {
      this.outputs = `Outputs (${outps})`;
    } else {
      this.outputs = `Output (${outps})`;
    }

    this.txid = this.rjdecoded.tx.txId;
    this.inputaddress.push(
      <Grid>
        <Grid.Row columns={1}>
          <Grid.Column width='1'></Grid.Column>
          <Grid.Column width='15' textAlign='center'>
            <h4 className='purplefontcolor'>{this.inputs}</h4>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    );
    this.tempoutputstring.push(
      <Grid>
        <Grid.Row columns={1}>
          <Grid.Column width='1'></Grid.Column>
          <Grid.Column width='15' textAlign='center'>
            <h4 className='purplefontcolor'>{this.outputs}</h4>
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
                <Grid.Row columns={2} className='paddtopbottom5px'>
                  <Grid.Column computer={3} mobile={5}>
                    <b>Satoshis</b>
                  </Grid.Column>
                  <Grid.Column computer={13} mobile={11} className='noPaddingTopBottomFormobiles'>
                    {this.rjdecoded.tx.tx.txInps[j].value}
                  </Grid.Column>
                </Grid.Row>
              </Grid>
            </Grid.Column>
          </Grid.Row>
          <Grid.Row columns={1}>
            <Grid.Column width={16}></Grid.Column>
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
                <Grid.Row columns={2} className='paddbottom5px'>
                  <Grid.Column computer={3} mobile={5}>
                    <b>Address</b>
                  </Grid.Column>
                  <Grid.Column
                    className='tdwordbreak noPaddingTopBottomFormobiles'
                    computer={13}
                    mobile={11}>
                    {checkforemptyaddress(this.rjdecoded.tx.tx.txOuts[z].address)}
                  </Grid.Column>
                </Grid.Row>
                <Grid.Row columns={2} className='paddtopbottom5px'>
                  <Grid.Column computer={3} mobile={5}>
                    <b>Locking Script</b>
                  </Grid.Column>
                  <Grid.Column
                    className='tdwordbreak noPaddingTopBottomFormobiles'
                    computer={13}
                    mobile={11}
                    style={{ overflowX: 'auto', maxHeight: '100px' }}>
                    {this.rjdecoded.tx.tx.txOuts[z].lockingScript}
                  </Grid.Column>
                </Grid.Row>
                <Grid.Row columns={2} className='paddtopbottom5px'>
                  <Grid.Column computer={3} mobile={5}>
                    <b>Satoshis</b>
                  </Grid.Column>
                  <Grid.Column computer={13} mobile={11} className='noPaddingTopBottomFormobiles'>
                    {this.rjdecoded.tx.tx.txOuts[z].value}{' '}
                  </Grid.Column>
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
                <b>
                  <h5 className='purplefontcolor'>Spending Information</h5>
                </b>
              </Grid.Column>
            </Grid.Row>
            <Grid.Row columns={2}>
              <Grid.Column width={1}></Grid.Column>
              <Grid.Column width={15}>
                <Grid>
                  <Grid.Row columns={2} className='paddtopbottom5px'>
                    <Grid.Column computer={3} mobile={5}>
                      <b>Spending Block Hash</b>
                    </Grid.Column>
                    <Grid.Column
                      className='tdwordbreak noPaddingTopBottomFormobiles'
                      computer={13}
                      mobile={11}>
                      <Link
                        to={
                          '/explorer/blockhash/' +
                          this.rjdecoded.tx.tx.txOuts[z].txSpendInfo.spendingBlockHash
                        }>
                        {this.rjdecoded.tx.tx.txOuts[z].txSpendInfo.spendingBlockHash}
                      </Link>
                    </Grid.Column>
                  </Grid.Row>
                  <Grid.Row columns={2} className='paddtopbottom5px'>
                    <Grid.Column computer={3} mobile={5}>
                      <b>Spending Block Height</b>
                    </Grid.Column>
                    <Grid.Column computer={13} mobile={11} className='noPaddingTopBottomFormobiles'>
                      <Link
                        to={
                          '/explorer/blockheight/' +
                          this.rjdecoded.tx.tx.txOuts[z].txSpendInfo.spendingBlockHeight
                        }>
                        {this.rjdecoded.tx.tx.txOuts[z].txSpendInfo.spendingBlockHeight}
                      </Link>
                    </Grid.Column>
                  </Grid.Row>
                  <Grid.Row columns={2} className='paddtopbottom5px'>
                    <Grid.Column computer={3} mobile={5}>
                      <b>Spending TxID / Index</b>
                    </Grid.Column>
                    <Grid.Column
                      className='tdwordbreak noPaddingTopBottomFormobiles'
                      computer={13}
                      mobile={11}>
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
              <Grid.Column width={16}></Grid.Column>
            </Grid.Row>
          </Grid>
        );
      } else {
        this.tempoutputstring.push(
          <Grid>
            <Grid.Row columns={1}>
              <Grid.Column width={16}></Grid.Column>
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
      this.setState({ loading: 'true' });
      this.initTransaction();
    }
  }
  render() {
    const { loading } = this.state;
    return (
      <>
        <Segment className='noborder'>
          <Link
            className='ui button backspace'
            to={'/explorer/blockheight/' + this.backblockHeight + '/' + (this.backtxIndex + 1)}>
            Back
          </Link>
        </Segment>
        {loading ? (
          <Loader active />
        ) : (
          <div className='opacitywhileload'>
            <Segment.Group className='removesegmentborder'>
              <Segment>
                <h4>
                  <span className='purplefontcolor'>Transaction</span> &nbsp;
                  <Link to={'/explorer/transaction/' + this.txid} className='word-wrap'>
                    {this.txid}
                  </Link>
                </h4>
              </Segment>
              <Segment>
                <h4 className='purplefontcolor'>Summary</h4>
              </Segment>
              <Segment className='removesegmentborder'>
                <Grid columns={2} divided stackable>
                  <Grid.Row>
                    <Grid.Column width='12'>{this.summarysect1}</Grid.Column>
                    <Grid.Column width='4'>{this.summarysect2}</Grid.Column>
                  </Grid.Row>
                </Grid>
              </Segment>
              <Segment>
                <Grid columns={2} stackable>
                  <Grid.Row>
                    <Grid.Column>{this.inputaddress}</Grid.Column>
                    <Grid.Column className='verticaldivider'>{this.tempoutputstring}</Grid.Column>
                  </Grid.Row>
                </Grid>
              </Segment>
            </Segment.Group>
          </div>
        )}
      </>
    );
  }
}

const mapStateToProps = state => ({});

export default withRouter(connect(mapStateToProps)(ExplorerTransaction));
