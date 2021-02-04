import React from 'react';
import { Link, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { Segment, Grid, Button, Loader } from 'semantic-ui-react';
import ExplorerHttpsReq from '../modules/ExplorerHttpsReq.js';

class ExplorerDashboard extends React.Component {
  constructor(props) {
    super(props);
    this.state = { selectnum: '', loading: 'true' };
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
    }
    this.rjdecoded = await ExplorerHttpsReq.httpsreq('getChainInfo');
    if (this.rjdecoded !== undefined) {
      this.setState({ loading: false });
      this.summary();
    }
  };

  blockheiinit = () => {
    if (this.blockhei !== '') {
      //this.selected = (this.numberofpages - Math.ceil(this.blockhei/10));
      this.selected =
        this.numberofpages - Math.ceil((this.blockhei - (this.syncedblocksheight % 20)) / 20);
      if (this.selected === 0) {
        this.selected = 1;
      }
      if (this.selected <= this.pagearrlength - 2) {
        this.index = 1;
      } else if (this.selected >= this.numberofpages - (this.pagearrlength - 2)) {
        this.index = this.pagearrlength;
      }
    }
  };

  summary = () => {
    this.syncedblocksheight = this.rjdecoded.chainInfo.blocksSynced;
    this.numberofpages = Math.ceil(this.syncedblocksheight / 20);
    this.pagearray = [1, 2, 3, 4, 5, 6, 7, '-', this.numberofpages];
    this.summarysection.push(
      <>
        <Grid className='dashboardSummaryForMobile'>
          <Grid.Row columns={2}>
            <Grid.Column className='alignLeftOnMobile' computer={4} mobile={5}>
              <b>Chainwork</b>
            </Grid.Column>
            <Grid.Column className='alignLeftOnMobile' computer={12} mobile={11}>
              {this.rjdecoded.chainInfo.chainwork}
            </Grid.Column>
          </Grid.Row>
          <Grid.Row columns={2}>
            <Grid.Column className='alignLeftOnMobile' computer={4} mobile={5}>
              <b>Blocks Synced</b>
            </Grid.Column>
            <Grid.Column className='alignLeftOnMobile' computer={12} mobile={11}>
              <Link to={'/explorer/blockheight/' + this.rjdecoded.chainInfo.blocksSynced}>
                {this.rjdecoded.chainInfo.blocksSynced}
              </Link>
            </Grid.Column>
          </Grid.Row>
          <Grid.Row columns={2}>
            <Grid.Column className='alignLeftOnMobile' computer={4} mobile={5}>
              <b>Chain Tip</b>
            </Grid.Column>
            <Grid.Column className='alignLeftOnMobile' computer={12} mobile={11}>
              <Link to={'/explorer/blockheight/' + this.rjdecoded.chainInfo.chainTip}>
                {this.rjdecoded.chainInfo.chainTip}
              </Link>
            </Grid.Column>
          </Grid.Row>
          <Grid.Row columns={2}>
            <Grid.Column className='alignLeftOnMobile' computer={4} mobile={5}>
              <b>Chain</b>
            </Grid.Column>
            <Grid.Column className='alignLeftOnMobile' computer={12} mobile={11}>
              {this.rjdecoded.chainInfo.chain}
            </Grid.Column>
          </Grid.Row>
          <Grid.Row columns={2}>
            <Grid.Column className='alignLeftOnMobile' computer={4} mobile={5}>
              <b>Synced Block Hash</b>
            </Grid.Column>
            <Grid.Column className='alignLeftOnMobile' computer={12} mobile={11}>
              <Link to={'/explorer/blockhash/' + this.rjdecoded.chainInfo.syncedBlockHash}>
                <div className='wordbreak'>{this.rjdecoded.chainInfo.syncedBlockHash}</div>
              </Link>
            </Grid.Column>
          </Grid.Row>
          <Grid.Row columns={2}>
            <Grid.Column className='alignLeftOnMobile' computer={4} mobile={5}>
              <b>Chain Tip Hash</b>
            </Grid.Column>
            <Grid.Column className='alignLeftOnMobile' computer={12} mobile={11}>
              <Link to={'/explorer/blockhash/' + this.rjdecoded.chainInfo.chainTipHash}>
                <div className='wordbreak'>{this.rjdecoded.chainInfo.chainTipHash}</div>
              </Link>
            </Grid.Column>
          </Grid.Row>
        </Grid>
        <Grid className='dashboardSummaryForOtherScreens'>
          <Grid.Row columns={4}>
            <Grid.Column>
              <b>Chainwork : </b>
              {this.rjdecoded.chainInfo.chainwork}
            </Grid.Column>
            <Grid.Column>
              <b>Blocks Synced : </b>
              <Link to={'/explorer/blockheight/' + this.rjdecoded.chainInfo.blocksSynced}>
                {this.rjdecoded.chainInfo.blocksSynced}
              </Link>
            </Grid.Column>
            <Grid.Column>
              <b>Chain Tip : </b>
              <Link to={'/explorer/blockheight/' + this.rjdecoded.chainInfo.chainTip}>
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
              <Link to={'/explorer/blockhash/' + this.rjdecoded.chainInfo.syncedBlockHash}>
                <div className='wordbreak'>{this.rjdecoded.chainInfo.syncedBlockHash}</div>
              </Link>
            </Grid.Column>
            <Grid.Column>
              <b>Chain Tip Hash</b>
              <Link to={'/explorer/blockhash/' + this.rjdecoded.chainInfo.chainTipHash}>
                <div className='wordbreak'>{this.rjdecoded.chainInfo.chainTipHash}</div>
              </Link>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </>
    );
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
      this.state.selectnum > 0 &&
      /^\d+$/.test(this.state.selectnum)
    ) {
      this.selected = parseInt(this.state.selectnum);
      this.updateheightlist();
      this.callsec();
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
    var tempheight = this.syncedblocksheight - (this.selected - 1) * 20;
    for (var c = 0; c < 20; c++) {
      this.heightlist[c] = tempheight;
      tempheight -= 1;
    }
  };

  addlistener = event => {
    this.selected = parseInt(event.target.value);
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
      <Segment.Group
        horizontal
        className='nosegmentmargin'
        style={{ overflow: 'auto', minWidth: '800px' }}>
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
                <b>Coinbase / Miner</b>
              </Grid.Column>
              <Grid.Column>
                <b>Transactions</b>
              </Grid.Column>
              <Grid.Column>
                <b>Size</b>
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Segment>
      </Segment.Group>
    );
    this.size = Object.keys(this.rjdecoded.blocks).length;
    var timeDifference, age, tempColor, years, days, hours, minutes;
    for (var i = this.size - 1; i >= 0; i--) {
      this.date = new Date(this.rjdecoded.blocks[i].header.blockTimestamp * 1000);
      timeDifference = Date.now() - this.rjdecoded.blocks[i].header.blockTimestamp * 1000;
      timeDifference /= 1000;
      years = Math.floor(timeDifference / (24 * 3600 * 365));
      timeDifference = timeDifference % (24 * 3600 * 365);
      days = Math.floor(timeDifference / (24 * 3600));
      timeDifference = timeDifference % (24 * 3600);
      hours = Math.floor(timeDifference / 3600);
      timeDifference %= 3600;
      minutes = Math.floor(timeDifference / 60);

      if (years > 0) {
        age = `${years} ${years > 1 ? 'years' : 'year'}, ${days} ${days > 1 ? 'days' : 'day'}, ${
          hours > 9 ? hours : '0' + hours
        }:${minutes > 9 ? minutes : '0' + minutes}`;
      } else if (days > 0) {
        age = `${days} ${days > 1 ? 'days' : 'day'}, ${hours > 9 ? hours : '0' + hours}:${
          minutes > 9 ? minutes : '0' + minutes
        }`;
      } else {
        age = `${hours > 9 ? hours : '0' + hours}:${minutes > 9 ? minutes : '0' + minutes}`;
      }
      let kb = 1024,
        mb = kb * kb,
        gb = mb * kb;
      let size = 0;
      if (this.rjdecoded.blocks[i].size < kb) {
        size = this.rjdecoded.blocks[i].size + ' Bytes';
      } else if (this.rjdecoded.blocks[i].size < mb) {
        size = (this.rjdecoded.blocks[i].size / kb).toFixed(2) + ' KB';
      } else if (this.rjdecoded.blocks[i].size < gb) {
        size = (this.rjdecoded.blocks[i].size / mb).toFixed(2) + ' MB';
      } else {
        size = this.rjdecoded.blocks[i].size / gb.toFixed(2) + ' GB';
      }
      console.log(this.rjdecoded.blocks[i]);
      if (i % 2 === 0) {
        tempColor = 'white';
      } else {
        tempColor = '#FAFAFA';
      }
      this.resultsrow.push(
        <Segment.Group
          horizontal
          className='nosegmentmargin removesegmentborder'
          style={{ overflow: 'auto', minWidth: '800px' }}>
          <Segment className='cen removesegmentborder'>
            <Grid columns={6} verticalAlign='middle'>
              <Grid.Row style={{ backgroundColor: tempColor }}>
                <Grid.Column>
                  <Link to={'/explorer/blockheight/' + this.rjdecoded.blocks[i].height}>
                    {this.rjdecoded.blocks[i].height}
                  </Link>
                </Grid.Column>
                <Grid.Column>
                  {this.date.getDate()}/{this.date.getMonth() + 1}/{this.date.getFullYear()}
                  <br />
                  {this.date.getHours()}:{this.date.getMinutes()}:{this.date.getSeconds()}
                </Grid.Column>
                <Grid.Column className='word-wrap'>{age}</Grid.Column>
                <Grid.Column style={{ wordBreak: 'break-all' }}>
                  {this.rjdecoded.blocks[i].coinbaseMessage.replace(/[^\x20-\x7E]+/g, '')}
                </Grid.Column>
                <Grid.Column>{this.rjdecoded.blocks[i].txCount} </Grid.Column>
                <Grid.Column>{size} </Grid.Column>
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
  }

  render() {
    const { loading } = this.state;
    return (
      <>
        {
          //  <button className='backspc btn btn-primary' onClick={() => this.props.history.push('/')}>
          //  Back
          //    </button>
        }
        {loading ? (
          <Loader active />
        ) : (
          <div className='opacitywhileload' style={{ minWidth: '100%' }}>
            <Segment className='removesegmentborder nosegmentmargin removepaddingbottom'>
              <h4 className='purplefontcolor'>Summary</h4>
            </Segment>
            <Segment className='cen' style={{ overflow: 'auto' }}>
              <div>{this.summarysection}</div>
            </Segment>
            <Segment className='removesegmentborder'>
              <h4 className='purplefontcolor'>Latest Blocks</h4>
            </Segment>

            <div className='latestblocks'>{this.resultsrow}</div>
            <br />

            <center style={{ overflow: 'auto' }}>
              <ul className='pagination justify-content-center'>{this.pagescontainer}</ul>
            </center>

            <form onSubmit={this.pagebutton}>
              <div className='ui form'>
                <div className='inline fields'>
                  <div className='five wide field'></div>
                  <div className='two wide field'>
                    <h5>Enter page number</h5>
                  </div>
                  <div className='three wide field'>
                    <input
                      className='pagenuminput searchBoxAndButtons'
                      size='5'
                      type='text'
                      onChange={event =>
                        this.setState({
                          selectnum: event.target.value.replace(/\s/g, ''),
                        })
                      }
                    />
                  </div>
                  <div className='one wide field'>
                    <Button type='submit' className='explorerbuttoncolor coral searchBoxAndButtons'>
                      Go
                    </Button>
                  </div>
                  <div className='five wide field'></div>
                </div>
              </div>
            </form>
          </div>
        )}
      </>
    );
  }
}

const mapStateToProps = state => ({});

export default withRouter(connect(mapStateToProps)(ExplorerDashboard));
