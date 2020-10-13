import React from 'react';
import { Link, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { Segment, Grid, Button } from 'semantic-ui-react';
import ExplorerHttpsReq from '../modules/ExplorerHttpsReq.js';

class ExplorerAddress extends React.Component {
  constructor(props) {
    super(props);
    this.state = { selectnum: '', leftright: '' };
    this.addlistener = this.addlistener.bind(this);
    this.leftlistener = this.leftlistener.bind(this);
    this.rightlistener = this.rightlistener.bind(this);
  }
  rjdecoded;
  result;
  address;
  txlist = [];
  addressCache = [];
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
  totaloutputs = 0;
  totalinputs = 0;

  initAddress = async () => {
    if (this.props.match.params.address !== undefined) {
      this.address = this.props.match.params.address;
    }
    this.rjdecoded = await ExplorerHttpsReq.httpsreq('getOutputsByAddress', this.address, 100);
    if (this.rjdecoded === undefined) {
      this.props.history.push(`/explorer/404`);
    } else {
      this.pagearrayinit();
    }
  };

  printresults = () => {
    this.txlist.length = 0;
    console.log(this.addressCache);
    var printbreaker = 1;
    var txnumber = (this.selected - 1) * this.outputsperpage;
    console.log(this.selected + 'this.selected');

    for (var i = txnumber; i < this.addressCache.length; i++) {
      console.log(this.addressCache[i].spendInfo);
      this.txlist.push(
        <>
          <Grid>
            <Grid.Row columns={1} className='nopaddingtop'>
              <Grid.Column className='txslnum'>
                <h4>
                  #({i + 1})&nbsp;
                  <Link to={'/explorer/transaction/' + this.addressCache[i].outputTxHash}>
                    {this.addressCache[i].outputTxHash}
                  </Link>
                  - Output Transaction Hash
                </h4>
              </Grid.Column>
            </Grid.Row>
            <Grid.Row columns={1}>
              <Grid.Column>
                <Grid>
                  <Grid.Row columns={1}>
                    <Grid.Column style={{ padding: '0px' }}>
                      <Segment>
                        <Grid>
                          <Grid.Row columns={2} divided>
                            <Grid.Column>
                              <Grid>
                                <Grid.Row columns={1} className='cen'>
                                  <Grid.Column>
                                    <h5>Inputs</h5>
                                  </Grid.Column>
                                </Grid.Row>
                                <Grid.Row columns={1}>
                                  <Grid.Column
                                    width='16'
                                    style={{
                                      maxHeight: '1350px',
                                      overflowY: 'auto',
                                      paddingTop: '14px',
                                      paddingBottom: '14px',
                                    }}>
                                    {this.prevoutpoint(this.addressCache[i].prevOutpoint)}
                                  </Grid.Column>
                                </Grid.Row>
                                <Grid.Row columns={1} style={{ padding: '10px' }}>
                                  <div>
                                    <b>Total inputs (in Satoshis): </b>
                                  </div>
                                  <div>{this.totalinputs}</div>
                                </Grid.Row>
                              </Grid>
                            </Grid.Column>
                            <Grid.Column>
                              <Grid>
                                <Grid.Row columns={1} className='cen'>
                                  <Grid.Column>
                                    <h5>Outputs (Spending Information)</h5>
                                  </Grid.Column>
                                </Grid.Row>
                                <Grid.Row columns={1}>
                                  <Grid.Column
                                    style={{
                                      maxHeight: '1350px',
                                      overflowY: 'auto',
                                      paddingTop: '14px',
                                      paddingBottom: '14px',
                                    }}>
                                    {this.spendinfo(this.addressCache[i].spendInfo)}
                                  </Grid.Column>
                                </Grid.Row>
                                <Grid.Row columns={1} style={{ padding: '10px' }}>
                                  <div>
                                    <b>Total outputs (in Satoshis): </b>
                                  </div>
                                  <div>{this.totaloutputs}</div>
                                </Grid.Row>
                              </Grid>
                            </Grid.Column>
                          </Grid.Row>
                        </Grid>
                      </Segment>
                    </Grid.Column>
                  </Grid.Row>
                  <Grid.Row columns={3}>
                    <Grid.Column width='3'>
                      <b>Satoshis: </b>
                      {this.addressCache[i].value}
                    </Grid.Column>
                    <Grid.Column width='2'>
                      <b>Block Height: </b>
                      <Link
                        to={'/explorer/blockheight/' + this.addressCache[i].blockHeight + '/""'}>
                        {this.addressCache[i].blockHeight}
                      </Link>
                    </Grid.Column>
                    <Grid.Column className='tdwordbreak' width='11'>
                      <b>Block Hash: </b>
                      <Link to={'/explorer/blockhash/' + this.addressCache[i].blockHash + '/""'}>
                        {this.addressCache[i].blockHash}
                      </Link>
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
      selectnum: this.selected,
    });
  };
  totaloutput = outputsatoshis => {
    this.totaloutputs += outputsatoshis;
  };
  spendinfo = spendInfo => {
    var spendinfojsx = [];
    this.totaloutputs = 0;

    if (spendInfo) {
      for (var b = 0; b < Object.keys(spendInfo.spendData).length; b++) {
        spendinfojsx.push(
          <Grid>
            <Grid.Row columns={1}>
              <Grid.Column>
                <Grid>
                  <Grid.Row columns={3}>
                    <Grid.Column width='2'>
                      <b>Index: </b>
                      {spendInfo.spendData[b].spendingOutputIndex}
                    </Grid.Column>
                    <Grid.Column width='3'>
                      <b>Satoshis: </b>
                      {spendInfo.spendData[b].value}
                      {this.totaloutput(spendInfo.spendData[b].value)}
                    </Grid.Column>
                    <Grid.Column className='tdwordbreak' width='11'>
                      <div>
                        <b>Output Address: </b>
                      </div>
                      <div>
                        <Link
                          to={'/explorer/address/' + spendInfo.spendData[b].outputAddress + '/""'}>
                          {spendInfo.spendData[b].outputAddress}
                        </Link>
                      </div>
                    </Grid.Column>
                  </Grid.Row>
                </Grid>
              </Grid.Column>
            </Grid.Row>
          </Grid>
        );
      }
      return spendinfojsx;
    }
  };
  checkforinvalidtxid = txidpar => {
    if (txidpar !== '0000000000000000000000000000000000000000000000000000000000000000') {
      return (
        <>
          <div>
            <b>Transaction Hash: </b>
          </div>
          <div>
            <Link to={'/explorer/transaction/' + txidpar + '/""'}>{txidpar}</Link>
          </div>
        </>
      );
    } else {
      return <div>Newly minted coins</div>;
    }
  };
  totalinput = inputsatoshis => {
    this.totalinputs += inputsatoshis;
  };

  prevoutpoint = prevoutpoint => {
    var prevoutpointjsx = [];
    this.totalinputs = 0;
    for (var a = 0; a < Object.keys(prevoutpoint).length; a++) {
      prevoutpointjsx.push(
        <Grid>
          <Grid.Row columns={1}>
            <Grid.Column>
              <Grid>
                <Grid.Row columns={1}>
                  <Grid.Column className='tdwordbreak' width='16'>
                    {this.checkforinvalidtxid(prevoutpoint[a][0].opTxHash)}
                  </Grid.Column>
                </Grid.Row>
                <Grid.Row columns={2}>
                  <Grid.Column>
                    <b>Index: </b>
                    {prevoutpoint[a][0].opIndex}
                  </Grid.Column>
                  <Grid.Column>
                    <div>
                      <b>Satoshis: </b>
                    </div>
                    <div>{prevoutpoint[a][2]}</div>
                    {this.totalinput(prevoutpoint[a][2])}
                  </Grid.Column>
                </Grid.Row>
              </Grid>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      );
    }
    return prevoutpointjsx;
  };

  pagearrayinit = () => {
    this.addressCache.length = 0;
    this.cachecounter = 0;
    this.caching();
    console.log(this.addressCache.length + 'this.addressCache.length');
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
      for (var i = 0; i < Object.keys(this.rjdecoded.outputs).length; i++) {
        this.addressCache[this.cachecounter] = this.rjdecoded.outputs[i];
        this.cachecounter += 1;
      }
      this.nextcursor = this.rjdecoded.nextCursor;
    } else {
      this.nextcursor = null;
    }
    console.log(this.addressCache.length + 'addressCache.length');
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
  };

  addlistener = event => {
    this.selected = event.target.value;
    console.log(this.selected + 'this.selected addlistener');
    console.log(event.target.value + 'event.target.value addlistener');
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
        console.log(this.pagearray[t] + 'this.pagearray[t]');
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
      console.log('right arrow clicked');
      //  console.log(this.pagearray[this.pagearray.length-1]+"this.pagearray[this.pagearray.length-1]");
      console.log(this.totalpagesavailable + 'totalpagesavailable');
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
        this.adddataupdatepagearray();
      } else {
        console.log('elseblock');
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
          console.log(this.pagearray[t] + 'this.pagearray[t]');
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
          <Button onClick={this.onBack} className='explorerbuttoncolor'>
            Back
          </Button>
        </Segment>
        <div className='opacitywhileload'>
          <Segment.Group>
            <Segment>
              <h4>
                Address &nbsp;
                {this.address}
              </h4>
            </Segment>
            <Segment>
              <h4>
                <div id='nooftransactions'></div>Transactions
              </h4>
            </Segment>
            <Segment>{this.txlist}</Segment>
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
