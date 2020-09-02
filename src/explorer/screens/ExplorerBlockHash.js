import React from 'react';
import { Link, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import ExplorerHttpsReq from '../modules/ExplorerHttpsReq.js';

class ExplorerBlockHeight extends React.Component {
  constructor(props) {
    super(props);
    this.state = { enteredpagenumber: '', selectnum: '' };
    this.addlistener = this.addlistener.bind(this);
    this.leftlistener = this.leftlistener.bind(this);
    this.rightlistener = this.rightlistener.bind(this);
    this.pagebutton = this.pagebutton.bind(this);
  }
  rjdecoded;
  blockparam;
  backblock;
  flag;
  result;
  currentblockhash;
  numberoftransactions;
  batches;
  currentbatchnum = 1;
  numberofpages;
  pagearray = [0];
  index;
  pagearrlength = 5;
  selected = 1;
  txcache = [];
  numofdisplayedpages;
  serverpagenumber = 1;
  txfinished = 0;
  fixedarrlength = 5;
  txnumber;
  transactionsperpage = 10;
  summarysect1 = [];
  summarysect2 = [];
  pagescontainer = [];
  txsection = [];
  blocktitle;
  title;
  date;
  blockhash;

  initBlockHash = async () => {
    this.rjdecoded = await ExplorerHttpsReq.httpsreq(
      'getBlockByBlockHash',
      this.props.match.params.blockhash
    );
    this.printresults();
  };

  printresults = async () => {
    this.currentblockhash = this.rjdecoded.block.hash;
    this.numberoftransactions = this.rjdecoded.block.txCount;

    this.date = new Date(this.rjdecoded.block.header.blockTimestamp * 1000);
    this.summarysect1.push(
      <>
        <tr>
          <td>
            <b>Previous Block</b>
          </td>
          <td>
            <Link
              id='previousblock'
              to={'/explorer/blockhash/' + this.rjdecoded.block.header.prevBlock + '/""'}>
              {this.rjdecoded.block.header.prevBlock}
            </Link>
          </td>
        </tr>
        <tr>
          <td>
            <b>Block Version</b>
          </td>
          <td>
            <div id='blockversion'>{this.rjdecoded.block.header.blockVersion}</div>
          </td>
        </tr>
        <tr>
          <td>
            <b>txCount</b>
          </td>
          <td>
            <div id='txcount'>{this.rjdecoded.block.txCount}</div>
          </td>
        </tr>
        <tr>
          <td>
            <b>Nonce</b>
          </td>
          <td>
            <div id='bhnonce'>{this.rjdecoded.block.header.nonce}</div>
          </td>
        </tr>
        <tr>
          <td>
            <b>coinbaseTx</b>
          </td>
          <td>
            <div id='coinbasetx'>{this.rjdecoded.block.coinbaseTx}</div>
          </td>
        </tr>
      </>
    );
    this.summarysect2.push(
      <>
        <tr>
          <td>
            <b>Next Block</b>
          </td>
          <td>
            <Link
              id='nextblock'
              to={'/explorer/blockhash/' + this.rjdecoded.block.nextBlockHash + '/""'}>
              {this.rjdecoded.block.nextBlockHash}
            </Link>
          </td>
        </tr>
        <tr>
          <td>
            <b>Block Bits</b>
          </td>
          <td>
            <div id='blockbits'>{this.rjdecoded.block.header.blockBits}</div>
          </td>
        </tr>
        <tr>
          <td>
            <b>Size</b>
          </td>
          <td>
            <div id='size'>{this.rjdecoded.block.size}</div>
          </td>
        </tr>
        <tr>
          <td>
            <b>Timestamp (UTC)</b>
          </td>
          <td>
            <div id='timestamp'>
              {this.date.getDate()}/{this.date.getMonth() + 1}/{this.date.getFullYear()}-
              {this.date.getHours()}:{this.date.getMinutes()}:{this.date.getSeconds()}
            </div>
          </td>
        </tr>
        <tr>
          <td>
            <b>Merkle Root</b>
          </td>
          <td>
            <div id='merkleroot'>{this.rjdecoded.block.header.merkleRoot}</div>
          </td>
        </tr>
        <tr>
          <td>
            <b>coinbaseMessage</b>
          </td>
          <td>
            <div id='coinbasemessage'>{this.rjdecoded.block.coinbaseMessage}</div>
          </td>
        </tr>
        <tr>
          <td>
            <b>guessedMiner</b>
          </td>
          <td>
            <div id='guessedminer'>{this.rjdecoded.block.guessedMiner}</div>
          </td>
        </tr>
      </>
    );

    this.blocktitle = this.rjdecoded.block.height;
    this.blockhash = this.rjdecoded.block.hash;

    if (this.props.match.params.txid !== undefined && this.props.match.params.txid !== '""') {
      console.log(this.props.match.params.txid);
      this.selected = Math.ceil(
        (parseInt(this.props.match.params.txid, 10) + 1) / this.transactionsperpage
      );
      console.log(this.selected + 'selected back');
      this.currentbatchnum = Math.ceil(this.selected / this.fixedarrlength);
      console.log(this.currentbatchnum + 'this.currentbatchnum back');

      this.numberofpages = Math.ceil(this.numberoftransactions / this.transactionsperpage);

      if (this.numberofpages <= this.pagearrlength) {
        this.numofdisplayedpages = this.numberofpages;
        this.pagearrlength = this.numberofpages;
      } else {
        this.numofdisplayedpages = this.pagearrlength;
      }
      for (var i = 0; i < this.pagearrlength; i++) {
        this.pagearray[i] = i + 1;
      }
      this.batches = Math.ceil(this.numberofpages / this.fixedarrlength);

      this.rjdecoded = await ExplorerHttpsReq.httpsreq(
        'getTXIDByHash',
        this.currentblockhash,
        this.currentbatchnum,
        50
      );
      this.enterednumcaching();
    } else {
      this.currentbatchnum = 1;
      this.rjdecoded = await ExplorerHttpsReq.httpsreq(
        'getTXIDByHash',
        this.currentblockhash,
        this.currentbatchnum,
        50
      );
      this.paginationinitialisation();
    }
  };

  pagebutton = async event => {
    event.preventDefault();
    if (this.state.enteredpagenumber !== '' && this.state.enteredpagenumber <= this.numberofpages) {
      this.setState({
        selectnum: this.state.enteredpagenumber
      });
      this.selected = this.state.enteredpagenumber;
      this.currentbatchnum = Math.ceil(this.selected / this.fixedarrlength);
      if (this.txcache[(this.selected - 1) * this.transactionsperpage + 1] !== undefined) {
        var tempindex, tempind;
        if (this.currentbatchnum === this.batches) {
          if (this.numberofpages % this.fixedarrlength === 0) {
            this.pagearrlength = this.fixedarrlength;
          } else {
            this.pagearrlength = this.numberofpages % this.fixedarrlength;
          }
        } else {
          this.pagearrlength = this.fixedarrlength;
        }
        tempindex = (this.currentbatchnum - 1) * this.fixedarrlength + 1;
        tempind = (tempindex - 1) * this.transactionsperpage;
        for (var b = 0; b < this.pagearrlength; b++) {
          this.pagearray[b] = tempindex;
          tempindex += 1;
        }
        this.printpagination();
        this.transactionprinting();
      } else {
        this.rjdecoded = await ExplorerHttpsReq.httpsreq(
          'getTXIDByHash',
          this.currentblockhash,
          this.currentbatchnum,
          50
        );
        this.enterednumcaching();
      }
    }
  };

  addlistener = event => {
    this.setState({
      selectnum: event.target.value
    });
    this.selected = event.target.value;
    this.printpagination();
    this.transactionprinting();
  };
  leftlistener = async event => {
    if (this.pagearray[0] !== 1) {
      if (this.pagearray[0] === 1) {
      } else {
        this.currentbatchnum = Math.ceil(this.pagearray[0] / this.fixedarrlength);
        this.currentbatchnum -= 1;
        var tindex = this.pagearray[0] - this.fixedarrlength;
        if (this.txcache[(tindex - 1) * this.transactionsperpage + 1] === undefined) {
          this.rjdecoded = await ExplorerHttpsReq.httpsreq(
            'getTXIDByHash',
            this.currentblockhash,
            this.currentbatchnum,
            50
          );
          this.updateleftpaginationarray();
        } else {
          for (var t = 0; t < this.fixedarrlength; t++) {
            this.pagearray[t] = tindex;
            tindex += 1;
          }
        }
        this.printpagination();
      }
    }
  };
  rightlistener = async event => {
    if (this.pagearray[this.pagearrlength - 1] !== this.numberofpages) {
      if (
        this.txcache[this.pagearray[this.pagearray.length - 1] * this.transactionsperpage + 1] ===
        undefined
      ) {
        this.currentbatchnum = Math.ceil(this.pagearray[0] / this.fixedarrlength);
        this.currentbatchnum += 1;
        this.rjdecoded = await ExplorerHttpsReq.httpsreq(
          'getTXIDByHash',
          this.currentblockhash,
          this.currentbatchnum,
          50
        );
        this.updatepaginationarray();
      } else {
        this.currentbatchnum = Math.ceil(this.pagearray[0] / this.fixedarrlength);
        this.currentbatchnum += 1;
        var tindex = 0;
        for (
          var t = this.pagearray[this.fixedarrlength - 1] + 1;
          t <= this.pagearray[this.pagearrlength - 1] + this.pagearrlength;
          t++
        ) {
          if (t <= this.numberofpages) {
            this.pagearray[tindex] = t;
          } else {
            this.pagearray[tindex] = '';
          }
          tindex += 1;
        }
        this.printpagination();
      }
    }
  };

  enterednumcaching = () => {
    var tempindex, tempind;
    if (
      Math.ceil(Object.keys(this.rjdecoded.txids).length / this.transactionsperpage) <
      this.fixedarrlength
    ) {
      this.pagearrlength = Math.ceil(
        Object.keys(this.rjdecoded.txids).length / this.transactionsperpage
      );
    }
    tempindex = (this.currentbatchnum - 1) * this.fixedarrlength + 1;
    tempind = (tempindex - 1) * this.transactionsperpage;
    for (var b = 0; b < this.pagearrlength; b++) {
      this.pagearray[b] = tempindex;
      tempindex += 1;
    }

    for (var w = 0; w < Object.keys(this.rjdecoded.txids).length; w++) {
      this.txcache[tempind] = this.rjdecoded.txids[w];
      tempind += 1;
    }
    this.printpagination();
    this.transactionprinting();
  };

  updateleftpaginationarray = () => {
    var tindex = this.pagearray[0] - this.fixedarrlength;
    var tempind = (tindex - 1) * this.transactionsperpage;
    for (var w = 0; w < Object.keys(this.rjdecoded.txids).length; w++) {
      this.txcache[tempind] = this.rjdecoded.txids[w];
      tempind += 1;
    }
    for (var u = 0; u < this.fixedarrlength; u++) {
      this.pagearray[u] = tindex;
      tindex += 1;
    }
    this.printpagination();
  };

  updatepaginationarray = () => {
    this.txcaching();
    var pagenum = this.pagearray[this.pagearray.length - 1];
    if (this.txfinished === 0) {
      this.currentbatchnum = Math.ceil(this.pagearray[0] / this.fixedarrlength);
      this.currentbatchnum += 1;
      for (var t = 0; t < this.pagearrlength; t++) {
        pagenum += 1;

        if (pagenum <= this.numberofpages) {
          this.pagearray[t] = pagenum;
        } else {
          this.pagearray[t] = '';
        }
      }
    }
    this.printpagination();
  };

  printpagination = () => {
    if (this.currentbatchnum === this.batches) {
      if (this.numberofpages % this.fixedarrlength === 0) {
        this.pagearrlength = this.fixedarrlength;
      } else {
        this.pagearrlength = this.numberofpages % this.fixedarrlength;
      }
    } else {
      this.pagearrlength = this.fixedarrlength;
    }
    this.pagescontainer.length = 0;
    if (this.pagearray[0] !== 1) {
      this.pagescontainer.push(
        <li className='page-item active'>
          <button className='arrows' onClick={this.leftlistener}>
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
    if (this.pagearray[this.pagearrlength - 1] !== this.numberofpages) {
      this.pagescontainer.push(
        <li className='page-item active'>
          <button className='arrows' onClick={this.rightlistener}>
            &gt;
          </button>
        </li>
      );
    }
  };

  transactionprinting = () => {
    this.txsection.length = 0;
    var printbreaker = 1;
    this.txnumber = (this.selected - 1) * this.transactionsperpage;
    for (var k = this.txnumber; k < this.numberoftransactions; k++) {
      this.txsection.push(
        <tr className='txrows'>
          <td>
            ({this.txnumber + printbreaker})-
            <Link to={'/explorer/transaction/' + this.txcache[k]}>{this.txcache[k]}</Link>
          </td>
        </tr>
      );
      if (printbreaker === this.transactionsperpage) {
        break;
      }
      printbreaker += 1;
    }
    if (this.state.selectnum === '') {
      this.setState({
        selectnum: 1
      });
    }
  };

  paginationinitialisation = () => {
    if (Object.keys(this.rjdecoded.txids).length > 0) {
      if (this.numberoftransactions >= this.transactionsperpage) {
        this.numberofpages = Math.ceil(this.numberoftransactions / this.transactionsperpage);
      } else {
        this.numberofpages = 1;
      }

      if (this.numberofpages <= this.pagearrlength) {
        this.numofdisplayedpages = this.numberofpages;
        this.pagearrlength = this.numberofpages;
      } else {
        this.numofdisplayedpages = this.pagearrlength;
      }
      for (var i = 0; i < this.pagearrlength; i++) {
        this.pagearray[i] = i + 1;
      }
      this.batches = Math.ceil(this.numberofpages / this.fixedarrlength);
      this.txcaching();
      this.transactionprinting();
      this.printpagination();
    }
  };

  txcaching = () => {
    if (Object.keys(this.rjdecoded.txids).length > 0) {
      var tempindex;
      if (this.txcache.length === 0) {
        tempindex = 0;
      } else {
        tempindex = this.pagearray[this.pagearray.length - 1] * this.transactionsperpage;
      }
      for (var k = 0; k < Object.keys(this.rjdecoded.txids).length; k++) {
        this.txcache[tempindex] = this.rjdecoded.txids[k];
        tempindex += 1;
      }
      if (
        Math.ceil(Object.keys(this.rjdecoded.txids).length / this.transactionsperpage) <
        this.fixedarrlength
      ) {
        this.pagearrlength = Math.ceil(
          Object.keys(this.rjdecoded.txids).length / this.transactionsperpage
        );
      }
    } else {
      this.txfinished = 1;
    }
  };
  componentDidMount() {
    this.initBlockHash();
  }
  render() {
    return (
      <>
        {
          //   <Link className='btn btn-primary' to={'/explorer/' + this.rjdecoded.block.height}>
          //   Back
          // </Link>
        }
        <div className='row'>
          <div className='col-md-12 col-lg-12'>
            <h4>Block</h4>
            <h5 id='blocktitle'># {this.blocktitle}</h5>
            <div id='blockhash'>Block - {this.blockhash}</div>
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
          <div className='col-md-6 col-lg-6'>
            <table className='tdborderbottom'>{this.summarysect2}</table>
          </div>
        </div>
        <hr />
        <div className='row'>
          <div className='col-md-12 col-lg-12 text-center'>
            <table id='transactionsection'>{this.txsection}</table>
            <br />
          </div>
        </div>
        <div className='row'>
          <div className='col-md-12 col-lg-12 text-center'>
            <nav aria-label='transactions navigation'>
              <ul className='pagination justify-content-center' id='pagination'>
                {this.pagescontainer}
              </ul>
            </nav>
            Enter page number
            <form onSubmit={this.pagebutton}>
              <input
                className='pagenuminput'
                size='5'
                type='text'
                onChange={event =>
                  this.setState({
                    enteredpagenumber: event.target.value
                  })
                }
              />
              <button className='btn btn-primary' type='submit' id='pagebutton'>
                Go
              </button>
            </form>
          </div>
        </div>
      </>
    );
  }
}

const mapStateToProps = state => ({});

export default withRouter(connect(mapStateToProps)(ExplorerBlockHeight));
