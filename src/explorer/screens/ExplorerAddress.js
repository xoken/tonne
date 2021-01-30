import React from 'react';
import { Link, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { Segment, Grid, Button, Loader } from 'semantic-ui-react';
import ExplorerHttpsReq from '../modules/ExplorerHttpsReq.js';

class ExplorerAddress extends React.Component {
  constructor(props) {
    super(props);
    this.state = { selectnum: '', leftright: '', isLoading: true };
    this.addlistener = this.addlistener.bind(this);
    this.leftlistener = this.leftlistener.bind(this);
    this.rightlistener = this.rightlistener.bind(this);
  }
  rjdecoded;
  rjdecodedtx;
  result;
  address;
  txlist = [];
  addressCache = [];
  txCache = [];
  arrayoftxs = [];
  cachecounter = 0;
  outputsperpage = 20;
  pagearray = [];
  fixedpagearrlength = 5;
  pagearrlength = 5;
  selected = 1;
  batches;
  totalpagesavailable;
  currentbatchnum = 1;
  nextcursor = '';
  pagescontainer = [];

  initAddress = async () => {
    if (this.props.match.params.address !== undefined) {
      this.address = this.props.match.params.address;
    }
    this.rjdecoded = await ExplorerHttpsReq.httpsreq('getOutputsByAddress', this.address, 100);
    if (this.rjdecoded === undefined) {
      this.props.history.push(`/explorer/404`);
    } else {
      this.arrayoftxs.length = 0;
      var temparray = [];
      for (var v = 0; v < Object.keys(this.rjdecoded.outputs).length; v++) {
        if (this.rjdecoded.outputs[v].spendInfo) {
          temparray.push(this.rjdecoded.outputs[v].spendInfo.spendingTxId);
          temparray.push(this.rjdecoded.outputs[v].outputTxHash);
        } else {
          temparray.push(this.rjdecoded.outputs[v].outputTxHash);
        }
      }
      this.arrayoftxs = Array.of(temparray);
      this.rjdecodedtx = await ExplorerHttpsReq.httpsreq('getTransactionsByTxIDs', this.arrayoftxs);

      this.pagearrayinit();
    }
  };

  printresults = async () => {
    this.txlist.length = 0;
    var printbreaker = 1;
    var txnumber = (this.selected - 1) * this.outputsperpage;

    for (var i = txnumber; i < this.addressCache.length; i++) {
      this.txlist.push(
        <>
          <Grid>
            <Grid.Row columns={1} className=' txslnum'>
              <Grid.Column computer={1} tablet={1} mobile={2}>
                <h4>#({i + 1})</h4>
              </Grid.Column>
              <Grid.Column computer={15} tablet={15} mobile={14}>
                <h4>
                  <Link
                    to={'/explorer/transaction/' + this.addressCache[i].txId}
                    className='word-wrap'>
                    {this.addressCache[i].txId}
                  </Link>
                </h4>
              </Grid.Column>
            </Grid.Row>
            <Grid.Row columns={1} className=''>
              <Grid.Column>
                <Grid>
                  <Grid.Row columns={2}>
                    <Grid.Column computer={2} mobile={2}>
                      <b>Satoshis: </b>
                    </Grid.Column>
                    <Grid.Column computer={14} mobile={14}>
                      {this.addressCache[i].value}
                    </Grid.Column>
                  </Grid.Row>
                  <Grid.Row className='nopaddingtop'>
                    <Grid.Column computer={1} tablet={2} mobile={3}>
                      <b>Block:</b>
                    </Grid.Column>
                    <Grid.Column computer={15} tablet={14} mobile={13}>
                      <span className='tdwordbreak'>
                        <Link to={'/explorer/blockhash/' + this.addressCache[i].blockHash}>
                          {this.addressCache[i].blockHash}
                        </Link>
                      </span>
                      {'   '}&nbsp; (#
                      <Link to={'/explorer/blockheight/' + this.addressCache[i].blockHeight}>
                        {this.addressCache[i].blockHeight}
                      </Link>
                      )
                    </Grid.Column>
                  </Grid.Row>
                  <Grid.Row columns={1} className='nopaddingtop'>
                    <Grid.Column style={{ padding: '0px' }}>
                      <Segment className='nopaddingtop removesegmentborder'>
                        <Grid stackable>
                          <Grid.Row columns={2}>
                            <Grid.Column>
                              <Grid>
                                <Grid.Row columns={1} className='cen'>
                                  <Grid.Column>
                                    <h5 className='purplefontcolor'>Inputs</h5>
                                  </Grid.Column>
                                </Grid.Row>
                                <Grid.Row columns={1} className='nopaddingtop'>
                                  <Grid.Column
                                    width='16'
                                    style={{
                                      maxHeight: '1350px',
                                      overflowY: 'auto',
                                      paddingTop: '14px',
                                      paddingBottom: '14px',
                                    }}>
                                    {this.inputs(this.txCache[i])}
                                  </Grid.Column>
                                </Grid.Row>
                              </Grid>
                            </Grid.Column>
                            <Grid.Column className='verticaldivider'>
                              <Grid>
                                <Grid.Row columns={1} className='cen'>
                                  <Grid.Column>
                                    <h5 className='purplefontcolor'>Outputs</h5>
                                  </Grid.Column>
                                </Grid.Row>
                                <Grid.Row columns={1} className='nopaddingtop'>
                                  <Grid.Column
                                    style={{
                                      maxHeight: '1350px',
                                      overflowY: 'auto',
                                      paddingTop: '14px',
                                      paddingBottom: '14px',
                                    }}>
                                    {this.outputs(this.txCache[i])}
                                  </Grid.Column>
                                </Grid.Row>
                              </Grid>
                            </Grid.Column>
                          </Grid.Row>
                        </Grid>
                      </Segment>
                    </Grid.Column>
                  </Grid.Row>
                </Grid>
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </>
      );

      if (printbreaker === this.outputsperpage) {
        break;
      }

      printbreaker += 1;
    }
    this.setState({
      isLoading: false,
      selectnum: this.selected,
    });
  };

  outputs = output => {
    var outputsjsx = [];
    function checkforemptyaddress(txaddress) {
      if (txaddress) {
        return <Link to={'/explorer/address/' + txaddress}>{txaddress}</Link>;
      } else {
        return <div>n/a</div>;
      }
    }
    var outps = Object.keys(output.tx.txOuts).length;
    if (outps && outps > 0) {
      for (var b = 0; b < outps; b++) {
        outputsjsx.push(
          <Grid>
            <Grid.Row columns={2}>
              <Grid.Column width={2}>({b + 1}).</Grid.Column>
              <Grid.Column width={14}>
                <Grid>
                  <Grid.Row columns={2} className='paddtopbottom5px'>
                    <Grid.Column computer={3} mobile={5} style={{ marginTop: '10px' }}>
                      <b>Address</b>
                    </Grid.Column>
                    <Grid.Column
                      className='tdwordbreak'
                      computer={13}
                      mobile={11}
                      style={{ marginTop: '10px' }}>
                      {checkforemptyaddress(output.tx.txOuts[b].address)}
                    </Grid.Column>
                  </Grid.Row>
                  <Grid.Row columns={2} className='paddtopbottom5px'>
                    <Grid.Column computer={3} mobile={5}>
                      <b>Satoshis</b>
                    </Grid.Column>
                    <Grid.Column computer={13} mobile={11}>
                      {output.tx.txOuts[b].value}
                    </Grid.Column>
                  </Grid.Row>
                </Grid>
              </Grid.Column>
            </Grid.Row>
          </Grid>
        );
        if (b < outps - 1) {
          outputsjsx.push(
            <Grid>
              <Grid.Row columns={1}>
                <Grid.Column width={16}></Grid.Column>
              </Grid.Row>
            </Grid>
          );
        }
      }
      return outputsjsx;
    }
  };

  inputs = input => {
    var inputsjsx = [];
    var inps = Object.keys(input.tx.txInps).length,
      a = 0;
    function checkforinvalidaddress(txaddress) {
      if (txaddress) {
        return (
          <>
            <Grid.Column computer={3} mobile={5} style={{ marginTop: '10px' }}>
              <b>Address</b>
            </Grid.Column>
            <Grid.Column
              className='tdwordbreak'
              computer={13}
              mobile={11}
              style={{ marginTop: '10px' }}>
              <Link to={'/explorer/address/' + txaddress}>{txaddress}</Link>{' '}
            </Grid.Column>
          </>
        );
      } else {
        return (
          <>
            <Grid.Column width={16} style={{ marginTop: '10px' }} className='paddtopbottom5px'>
              Newly minted coins
            </Grid.Column>
          </>
        );
      }
    }
    function checkforinvalidoutpointindex(outpointindex) {
      if (outpointindex >= 0) {
        return (
          <>
            <Grid.Row columns={2} className='paddtopbottom5px'>
              <Grid.Column computer={3} mobile={5}>
                <b>Outpoint Index</b>
              </Grid.Column>
              <Grid.Column computer={13} mobile={11}>
                {outpointindex}
              </Grid.Column>
            </Grid.Row>
          </>
        );
      } else {
        return <></>;
      }
    }
    for (a = 0; a < inps; a++) {
      inputsjsx.push(
        <Grid>
          <Grid.Row columns={2}>
            <Grid.Column width={2}>({a + 1}).</Grid.Column>
            <Grid.Column width={14}>
              <Grid>
                <Grid.Row columns={2} className='paddtopbottom5px'>
                  {checkforinvalidaddress(input.tx.txInps[a].address)}
                </Grid.Row>
                <Grid.Row columns={2} className='paddtopbottom5px'>
                  <Grid.Column computer={3} mobile={5}>
                    <b>Satoshis</b>
                  </Grid.Column>
                  <Grid.Column computer={13} mobile={11}>
                    {input.tx.txInps[a].value}
                  </Grid.Column>
                </Grid.Row>
                {checkforinvalidoutpointindex(input.tx.txInps[a].outpointIndex)}
              </Grid>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      );
      if (a < inps - 1) {
        inputsjsx.push(
          <Grid>
            <Grid.Row columns={1}>
              <Grid.Column width={16}></Grid.Column>
            </Grid.Row>
          </Grid>
        );
      }
    }
    return inputsjsx;
  };

  pagearrayinit = () => {
    this.addressCache.length = 0;
    this.txCache.length = 0;
    this.cachecounter = 0;
    this.caching();
    if (this.addressCache.length > 0) {
      var tempindex = 1;
      if (this.addressCache.length > this.outputsperpage) {
        this.totalpagesavailable = Math.ceil(this.addressCache.length / this.outputsperpage);
      } else {
        this.totalpagesavailable = 1;
      }
      for (var c = 0; c < this.totalpagesavailable; c++) {
        this.pagearray[c] = tempindex;
        if (this.fixedpagearrlength === tempindex) {
          break;
        }
        tempindex += 1;
      }
      this.batches = Math.ceil(this.totalpagesavailable / this.fixedpagearrlength);
      this.currentbatchnum = Math.ceil(this.selected / this.fixedpagearrlength);
      this.printpagination();

      this.printresults();
    } else {
      //
    }
  };

  caching = () => {
    if (Object.keys(this.rjdecoded.outputs).length > 0) {
      this.arrayoftxs.length = 0;
      var temparray = [];
      for (var v = 0; v < Object.keys(this.rjdecodedtx.txs).length; v++) {
        temparray[v] = this.rjdecodedtx.txs[v].txId;
      }
      this.arrayoftxs = Array.of(temparray);

      for (var i = 0; i < Object.keys(this.rjdecodedtx.txs).length; i++) {
        this.addressCache[this.cachecounter] = this.rjdecodedtx.txs[i];
        this.txCache[this.cachecounter] = this.rjdecodedtx.txs[i];
        this.cachecounter += 1;
      }
      this.nextcursor = this.rjdecoded.nextCursor;
    } else {
      this.nextcursor = null;
    }
  };

  adddataupdatepagearray = () => {
    var prevcounterval = this.cachecounter;
    this.caching();
    if (this.nextcursor != null) {
      this.totalpagesavailable = Math.ceil(this.addressCache.length / this.outputsperpage);
      this.batches = Math.ceil(this.totalpagesavailable / this.fixedpagearrlength);
      var pagenum = this.pagearray[this.pagearray.length - 1];
      this.currentbatchnum = Math.ceil(this.pagearray[0] / this.fixedpagearrlength);
      this.currentbatchnum += 1;
      var numpagesincurbatch = Math.ceil(
        (this.cachecounter - prevcounterval) / this.outputsperpage
      );
      for (var t = 0; t < numpagesincurbatch; t++) {
        pagenum += 1;
        this.pagearray[t] = pagenum;
      }
    }
    this.printpagination();
  };

  printpagination = () => {
    if (this.currentbatchnum === this.batches) {
      if (this.totalpagesavailable % this.fixedpagearrlength === 0) {
        this.pagearrlength = this.fixedpagearrlength;
      } else {
        this.pagearrlength = this.totalpagesavailable % this.fixedpagearrlength;
      }
    } else {
      this.pagearrlength = this.fixedpagearrlength;
    }
    this.pagescontainer.length = 0;
    if (this.pagearray[0] !== 1) {
      this.pagescontainer.push(
        <li className='page-item active'>
          <button className='arrows' onClick={this.leftlistener} id='leftarrow'>
            &lt;
          </button>
        </li>
      );
    }
    for (var i = 0; i < this.pagearrlength; i++) {
      if (this.pagearray[i] === this.selected) {
        this.pagescontainer.push(
          <li className='page-item active'>
            <button className='page-link' onClick={this.addlistener} value={this.pagearray[i]}>
              {this.pagearray[i]}
            </button>
          </li>
        );
      } else {
        this.pagescontainer.push(
          <li className='page-item'>
            <button className='page-link' onClick={this.addlistener} value={this.pagearray[i]}>
              {this.pagearray[i]}
            </button>
          </li>
        );
      }
    }
    if (
      this.pagearray[this.pagearrlength - 1] !== this.totalpagesavailable ||
      this.nextcursor != null
    ) {
      this.pagescontainer.push(
        <li className='page-item active'>
          <button className='arrows' onClick={this.rightlistener} id='rightarrow'>
            &gt;
          </button>
        </li>
      );
    }
    this.setState({ isLoading: false });
  };

  addlistener = event => {
    this.selected = parseInt(event.target.value);
    this.printpagination();
    this.printresults();
  };
  leftlistener = event => {
    if (this.pagearray[0] !== 1) {
      this.currentbatchnum = Math.ceil(this.pagearray[0] / this.totalpagesavailable);
      this.currentbatchnum -= 1;
      var ltindex = this.pagearray[0] - this.fixedpagearrlength;

      for (var t = 0; t < this.fixedpagearrlength; t++) {
        this.pagearray[t] = ltindex;
        ltindex += 1;
      }

      this.printpagination();
    }
    this.setState({
      leftright: this.currentbatchnum,
    });
  };
  rightlistener = async event => {
    if (
      this.pagearray[this.pagearray.length - 1] !== this.totalpagesavailable ||
      this.nextcursor != null
    ) {
      this.currentbatchnum = Math.ceil(this.pagearray[0] / this.fixedpagearrlength);
      if (
        this.pagearray[this.pagearray.length - 1] === this.totalpagesavailable &&
        this.nextcursor != null
      ) {
        this.rjdecoded = await ExplorerHttpsReq.httpsreq(
          'getOutputsByAddress',
          100,
          this.nextcursor
        );
        if (Object.keys(this.rjdecoded.outputs).length > 0) {
          this.arrayoftxs.length = 0;
          var temparray = [];
          for (var v = 0; v < Object.keys(this.rjdecoded.outputs).length; v++) {
            if (this.rjdecoded.outputs[v].spendInfo) {
              temparray.push(this.rjdecoded.outputs[v].spendInfo.spendingTxId);
              temparray.push(this.rjdecoded.outputs[v].outputTxHash);
            } else {
              temparray.push(this.rjdecoded.outputs[v].outputTxHash);
            }
          }

          this.arrayoftxs = Array.of(temparray);
          this.rjdecodedtx = await ExplorerHttpsReq.httpsreq(
            'getTransactionsByTxIDs',
            this.arrayoftxs
          );
        }
        this.adddataupdatepagearray();
      } else {
        this.currentbatchnum += 1;
        var tindex = this.pagearray[this.pagearray.length - 1];

        if (
          this.pagearray[this.pagearray.length - 1] + this.fixedpagearrlength >
          this.totalpagesavailable
        ) {
          this.pagearrlength = this.totalpagesavailable % this.fixedpagearrlength;
        } else {
          this.pagearrlength = this.fixedpagearrlength;
        }
        for (var t = 0; t < this.pagearrlength; t++) {
          tindex += 1;
          this.pagearray[t] = tindex;
        }
        this.printpagination();
      }
    }
    this.setState({
      leftright: this.currentbatchnum,
    });
  };

  componentDidMount() {
    this.initAddress();
  }
  componentDidUpdate(latestprops) {
    if (this.props.match.params.address !== latestprops.match.params.address) {
      this.initAddress();
    }
  }
  onBack = () => {
    this.props.history.goBack();
  };
  render() {
    return (
      <>
        <Segment className='noborder'>
          <Button onClick={this.onBack} className='backspace'>
            Back
          </Button>
        </Segment>
        <div className='opacitywhileload'>
          <Segment.Group className='removesegmentborder'>
            <Segment>
              <h4>
                <span className='purplefontcolor'>Address</span> &nbsp;
                <Link to={'/explorer/address/' + this.address} className='word-wrap'>
                  {this.address}
                </Link>
              </h4>
            </Segment>
            <Segment>
              <h4 className='purplefontcolor'>
                <div id='nooftransactions'></div>Transactions
              </h4>
            </Segment>
            <Segment>{this.state.isLoading ? <Loader active /> : this.txlist}</Segment>
            <Segment>
              <nav aria-label='transactions navigation'>
                <ul className='pagination justify-content-center' id='pagination'>
                  {this.pagescontainer}
                </ul>
              </nav>
            </Segment>
          </Segment.Group>
        </div>
      </>
    );
  }
}

const mapStateToProps = state => ({});

export default withRouter(connect(mapStateToProps)(ExplorerAddress));
