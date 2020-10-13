import React from 'react';
import { Link, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { Segment, Grid } from 'semantic-ui-react';
import ExplorerHttpsReq from '../modules/ExplorerHttpsReq.js';

class ExplorerDashboard extends React.Component {
  constructor(props) {
    super(props);
    this.state = { selectnum: '' };
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
    this.rjdecoded = await ExplorerHttpsReq.httpsreq('getChainInfo');
    if (this.rjdecoded !== undefined) {
      this.summary();
    }
  };

  blockheiinit = () => {
    if (this.blockhei !== '') {
      //this.selected = (this.numberofpages - Math.ceil(this.blockhei/10));
      this.selected =
        this.numberofpages - Math.ceil((this.blockhei - (this.syncedblocksheight % 10)) / 10);
      if (this.selected === 0) {
        this.selected = 1;
      }
      console.log(this.selected + 'this.selected');
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
        <Grid>
          <Grid.Row columns={4}>
            <Grid.Column>
              <b>Chainwork : </b>
              {this.rjdecoded.chainInfo.chainwork}
            </Grid.Column>
            <Grid.Column>
              <b>Blocks Synced : </b>
              <Link to={'/explorer/blockheight/' + this.rjdecoded.chainInfo.blocksSynced + '/""'}>
                {this.rjdecoded.chainInfo.blocksSynced}
              </Link>
            </Grid.Column>
            <Grid.Column>
              <b>Chain Tip : </b>
              <Link to={'/explorer/blockheight/' + this.rjdecoded.chainInfo.chainTip + '/""'}>
                {this.rjdecoded.chainInfo.chainTip}
              </Link>
            </Grid.Column>
            <Grid.Column>
              <b>Chain : </b>
              {this.rjdecoded.chainInfo.chain}
            </Grid.Column>
          </Grid.Row>
          <Grid.Row columns={2}>
            <Grid.Column>
              <b>Synced Block Hash</b>
              <Link to={'/explorer/blockhash/' + this.rjdecoded.chainInfo.syncedBlockHash + '/""'}>
                <div className='wordbreak'>{this.rjdecoded.chainInfo.syncedBlockHash}</div>
              </Link>
            </Grid.Column>
            <Grid.Column>
              <b>Chain Tip Hash</b>
              <Link to={'/explorer/blockhash/' + this.rjdecoded.chainInfo.chainTipHash + '/""'}>
                <div className='wordbreak'>{this.rjdecoded.chainInfo.chainTipHash}</div>
              </Link>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </>
    );
    console.table(this.summarysection);
    this.blockheiinit();
    this.updatepagearray();
    this.updateheightlist();
    this.printpagination();
    this.callsec();
  };

  callsec = async () => {
    this.rjdecoded = await ExplorerHttpsReq.httpsreq('getBlocksByBlockHeights', this.heightlist);
    this.printresults();
    if (this.state.selectnum === '') {
      this.setState({
        selectnum: 1,
      });
    }
  };

  pagebutton = event => {
    event.preventDefault();
    if (
      this.state.selectnum !== '' &&
      this.state.selectnum <= this.numberofpages &&
      this.state.selectnum > 0
    ) {
      this.selected = this.state.selectnum;
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
      <Segment.Group horizontal className='nosegmentmargin'>
        <Segment className='cen'>
          <Grid columns={6}>
            <Grid.Row>
              <Grid.Column>
                <b>Height</b>
              </Grid.Column>
              <Grid.Column>
                <b>Timestamp (UTC)</b>
              </Grid.Column>
              <Grid.Column>
                <b>Age</b>
              </Grid.Column>
              <Grid.Column>
                <b>Block Version</b>
              </Grid.Column>
              <Grid.Column>
                <b>Transactions</b>
              </Grid.Column>
              <Grid.Column>
                <b>Size(Bytes)</b>
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Segment>
      </Segment.Group>
    );
    this.size = Object.keys(this.rjdecoded.blocks).length;
    var todaysdate, age, tempColor;
    for (var i = this.size - 1; i >= 0; i--) {
      this.date = new Date(this.rjdecoded.blocks[i].header.blockTimestamp * 1000);
      todaysdate = Date.now() - this.rjdecoded.blocks[i].header.blockTimestamp * 1000;
      age = new Date(todaysdate);
      if (i % 2 === 0) {
        tempColor = 'white';
      } else {
        tempColor = 'lightgrey';
      }
      this.resultsrow.push(
        <Segment.Group horizontal className='nosegmentmargin'>
          <Segment className='cen'>
            <Grid columns={6}>
              <Grid.Row style={{ backgroundColor: tempColor }}>
                <Grid.Column>
                  <Link to={'/explorer/blockheight/' + this.rjdecoded.blocks[i].height + '/""'}>
                    {this.rjdecoded.blocks[i].height}
                  </Link>
                </Grid.Column>
                <Grid.Column>
                  {this.date.getDate()}/{this.date.getMonth() + 1}/{this.date.getFullYear()}
                  <br />
                  {this.date.getHours()}:{this.date.getMinutes()}:{this.date.getSeconds()}
                </Grid.Column>
                <Grid.Column>
                  {age.getHours()}:{age.getMinutes()}:{age.getSeconds()}
                </Grid.Column>
                <Grid.Column>{this.rjdecoded.blocks[i].header.blockVersion} </Grid.Column>
                <Grid.Column>{this.rjdecoded.blocks[i].txCount} </Grid.Column>
                <Grid.Column>{this.rjdecoded.blocks[i].size} </Grid.Column>
              </Grid.Row>
            </Grid>
          </Segment>
        </Segment.Group>
      );
    }
    this.setState({
      selectnum: this.selected,
    });
  };

  componentDidMount() {
    this.initDashboard();
    var blockListArray = document.getElementsByClassName('');
  }
  render() {
    return (
      <>
        {
          //  <button className='backspc btn btn-primary' onClick={() => this.props.history.push('/')}>
          //  Back
          //    </button>
        }
        <div className='opacitywhileload'>
          <Segment.Group>
            <Segment>
              <h4>Summary</h4>
            </Segment>
            <Segment className='cen'>{this.summarysection}</Segment>
            <Segment>
              <h4>Latest Blocks</h4>
            </Segment>
            <Segment>
              <div className='latestblocks'>{this.resultsrow}</div>
              <br />
            </Segment>
            <Segment>
              <nav aria-label='transactions navigation'>
                <ul className='pagination justify-content-center'>{this.pagescontainer}</ul>
              </nav>
              <center>Enter page number</center>
              <form onSubmit={this.pagebutton}>
                <div className='ui form'>
                  <div className='inline fields'>
                    <div className='six wide field'></div>
                    <div className='three wide field'>
                      <input
                        className='pagenuminput'
                        size='5'
                        type='text'
                        onChange={event =>
                          this.setState({
                            selectnum: event.target.value,
                          })
                        }
                      />
                    </div>
                    <div className='one wide field'>
                      <button className='btn btn-primary' type='submit'>
                        Go
                      </button>
                    </div>
                    <div className='six wide field'></div>
                  </div>
                </div>
              </form>
            </Segment>
          </Segment.Group>
        </div>
      </>
    );
  }
}

const mapStateToProps = state => ({});

export default withRouter(connect(mapStateToProps)(ExplorerDashboard));
