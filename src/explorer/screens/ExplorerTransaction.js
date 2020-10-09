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
  merklebranchsection = [];
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
    function checkforinvalidtxid(txidpar) {
      if (txidpar !== '0000000000000000000000000000000000000000000000000000000000000000') {
        return <Link to={'/explorer/transaction/' + txidpar}>{txidpar}</Link>;
      } else {
        return <div>Newly minted coins</div>;
      }
    }
    this.summarysect1.push(
      <>
        <Grid>
          <Grid.Row columns={2}>
            <Grid.Column>
              <b>Block</b>
            </Grid.Column>
            <Grid.Column>
              <div id='blocktitle'>(# {this.rjdecoded.tx.blockHeight} )</div>

              <div id='blockhash'>
                BlockHash -
                <Link to={'/explorer/blockhash/' + this.rjdecoded.tx.blockHash + '/""'}>
                  {this.rjdecoded.tx.blockHash}
                </Link>
              </div>
            </Grid.Column>
          </Grid.Row>
          <Grid.Row columns={2}>
            <Grid.Column>
              <b>Transaction Version</b>
            </Grid.Column>
            <Grid.Column>
              <div id='txversion'>{this.rjdecoded.tx.tx.txVersion}</div>
            </Grid.Column>
          </Grid.Row>
          <Grid.Row columns={2}>
            <Grid.Column>
              <b>Locktime</b>
            </Grid.Column>
            <Grid.Column>
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
            <Grid.Column>
              <b>txIndex</b>
            </Grid.Column>
            <Grid.Column>
              <div id='txindex'>{this.rjdecoded.tx.txIndex}</div>
            </Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <Grid.Column>
              <b>Size</b>
            </Grid.Column>
            <Grid.Column>
              <div id='size'>{this.rjdecoded.tx.size}</div>
            </Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <Grid.Column>
              <b>Fees</b>
            </Grid.Column>
            <Grid.Column>
              <div id='fees'>{this.rjdecoded.tx.fees}</div>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </>
    );
    this.inputs = Object.keys(this.rjdecoded.tx.tx.txInps).length;
    this.outputs = Object.keys(this.rjdecoded.tx.tx.txOuts).length;

    this.txid = this.rjdecoded.tx.txId;
    for (var i = 0; i < Object.keys(this.rjdecoded.tx.merkleBranch).length; i++) {
      this.merklebranchsection.push(
        <Grid>
          <Grid.Row columns={4} divided>
            <Grid.Column>
              <b>nodeValue : </b>
            </Grid.Column>
            <Grid.Column>{this.rjdecoded.tx.merkleBranch[i].nodeValue}</Grid.Column>
            <Grid.Column>
              <b>isLeftNode : </b>
            </Grid.Column>
            <Grid.Column>{this.rjdecoded.tx.merkleBranch[i].isLeftNode} </Grid.Column>
          </Grid.Row>
        </Grid>
      );
    }
    this.inputaddress.push(
      <Grid>
        <Grid.Row columns={1}>
          <Grid.Column>
            <b>Inputs:</b>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    );
    this.tempoutputstring.push(
      <Grid>
        <Grid.Row columns={1}>
          <Grid.Column>
            <b>Outputs:</b>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    );
    for (var j = 0; j < this.inputs; j++) {
      this.inputaddress.push(
        <Grid>
          <Grid.Row columns={2}>
            <Grid.Column>({j + 1}). </Grid.Column>
            <Grid.Column>
              <Grid>
                <Grid.Row columns={2}>
                  <Grid.Column>
                    <b>Address</b>
                  </Grid.Column>
                  <Grid.Column>
                    <Link to={'/explorer/address/' + this.rjdecoded.tx.tx.txInps[j].address}>
                      {this.rjdecoded.tx.tx.txInps[j].address}
                    </Link>
                  </Grid.Column>
                </Grid.Row>
                <Grid.Row columns={2}>
                  <Grid.Column>
                    <b>outpointTxID</b>
                  </Grid.Column>
                  <Grid.Column>
                    {checkforinvalidtxid(this.rjdecoded.tx.tx.txInps[j].outpointTxID)}
                  </Grid.Column>
                </Grid.Row>
                <Grid.Row columns={2}>
                  <Grid.Column>
                    <b>value</b>
                  </Grid.Column>
                  <Grid.Column>{this.rjdecoded.tx.tx.txInps[j].value}</Grid.Column>
                </Grid.Row>
                <Grid.Row columns={2}>
                  <Grid.Column>
                    <b>txInputIndex</b>
                  </Grid.Column>
                  <Grid.Column>{this.rjdecoded.tx.tx.txInps[j].txInputIndex}</Grid.Column>
                </Grid.Row>
                <Grid.Row columns={2}>
                  <Grid.Column>
                    <b>outpointIndex</b>
                  </Grid.Column>
                  <Grid.Column>{this.rjdecoded.tx.tx.txInps[j].outpointIndex}</Grid.Column>
                </Grid.Row>
              </Grid>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      );
    }
    for (var z = 0; z < this.outputs; z++) {
      this.tempoutputstring.push(
        <Grid>
          <Grid.Row columns={2}>
            <Grid.Column>({z + 1}).</Grid.Column>
            <Grid.Column>
              <Grid>
                <Grid.Row columns={2}>
                  <Grid.Column>
                    <b>address</b>
                  </Grid.Column>
                  <Grid.Column>
                    <Link to={'/explorer/address/' + this.rjdecoded.tx.tx.txOuts[z].address}>
                      {this.rjdecoded.tx.tx.txOuts[z].address}
                    </Link>
                  </Grid.Column>
                </Grid.Row>
                <Grid.Row columns={2}>
                  <Grid.Column>
                    <b>lockingScript</b>
                  </Grid.Column>
                  <Grid.Column>{this.rjdecoded.tx.tx.txOuts[z].lockingScript}</Grid.Column>
                </Grid.Row>
                <Grid.Row columns={2}>
                  <Grid.Column>
                    <b>value</b>
                  </Grid.Column>
                  <Grid.Column>{this.rjdecoded.tx.tx.txOuts[z].value} </Grid.Column>
                </Grid.Row>
                <Grid.Row columns={2}>
                  <Grid.Column>
                    <b>outputIndex</b>
                  </Grid.Column>
                  <Grid.Column>{this.rjdecoded.tx.tx.txOuts[z].outputIndex}</Grid.Column>
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
              <Grid.Column></Grid.Column>
              <Grid.Column>
                <Grid>
                  <Grid.Row columns={2}>
                    <Grid.Column>
                      <b>spendingBlockHash</b>
                    </Grid.Column>
                    <Grid.Column>
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
                    <Grid.Column>
                      <b>spendingBlockHeight</b>
                    </Grid.Column>
                    <Grid.Column>
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
                    <Grid.Column>
                      <b>spendingTxId</b>
                    </Grid.Column>
                    <Grid.Column>
                      <Link
                        to={
                          '/explorer/transaction/' +
                          this.rjdecoded.tx.tx.txOuts[z].txSpendInfo.spendingTxId
                        }>
                        {this.rjdecoded.tx.tx.txOuts[z].txSpendInfo.spendingTxId}
                      </Link>
                    </Grid.Column>
                  </Grid.Row>
                  <Grid.Row columns={2}>
                    <Grid.Column>
                      <b>spendingTxIndex</b>
                    </Grid.Column>
                    <Grid.Column>
                      {this.rjdecoded.tx.tx.txOuts[z].txSpendInfo.spendingTxIndex}
                    </Grid.Column>
                  </Grid.Row>
                </Grid>
              </Grid.Column>
            </Grid.Row>
          </Grid>
        );
        for (
          var b = 0;
          b < Object.keys(this.rjdecoded.tx.tx.txOuts[z].txSpendInfo.spendData).length;
          b++
        ) {
          this.tempoutputstring.push(
            <Grid>
              <Grid.Row columns={2}>
                <Grid.Column></Grid.Column>
                <Grid.Column>
                  <Grid>
                    <Grid.Row columns={1}>
                      <Grid.Column>
                        <b>
                          <h5>spendData</h5>
                        </b>
                      </Grid.Column>
                    </Grid.Row>
                    <Grid.Row columns={2}>
                      <Grid.Column>
                        <b>spendingOutputIndex</b>
                      </Grid.Column>
                      <Grid.Column>
                        {
                          this.rjdecoded.tx.tx.txOuts[z].txSpendInfo.spendData[b]
                            .spendingOutputIndex
                        }
                      </Grid.Column>
                    </Grid.Row>
                    <Grid.Row columns={2}>
                      <Grid.Column>
                        <b>value</b>
                      </Grid.Column>
                      <Grid.Column>
                        {this.rjdecoded.tx.tx.txOuts[z].txSpendInfo.spendData[b].value}
                      </Grid.Column>
                    </Grid.Row>
                    <Grid.Row columns={2}>
                      <Grid.Column>
                        <b>outputAddress</b>
                      </Grid.Column>
                      <Grid.Column>
                        <Link
                          to={
                            '/explorer/address/' +
                            this.rjdecoded.tx.tx.txOuts[z].txSpendInfo.spendData[b].outputAddress
                          }>
                          {this.rjdecoded.tx.tx.txOuts[z].txSpendInfo.spendData[b].outputAddress}
                        </Link>
                      </Grid.Column>
                    </Grid.Row>
                  </Grid>
                </Grid.Column>
              </Grid.Row>
            </Grid>
          );
        }
      } else {
        //  this.tempoutputstring.push(<><br><br></td></tr></>);
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
        <Link
          className='btn btn-primary'
          to={'/explorer/blockheight/' + this.backblockHeight + '/' + this.backtxIndex}>
          Back
        </Link>
        <div className='opacitywhileload'>
          <Segment.Group>
            <Segment>
              <h4>Transaction</h4>
              <div id='txid'>{this.txid}</div>
            </Segment>
            <Segment>
              <h4>Summary</h4>
            </Segment>
            <Segment>
              <Grid columns={2} divided>
                <Grid.Row>
                  <Grid.Column>{this.summarysect1}</Grid.Column>
                  <Grid.Column>{this.summarysect2}</Grid.Column>
                </Grid.Row>
              </Grid>
            </Segment>
            <Segment>
              <Grid columns={1}>
                <Grid.Row>
                  <Grid.Column className='cen'>
                    <h4>MerkleBranch</h4>
                  </Grid.Column>
                </Grid.Row>
              </Grid>
            </Segment>
            <Segment>{this.merklebranchsection}</Segment>

            <Segment>
              <h5>
                <div>{this.inputs}</div> Inputs, <div>{this.outputs}</div> Outputs
              </h5>
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
