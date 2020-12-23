import React from 'react';
import { Link, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import ExplorerHttpsReq from '../modules/ExplorerHttpsReq.js';
import { Segment, Grid, Button } from 'semantic-ui-react';

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
  transactionsperpage = 20;
  summarysect1 = [];
  summarysect2 = [];
  pagescontainer = [];
  txsection = [];
  blocktitle;
  title;
  date;
  blockhash;
  backheight;

  initBlockHeight = async () => {
    this.currentblockhash = '';
    this.numberoftransactions = 0;
    this.batches = 1;
    this.currentbatchnum = 1;
    this.numberofpages = 0;
    this.pagearray.length = 0;
    this.pagearrlength = 5;
    this.selected = 1;
    this.txcache.length = 0;
    this.numofdisplayedpages = 0;
    this.serverpagenumber = 1;
    this.txfinished = 0;
    this.fixedarrlength = 5;
    this.txnumber = 0;
    this.transactionsperpage = 20;
    this.summarysect1.length = 0;
    this.summarysect2.length = 0;
    this.pagescontainer.length = 0;
    this.txsection.length = 0;
    this.blocktitle = '';
    this.title = '';
    this.blockhash = '';
    this.backheight = '';

    this.rjdecoded = await ExplorerHttpsReq.httpsreq(
      'getBlockByBlockHeight',
      this.props.match.params.blockheight
    );
    if (this.rjdecoded === undefined) {
      this.props.history.push(`/explorer/404`);
    } else {
      this.printresults();
    }
  };

  printresults = async () => {
    this.summarysect1.length = 0;
    this.summarysect2.length = 0;
    this.backheight = this.rjdecoded.block.height;
    this.currentblockhash = this.rjdecoded.block.hash;
    this.numberoftransactions = this.rjdecoded.block.txCount;

    this.date = new Date(this.rjdecoded.block.header.blockTimestamp * 1000);
    this.summarysect1.push(
      <>
        <Grid>
          <Grid.Row columns={2}>
            <Grid.Column width='4'>
              <b>Previous Block</b>
            </Grid.Column>
            <Grid.Column width='12'>
              <Link
                to={'/explorer/blockhash/' + this.rjdecoded.block.header.prevBlock + '/""'}
                id='previousblock'>
                {this.rjdecoded.block.header.prevBlock}
              </Link>
            </Grid.Column>
          </Grid.Row>
          <Grid.Row columns={2}>
            <Grid.Column width='4'>
              <b>Block Version</b>
            </Grid.Column>
            <Grid.Column width='12'>
              <div id='blockversion'>{this.rjdecoded.block.header.blockVersion}</div>
            </Grid.Column>
          </Grid.Row>
          <Grid.Row columns={2}>
            <Grid.Column width='4'>
              <b>Number of Transactions</b>
            </Grid.Column>
            <Grid.Column width='12'>
              <div id='txcount'>{this.rjdecoded.block.txCount}</div>
            </Grid.Column>
          </Grid.Row>
          <Grid.Row columns={2}>
            <Grid.Column width='4'>
              <b>Nonce</b>
            </Grid.Column>
            <Grid.Column width='12'>
              <div id='bhnonce'>{this.rjdecoded.block.header.nonce}</div>
            </Grid.Column>
          </Grid.Row>
          <Grid.Row columns={2}>
            <Grid.Column width='4'>
              <b>Coinbase Transaction</b>
            </Grid.Column>
            <Grid.Column width='12'>
              <div id='coinbasetx'>{this.rjdecoded.block.coinbaseTx}</div>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </>
    );
    this.summarysect2.push(
      <>
        <Grid>
          <Grid.Row columns={2}>
            <Grid.Column width='4'>
              <b>Next Block</b>
            </Grid.Column>
            <Grid.Column width='12'>
              <Link
                to={'/explorer/blockhash/' + this.rjdecoded.block.nextBlockHash + '/""'}
                id='nextblock'>
                {this.rjdecoded.block.nextBlockHash}
              </Link>
            </Grid.Column>
          </Grid.Row>
          <Grid.Row columns={2}>
            <Grid.Column width='4'>
              <b>Block Bits</b>
            </Grid.Column>
            <Grid.Column width='12'>
              <div id='blockbits'>{this.rjdecoded.block.header.blockBits}</div>
            </Grid.Column>
          </Grid.Row>
          <Grid.Row columns={2}>
            <Grid.Column width='4'>
              <b>Size</b>
            </Grid.Column>
            <Grid.Column width='12'>
              <div id='size'>{this.rjdecoded.block.size}</div>
            </Grid.Column>
          </Grid.Row>
          <Grid.Row columns={2}>
            <Grid.Column width='4'>
              <b>Timestamp (UTC)</b>
            </Grid.Column>
            <Grid.Column width='12'>
              <div id='timestamp'>
                {this.date.getDate()}/{this.date.getMonth() + 1}/{this.date.getFullYear()}-
                {this.date.getHours()}:{this.date.getMinutes()}:{this.date.getSeconds()}
              </div>
            </Grid.Column>
          </Grid.Row>
          <Grid.Row columns={2}>
            <Grid.Column width='4'>
              <b>Merkle Root</b>
            </Grid.Column>
            <Grid.Column width='12'>
              <div id='merkleroot'>{this.rjdecoded.block.header.merkleRoot}</div>
            </Grid.Column>
          </Grid.Row>
          <Grid.Row columns={2}>
            <Grid.Column width='4'>
              <b>Coinbase Message</b>
            </Grid.Column>
            <Grid.Column width='12'>
              <div id='coinbasemessage'>{this.rjdecoded.block.coinbaseMessage}</div>
            </Grid.Column>
          </Grid.Row>
          <Grid.Row columns={2}>
            <Grid.Column width='4'>
              <b>Guessed Miner</b>
            </Grid.Column>
            <Grid.Column width='12'>
              <div id='guessedminer'>{this.rjdecoded.block.guessedMiner}</div>
            </Grid.Column>
          </Grid.Row>
        </Grid>
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
        100
      );
      this.enterednumcaching();
    } else {
      this.currentbatchnum = 1;
      this.rjdecoded = await ExplorerHttpsReq.httpsreq(
        'getTXIDByHash',
        this.currentblockhash,
        this.currentbatchnum,
        100
      );
      this.paginationinitialisation();
    }
  };

  pagebutton = async event => {
    event.preventDefault();
    if (
      this.state.enteredpagenumber !== '' &&
      this.state.enteredpagenumber <= this.numberofpages &&
      /^\d+$/.test(this.state.enteredpagenumber)
    ) {
      this.setState({
        selectnum: this.state.enteredpagenumber,
      });
      this.selected = this.state.enteredpagenumber;
      this.currentbatchnum = Math.ceil(this.selected / this.fixedarrlength);
      if (this.txcache[(this.selected - 1) * this.transactionsperpage + 1] !== undefined) {
        var tempindex;
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
          100
        );
        this.enterednumcaching();
      }
    }
  };

  addlistener = event => {
    this.setState({
      selectnum: event.target.value,
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
            100
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
    this.setState({
      selectnum: this.currentbatchnum,
    });
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
          100
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
    this.setState({
      selectnum: this.currentbatchnum,
    });
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
    var tempColor;
    for (var k = this.txnumber; k < this.numberoftransactions; k++) {
      if (!this.txcache[k]) {
        break;
      }
      if (k % 2 === 0) {
        tempColor = 'white';
      } else {
        tempColor = '#eeeded';
      }
      this.txsection.push(
        <Segment.Group className='nosegmentmargin'>
          <Segment style={{ backgroundColor: tempColor }}>
            <Grid columns={1}>
              <Grid.Row>
                <Grid.Column>
                  ({this.txnumber + printbreaker})&nbsp;
                  <Link to={'/explorer/transaction/' + this.txcache[k]}>{this.txcache[k]}</Link>
                </Grid.Column>
              </Grid.Row>
            </Grid>
          </Segment>
        </Segment.Group>
      );
      if (printbreaker === this.transactionsperpage) {
        break;
      }
      printbreaker += 1;
    }
    this.setState({
      selectnum: this.selected,
    });
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
        for (var i = 0; i < this.pagearrlength; i++) {
          this.pagearray[i] = i + 1;
        }
      } else {
        this.numofdisplayedpages = this.pagearrlength;
        for (var j = 0; j < this.pagearrlength; j++) {
          this.pagearray[j] = j + 1;
        }
      }

      this.batches = Math.ceil(this.numberofpages / this.fixedarrlength);
      this.txcaching();
      this.printpagination();
      this.transactionprinting();
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
    this.initBlockHeight();
  }
  componentDidUpdate(latestprops) {
    if (this.props.match.params.blockheight !== latestprops.match.params.blockheight) {
      this.initBlockHeight();
    }
  }
  render() {
    return (
      <>
        <Segment className='noborder'>
          <Link className='ui button explorerbuttoncolor' to={'/explorer/' + this.backheight}>
            Back
          </Link>
        </Segment>
        <div className='opacitywhileload'>
          <Segment.Group>
            <Segment>
              <h4>
                Block #
                <Link to={'/explorer/blockheight/' + this.blocktitle + '/""'}>
                  {this.blocktitle}
                </Link>
              </h4>
              <div>
                <Link to={'/explorer/blockhash/' + this.blockhash + '/""'}>{this.blockhash}</Link>
              </div>
            </Segment>
            <Segment>
              <h4>Summary</h4>
            </Segment>
            <Segment>
              <Segment.Group horizontal>
                <Segment>
                  <Grid columns={2} divided>
                    <Grid.Row>
                      <Grid.Column>{this.summarysect1}</Grid.Column>

                      <Grid.Column>{this.summarysect2}</Grid.Column>
                    </Grid.Row>
                  </Grid>
                  <Grid columns={1}>
                    <Grid.Row>
                      <Grid.Column>{this.txsection}</Grid.Column>
                    </Grid.Row>

                    <Grid.Row>
                      <Grid.Column className='cen'>
                        <nav aria-label='transactions navigation'>
                          <ul className='pagination justify-content-center' id='pagination'>
                            {this.pagescontainer}
                          </ul>
                        </nav>
                        <form onSubmit={this.pagebutton}>
                          <div className='ui form'>
                            <div className='inline fields'>
                              <div className='five wide field'></div>
                              <div className='two wide field'>
                                <h5>Enter page number</h5>
                              </div>
                              <div className='three wide field'>
                                <input
                                  className='pagenuminput'
                                  size='5'
                                  type='text'
                                  onChange={event =>
                                    this.setState({
                                      enteredpagenumber: event.target.value.replace(/\s/g, ''),
                                    })
                                  }
                                />
                              </div>
                              <div className='one wide field'>
                                <Button
                                  className='explorerbuttoncolor'
                                  type='submit'
                                  id='pagebutton'>
                                  Go
                                </Button>
                              </div>
                              <div className='five wide field'></div>
                            </div>
                          </div>
                        </form>
                      </Grid.Column>
                    </Grid.Row>
                  </Grid>
                </Segment>
              </Segment.Group>
            </Segment>
          </Segment.Group>
        </div>
      </>
    );
  }
}

const mapStateToProps = state => ({});

export default withRouter(connect(mapStateToProps)(ExplorerBlockHeight));
