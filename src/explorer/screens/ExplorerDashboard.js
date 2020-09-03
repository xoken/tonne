import React from 'react';
import { Link, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import ExplorerAuth from '../modules/ExplorerAuth';
import ExplorerHttpsReq from '../modules/ExplorerHttpsReq.js';

class ExplorerDashboard extends React.Component {
  constructor(props) {
    super(props);
    this.state = { enteredpagenumber: '', selectnum: '' };
    this.addlistener = this.addlistener.bind(this);
    this.pagebutton = this.pagebutton.bind(this);
  }
  rjdecoded;
  resultsrow = [];
  date;
  blockhei = '';
  heightlist = [];
  size;
  syncedblocksheight;
  numberofpages;
  pagearray;
  index;
  pagearrlength = 9;
  selected = 1;
  pagescontainer = [];
  summarysection = [];

  initDashboard = async () => {
    if (
      this.props.match.params.blockheight !== undefined &&
      !isNaN(this.props.match.params.blockheight)
    ) {
      this.blockhei = this.props.match.params.blockheight;
      console.log(this.blockhei + 'this.blockhei');
    }
    if (localStorage.getItem('username') !== undefined || localStorage.getItem('username') !== '') {
      if (
        localStorage.getItem('callsremaining') !== null ||
        localStorage.getItem('callsremaining') > 3
      ) {
        this.rjdecoded = await ExplorerHttpsReq.httpsreq('getChainInfo');
        this.summary();
      }
    }
  };
  blockheiinit = () => {
    if (this.blockhei !== '') {
      //this.selected = (this.numberofpages - Math.ceil(this.blockhei/10));
      this.selected =
        this.numberofpages - Math.ceil((this.blockhei - (this.syncedblocksheight % 10)) / 10);
      console.log(this.selected);
      if (this.selected <= this.pagearrlength - 2) {
        this.index = 1;
      } else if (this.selected >= this.numberofpages - (this.pagearrlength - 2)) {
        this.index = this.pagearrlength;
      }
    }
  };

  summary = () => {
    this.syncedblocksheight = this.rjdecoded.chainInfo.blocksSynced;
    console.log('summary' + this.syncedblocksheight);
    this.numberofpages = Math.ceil(this.syncedblocksheight / 10);
    this.pagearray = [1, 2, 3, 4, 5, 6, 7, '-', this.numberofpages];
    console.log('summary' + this.pagearray);
    this.summarysection.push(
      <>
        <tr>
          <td>
            <b>Chainwork</b>
            <br />
            {this.rjdecoded.chainInfo.chainwork}
          </td>
          <td>
            <b>Blocks Synced</b>
            <br />
            {this.rjdecoded.chainInfo.blocksSynced}
          </td>
          <td>
            <b>Chain Tip</b>
            <br />
            {this.rjdecoded.chainInfo.chainTip}
          </td>
        </tr>
        <tr>
          <td>
            <b>Chain</b>
            <br />
            {this.rjdecoded.chainInfo.chain}
          </td>
          <td>
            <b>Synced Block Hash</b>
            <br />
            <div className='wordbreak'>{this.rjdecoded.chainInfo.syncedBlockHash}</div>
          </td>
          <td>
            <b>Chain Tip Hash</b>
            <br />
            <div className='wordbreak'>{this.rjdecoded.chainInfo.chainTipHash}</div>
          </td>
        </tr>
      </>
    );
    console.table(this.summarysection);
    this.blockheiinit();
    this.updatepagearray();
    this.updateheightlist();
    this.printpagination();
    //  setTimeout(this.callsec, 1);
    this.callsec();
  };
  callsec = async () => {
    this.rjdecoded = await ExplorerHttpsReq.httpsreq('getBlocksByBlockHeights', this.heightlist);
    this.printresults();
    if (this.state.selectnum == '') {
      this.setState({
        selectnum: 1
      });
    }
  };
  pagebutton = event => {
    event.preventDefault();
    if (this.state.enteredpagenumber !== '' && this.state.enteredpagenumber <= this.numberofpages) {
      this.setState({
        selectnum: this.state.enteredpagenumber
      });
      this.selected = this.state.enteredpagenumber;
      this.updateheightlist();
      this.callsec();
      console.log(this.selected);
      if (this.selected <= this.pagearrlength - 2) {
        this.index = 1;
      } else if (this.selected >= this.numberofpages - (this.pagearrlength - 2)) {
        this.index = this.pagearrlength;
      }
      this.updatepagearray();
    }
  };

  updateheightlist = () => {
    this.heightlist.length = 0;
    var tempheight = this.syncedblocksheight - (this.selected - 1) * 10;
    for (var c = 0; c < 10; c++) {
      this.heightlist[c] = tempheight;
      tempheight -= 1;
    }
  };

  addlistener = event => {
    this.setState({
      selectnum: event.target.value
    });
    this.selected = event.target.value;
    this.updateheightlist();
    this.updatepagearray();
    this.callsec();
  };

  updatepagearray = () => {
    if (this.numberofpages > this.pagearrlength) {
      var b, tempindex;
      if (this.pagearray.indexOf(parseInt(this.selected)) >= 0) {
        this.index = this.pagearray.indexOf(parseInt(this.selected));
      }

      if (
        this.index <= Math.floor(this.pagearrlength / 2) &&
        this.selected <= Math.ceil(this.numberofpages / 3) &&
        this.selected <= this.pagearrlength - 2
      ) {
        this.pagearray[this.pagearrlength - 2] = '-';
        for (b = 0; b < this.pagearrlength - 2; b++) {
          this.pagearray[b] = b + 1;
        }
      } else if (
        this.index >= Math.floor(this.pagearrlength / 2) &&
        this.selected >= Math.ceil((this.numberofpages / 3) * 2) &&
        this.selected >= this.numberofpages - (Math.floor(this.pagearrlength / 3) + 2)
      ) {
        var temppages = this.numberofpages;
        this.pagearray[1] = '-';
        for (b = this.pagearrlength - 1; b >= 2; b--) {
          this.pagearray[b] = temppages--;
        }
      } else {
        tempindex = this.selected - 2;
        this.pagearray[this.pagearrlength - 2] = '-';
        this.pagearray[1] = '-';
        for (b = 2; b < this.pagearrlength - 2; b++) {
          this.pagearray[b] = tempindex++;
        }
      }
    }
    this.printpagination();
  };

  printpagination = () => {
    this.pagescontainer.length = 0;
    for (var i = 0; i < this.pagearrlength; i++) {
      if (this.pagearray[i] === this.selected) {
        this.pagescontainer.push(
          <li key={this.pagearray[i]} className='page-item active'>
            <button className='page-link' onClick={this.addlistener} value={this.pagearray[i]}>
              {this.pagearray[i]}
            </button>
          </li>
        );
      } else if (this.pagearray[i] !== '-') {
        this.pagescontainer.push(
          <li key={this.pagearray[i]} className='page-item'>
            <button className='page-link' onClick={this.addlistener} value={this.pagearray[i]}>
              {this.pagearray[i]}
            </button>
          </li>
        );
      } else {
        this.pagescontainer.push(
          <li key={this.pagearray[i - 1] + '-'} className='page-item disabled'>
            <button className='emptypagelink'>...</button>
          </li>
        );
      }
    }
  };

  printresults = () => {
    this.resultsrow.length = 0;
    this.resultsrow.push(
      <tr className='thborder'>
        <th>Height</th>
        <th>Timestamp (UTC)</th>
        <th>Age</th>
        <th>Block Version</th>
        <th>Transactions</th>
        <th>Size(Bytes)</th>
      </tr>
    );
    this.size = Object.keys(this.rjdecoded.blocks).length;
    var todaysdate, age;
    for (var i = this.size - 1; i >= 0; i--) {
      this.date = new Date(this.rjdecoded.blocks[i].header.blockTimestamp * 1000);
      todaysdate = Date.now() - this.rjdecoded.blocks[i].header.blockTimestamp * 1000;
      age = new Date(todaysdate);
      this.resultsrow.push(
        <tr className='tablerowbottom'>
          <td className='blockheights'>
            <Link to={'/explorer/blockheight/' + this.rjdecoded.blocks[i].height + '/""'}>
              {this.rjdecoded.blocks[i].height}
            </Link>
          </td>
          <td>
            {this.date.getDate()}/{this.date.getMonth() + 1}/{this.date.getFullYear()}
            <br />
            {this.date.getHours()}:{this.date.getMinutes()}:{this.date.getSeconds()}
          </td>
          <td>
            {age.getHours()}:{age.getMinutes()}:{age.getSeconds()}
          </td>
          <td>{this.rjdecoded.blocks[i].header.blockVersion}</td>
          <td>{this.rjdecoded.blocks[i].txCount}</td>
          <td>{this.rjdecoded.blocks[i].size}</td>
        </tr>
      );
    }
  };

  componentDidMount() {
    ExplorerAuth.test();
    this.initDashboard();
  }
  render() {
    return (
      <>
        {
          //  <button className='backspc btn btn-primary' onClick={() => this.props.history.push('/')}>
          //  Back
          //    </button>
        }

        <div className='row'>
          <div className='col-md-12 col-lg-12'>
            <h4>Summary</h4>
          </div>
        </div>
        <div className='row'>
          <div className='col-md-12 col-lg-12'>
            <table border='1'>
              <tbody>{this.summarysection}</tbody>
            </table>
          </div>
        </div>
        <hr />
        <div className='row'>
          <div className='col-lg-12 col-md-12'>
            <h4>Latest Blocks</h4>
          </div>
        </div>
        <div className='row'>
          <div className='col-md-12 col-lg-12'>
            <div className='latestblocks'>
              <table>
                <tbody>{this.resultsrow}</tbody>
              </table>
            </div>
            <br />
          </div>
        </div>
        <div className='row'>
          <div className='col-md-12 col-lg-12 text-center'>
            <nav aria-label='transactions navigation'>
              <ul className='pagination justify-content-center'>{this.pagescontainer}</ul>
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
              <button className='btn btn-primary' type='submit'>
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

export default withRouter(connect(mapStateToProps)(ExplorerDashboard));
