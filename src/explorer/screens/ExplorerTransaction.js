import React from 'react';
import { Link, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
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
        return <div>{txidpar}</div>;
      }
    }
    this.summarysect1.push(
      <>
        <tr>
          <td>
            <b>Block</b>
          </td>
          <td>
            <div id='blocktitle'>(# {this.rjdecoded.tx.blockHeight} )</div>
            <br />
            <div id='blockhash'>
              BlockHash -{' '}
              <Link to={'/explorer/blockhash/' + this.rjdecoded.tx.blockHash + '/""'}>
                {this.rjdecoded.tx.blockHash}
              </Link>
            </div>
          </td>
        </tr>
        <tr>
          <td>
            <b>Transaction Version</b>
          </td>
          <td>
            <div id='txversion'>{this.rjdecoded.tx.tx.txVersion}</div>
          </td>
        </tr>
        <tr>
          <td>
            <b>Locktime</b>
          </td>
          <td>
            <div id='txlocktime'>{this.rjdecoded.tx.tx.txLockTime}</div>
          </td>
        </tr>
      </>
    );
    this.summarysect2.push(
      <>
        <tr>
          <td>
            <b>txIndex</b>
          </td>
          <td>
            <div id='txindex'>{this.rjdecoded.tx.txIndex}</div>
          </td>
        </tr>
        <tr>
          <td>
            <b>Size</b>
          </td>
          <td>
            <div id='size'>{this.rjdecoded.tx.size}</div>
          </td>
        </tr>
        <tr>
          <td>
            <b>Fees</b>
          </td>
          <td>
            <div id='fees'>{this.rjdecoded.tx.fees}</div>
          </td>
        </tr>
      </>
    );
    this.inputs = Object.keys(this.rjdecoded.tx.tx.txInps).length;
    this.outputs = Object.keys(this.rjdecoded.tx.tx.txOuts).length;

    this.txid = this.rjdecoded.tx.txId;
    for (var i = 0; i < Object.keys(this.rjdecoded.tx.merkleBranch).length; i++) {
      this.merklebranchsection.push(
        <tr>
          <td>
            <b>nodeValue : </b>
          </td>
          <td className='tdbordright'>{this.rjdecoded.tx.merkleBranch[i].nodeValue}</td>
          <td>
            <b>isLeftNode : </b>
          </td>
          <td>{this.rjdecoded.tx.merkleBranch[i].isLeftNode}</td>
        </tr>
      );
    }
    this.inputaddress.push(
      <tr>
        <td></td>
        <td className='tdpadd'>
          <b>Inputs:</b>
        </td>
      </tr>
    );
    this.tempoutputstring.push(
      <tr>
        <td></td>
        <td className='tdpadd'>
          <b>Outputs:</b>
        </td>
      </tr>
    );
    for (var j = 0; j < this.inputs; j++) {
      this.inputaddress.push(
        <tr>
          <td className='tdnum'>({j + 1}).</td>
          <td className='tdpadd'>
            <table className='outputinputtd'>
              <tr>
                <td>
                  <b>Address</b>
                </td>
                <td className='tdwordbreak'>
                  <Link to={'/explorer/address/' + this.rjdecoded.tx.tx.txInps[j].address}>
                    {this.rjdecoded.tx.tx.txInps[j].address}
                  </Link>
                </td>
              </tr>
              <tr>
                <td>
                  <b>outpointTxID</b>
                </td>
                <td className='tdwordbreak'>
                  {checkforinvalidtxid(this.rjdecoded.tx.tx.txInps[j].outpointTxID)}
                </td>
              </tr>
              <tr>
                <td>
                  <b>value</b>
                </td>
                <td className='tdwordbreak'>{this.rjdecoded.tx.tx.txInps[j].value}</td>
              </tr>
              <tr>
                <td>
                  <b>txInputIndex</b>
                </td>
                <td className='tdwordbreak'>{this.rjdecoded.tx.tx.txInps[j].txInputIndex}</td>
              </tr>
              <tr>
                <td>
                  <b>outpointIndex</b>
                </td>
                <td className='tdwordbreak'>{this.rjdecoded.tx.tx.txInps[j].outpointIndex}</td>
              </tr>
            </table>
          </td>
        </tr>
      );
    }
    for (var z = 0; z < this.outputs; z++) {
      this.tempoutputstring.push(
        <tr>
          <td className='tdnum'>({z + 1}).</td>
          <td className='tdpadd'>
            <table className='outputinputtd'>
              <tr>
                <td>
                  <b>address</b>
                </td>
                <td className='tdwordbreak'>
                  <Link to={'/explorer/address/' + this.rjdecoded.tx.tx.txOuts[z].address}>
                    {this.rjdecoded.tx.tx.txOuts[z].address}
                  </Link>
                </td>
              </tr>
              <tr>
                <td>
                  <b>lockingScript</b>
                </td>
                <td className='tdwordbreak'>{this.rjdecoded.tx.tx.txOuts[z].lockingScript}</td>
              </tr>
              <tr>
                <td>
                  <b>value</b>
                </td>
                <td className='tdwordbreak'>{this.rjdecoded.tx.tx.txOuts[z].value}</td>
              </tr>
              <tr>
                <td>
                  <b>outputIndex</b>
                </td>
                <td className='tdwordbreak'>{this.rjdecoded.tx.tx.txOuts[z].outputIndex}</td>
              </tr>
            </table>
          </td>
        </tr>
      );
      if (this.rjdecoded.tx.tx.txOuts[z].txSpendInfo != null) {
        this.tempoutputstring.push(
          <tr>
            <td colspan='2'>
              <table className='outputinputtd'>
                <tr>
                  <td>
                    <b>spendingBlockHash</b>
                  </td>
                  <td className='tdwordbreak'>
                    <Link
                      to={
                        '/explorer/blockhash/' +
                        this.rjdecoded.tx.tx.txOuts[z].txSpendInfo.spendingBlockHash +
                        '/""'
                      }>
                      {this.rjdecoded.tx.tx.txOuts[z].txSpendInfo.spendingBlockHash}
                    </Link>
                  </td>
                </tr>
                <tr>
                  <td>
                    <b>spendingBlockHeight</b>
                  </td>
                  <td className='tdwordbreak'>
                    <Link
                      to={
                        '/explorer/blockheight/' +
                        this.rjdecoded.tx.tx.txOuts[z].txSpendInfo.spendingBlockHeight +
                        '/""'
                      }>
                      {this.rjdecoded.tx.tx.txOuts[z].txSpendInfo.spendingBlockHeight}
                    </Link>
                  </td>
                </tr>
                <tr>
                  <td>
                    <b>spendingTxId</b>
                  </td>
                  <td className='tdwordbreak'>
                    <Link
                      to={
                        '/explorer/transaction/' +
                        this.rjdecoded.tx.tx.txOuts[z].txSpendInfo.spendingTxId
                      }>
                      {this.rjdecoded.tx.tx.txOuts[z].txSpendInfo.spendingTxId}
                    </Link>
                  </td>
                </tr>
                <tr>
                  <td>
                    <b>spendingTxIndex</b>
                  </td>
                  <td className='tdwordbreak'>
                    {this.rjdecoded.tx.tx.txOuts[z].txSpendInfo.spendingTxIndex}
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        );
        for (
          var b = 0;
          b < Object.keys(this.rjdecoded.tx.tx.txOuts[z].txSpendInfo.spendData).length;
          b++
        ) {
          this.tempoutputstring.push(
            <tr>
              <td colspan='2'>
                <table className='outputinputtd'>
                  <tr>
                    <br />
                    <td colspan='2'>
                      <b>
                        <h5>spendData</h5>
                      </b>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <b>spendingOutputIndex</b>
                    </td>
                    <td className='tdwordbreak'>
                      {this.rjdecoded.tx.tx.txOuts[z].txSpendInfo.spendData[b].spendingOutputIndex}
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <b>value</b>
                    </td>
                    <td className='tdwordbreak'>
                      {this.rjdecoded.tx.tx.txOuts[z].txSpendInfo.spendData[b].value}
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <b>outputAddress</b>
                    </td>
                    <td className='tdwordbreak'>
                      <Link
                        to={
                          '/explorer/address/' +
                          this.rjdecoded.tx.tx.txOuts[z].txSpendInfo.spendData[b].outputAddress
                        }>
                        {this.rjdecoded.tx.tx.txOuts[z].txSpendInfo.spendData[b].outputAddress}
                      </Link>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
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
          <div className='row'>
            <div className='col-md-12 col-lg-12'>
              <h4>Transaction</h4>
              <div id='txid'>{this.txid}</div>
              <hr />
            </div>
          </div>
          <div className='row'>
            <div className='col-md-12 col-lg-12'>
              <h4>Summary</h4>
            </div>
          </div>
          <div className='row'>
            <div className='col-md-6 col-lg-6 summaryblock1'>
              <table className='tdborderbottom'>{this.summarysect1}</table>
            </div>
            <div className='col-md-6 col-lg-6 summaryblock1'>
              <table className='tdborderbottom'>{this.summarysect2}</table>
            </div>
          </div>
          <br />
          <hr />
          <br />
          <div className='row'>
            <div className='col-md-12 col-lg-12'>
              <center>
                <h4>MerkleBranch</h4>
              </center>
              <table id='merklebranchsection'>{this.merklebranchsection}</table>
            </div>
          </div>

          <hr />
          <div className='row'>
            <div className='col-md-12 col-lg-12'>
              <h5>
                <div>{this.inputs}</div> Inputs, <div>{this.outputs}</div> Outputs
              </h5>
              <hr />
            </div>
          </div>
          <div className='row'>
            <div className='col-md-6 col-lg-6'>
              <table id='inputaddress'>{this.inputaddress}</table>
            </div>
            <div className='col-md-6 col-lg-6'>
              <table id='outputaddress'>{this.tempoutputstring}</table>
            </div>
          </div>
        </div>
      </>
    );
  }
}

const mapStateToProps = state => ({});

export default withRouter(connect(mapStateToProps)(ExplorerTransaction));
