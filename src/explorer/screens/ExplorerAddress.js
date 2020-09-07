import React from 'react';
import { Link, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
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

  initAddress = async () => {
    if (this.props.match.params.address !== undefined) {
      this.address = this.props.match.params.address;
    }
    this.rjdecoded = await ExplorerHttpsReq.httpsreq('getOutputsByAddress', this.address, 100);
    this.pagearrayinit();
  };

  printresults = () => {
    this.txlist.length = 0;
    console.log(this.addressCache);
    var printbreaker = 1;
    var txnumber = (this.selected - 1) * this.outputsperpage;
    console.log(this.selected + 'this.selected');
    for (var i = txnumber; i < this.addressCache.length; i++) {
      this.txlist.push(
        <>
          <tr>
            <td className='txslnum'>
              #({i + 1}) -{' '}
              <Link to={'/explorer/transaction/' + this.addressCache[i].outputTxHash}>
                {this.addressCache[i].outputTxHash}
              </Link>{' '}
              - outputTxHash
            </td>
          </tr>
          <tr>
            <td>
              <table className='subtable'>
                <tr>
                  <td>
                    <b>Transaction Index:</b>
                    {this.addressCache[i].txIndex}
                  </td>
                  <td>
                    <b>Value:</b>
                    {this.addressCache[i].value}
                  </td>
                  <td>
                    <b>Output Index:</b>
                    {this.addressCache[i].outputIndex}
                  </td>
                  <td>
                    <b>Block Height:</b>
                    <Link to={'/explorer/blockheight/' + this.addressCache[i].blockHeight + '/""'}>
                      {this.addressCache[i].blockHeight}
                    </Link>
                  </td>
                </tr>
                <tr>
                  <td colspan='4'>
                    <b>Block Hash:</b>{' '}
                    <Link to={'/explorer/blockhash/' + this.addressCache[i].blockHash + '/""'}>
                      {this.addressCache[i].blockHash}
                    </Link>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </>
      );
      if (this.addressCache[i].spendInfo != null) {
        for (var b = 0; b < Object.keys(this.addressCache[i].spendInfo.spendData).length; b++) {
          this.txlist.push(
            <>
              <tr>
                <td className='spendinfo0'>
                  <hr />
                  <table className='subtable'>
                    <tr>
                      <th>
                        <p>
                          <b>spendData</b>
                        </p>
                      </th>
                    </tr>
                    <tr>
                      <td>
                        <b>Spending Output Index:</b>
                        {this.addressCache[i].spendInfo.spendData[b].spendingOutputIndex}
                      </td>
                      <td>
                        <b>Value:</b>
                        {this.addressCache[i].spendInfo.spendData[b].value}
                      </td>
                      <td>
                        <b>Output Address:</b>{' '}
                        <Link
                          to={
                            '/explorer/address/' +
                            this.addressCache[i].spendInfo.spendData[b].outputAddress +
                            '/""'
                          }>
                          {this.addressCache[i].spendInfo.spendData[b].outputAddress}
                        </Link>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </>
          );
        }
      }
      for (var a = 0; a < Object.keys(this.addressCache[i].prevOutpoint).length; a++) {
        this.txlist.push(
          <>
            <tr>
              <td className='spendinfo0'>
                <hr />
                <table className='subtable'>
                  <tr>
                    <th>
                      <p>
                        <b>prevOutpoint</b>
                      </p>
                    </th>
                  </tr>
                  <tr>
                    <td colspan='3'>
                      <b>opTxHash:</b>{' '}
                      <Link
                        to={
                          '/explorer/transaction/' +
                          this.addressCache[i].prevOutpoint[a][0].opTxHash +
                          '/""'
                        }>
                        {this.addressCache[i].prevOutpoint[a][0].opTxHash}
                      </Link>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <b>opIndex:</b>
                      {this.addressCache[i].prevOutpoint[a][0].opIndex}
                    </td>
                    <td>{this.addressCache[i].prevOutpoint[a][1]}</td>
                    <td>{this.addressCache[i].prevOutpoint[a][2]}</td>
                  </tr>
                </table>
              </td>
            </tr>
          </>
        );
      }

      this.txlist.push(
        <>
          <br />
          <br />
        </>
      );
      if (printbreaker === this.outputsperpage) {
        break;
      }

      printbreaker += 1;
    }
    this.setState({
      selectnum: this.selected
    });
  };

  pagearrayinit = () => {
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
      this.searchresultsmessage();
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
      leftright: this.currentbatchnum
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
      leftright: this.currentbatchnum
    });
  };

  componentDidMount() {
    this.initAddress();
  }

  render() {
    return (
      <>
        {
          //    <button onClick={this.props.history.goBack()} className='btn btn-primary'>
          //    Back
          //  </button>
        }
        <div className='opacitywhileload'>
          <div className='row'>
            <div className='col-md-12 col-lg-12'>
              <h4>Address</h4>
              <br />
              <div id='address'>{this.address}</div>
              <hr />
            </div>
          </div>

          <div className='row'>
            <div className='col-md-12 col-lg-12 summaryblock1'>
              <table id='addressummary'></table>
            </div>
          </div>

          <div className='row'>
            <div className='col-md-12 col-lg-12'>
              <h5>
                <div id='nooftransactions'></div>Transactions
              </h5>
            </div>
          </div>
          <div className='row'>
            <div className='col-md-12 col-lg-12'>
              <table id='txlist'>{this.txlist}</table>
            </div>
          </div>
          <div className='row'>
            <div className='col-md-12 col-lg-12'>
              <nav aria-label='transactions navigation'>
                <ul className='pagination justify-content-center' id='pagination'>
                  {this.pagescontainer}
                </ul>
              </nav>
            </div>
          </div>
        </div>
      </>
    );
  }
}

const mapStateToProps = state => ({});

export default withRouter(connect(mapStateToProps)(ExplorerAddress));
