import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import * as walletActions from '../walletActions';
import * as walletSelectors from '../walletSelectors';
import { satoshiToBSV } from '../../shared/utils';
import bsvlogo from '../../shared/images/bsv.png';

class WalletHome extends React.Component {
  constructor(props) {
    super(props);
    this.state = { sendTxPopup: false };
  }

  componentDidMount() {
    const { dispatch } = this.props;
    // dispatch(walletActions.getOutputs());
    dispatch(walletActions.getCurrentBalance());
    dispatch(walletActions.getAllTx());
  }

  toggleSendTxPopup = () => {
    // const { sendTxPopup } = this.state;
    // this.setState({ sendTxPopup: !sendTxPopup });
    this.props.history.push('/wallet/send');
  };

  onBack = () => {
    this.props.history.goBack();
  };

  renderTransaction() {
    const { outputs } = this.props;
    return outputs.map((transaction) => {
      return (
        <tr>
          <td></td>
          <td></td>
        </tr>
      );
    });
  }

  renderPagination() {
    return (
      <nav aria-label="transactions navigation">
        <ul className="pagination justify-content-center" id="pagination"></ul>
      </nav>
    );
  }

  // render() {
  //   const { currBal } = this.props;
  // addressCache = [];
  // cachecounter = 0;
  // outputsperpage = 20;
  // pagearray = [];
  // fixedpagearrlength = 5;
  // pagearrlength = 5;
  // selected = 1;
  // batches;
  // totalpagesavailable;
  // currentbatchnum = 1;
  // nextcursor = "";
  // txlist = [];
  // rjdecoded;
  // pagescontainer = [];

  spendata(i) {
    if (this.addressCache[i].spendInfo != null) {
      var spinfo = [];
      for (
        var b = 0;
        b < Object.keys(this.addressCache[i].spendInfo.spendData).length;
        b++
      ) {
        spinfo.push(
          <tr key={this.addressCache[i].outputTxHash + '' + b}>
            <td>
              <table className="subtable">
                <tr>
                  <th>
                    <p>
                      <b>spendData</b>
                    </p>
                  </th>
                </tr>
                <tr>
                  <td>
                    <b>Value:</b>
                    {this.addressCache[i].spendInfo.spendData[b].value}
                  </td>
                  <td>
                    <b>Output Address:</b>{' '}
                    <div>
                      {
                        this.addressCache[i].spendInfo.spendData[b]
                          .outputAddress
                      }
                    </div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        );
      }
      return spinfo;
    }
  }

  printresults() {
    this.txlist.length = 0;
    var printbreaker = 1;
    var txnumber = (this.selected - 1) * this.outputsperpage;
    for (var i = txnumber; i < this.addressCache.length; i++) {
      this.txlist.push(
        <tr key={this.addressCache[i].outputTxHash}>
          <td className="txslnum">
            #{i + 1} - <div>{this.addressCache[i].outputTxHash}</div> -
            outputTxHash
            <br />
            <table>{this.spendata(i)}</table>
          </td>
        </tr>
      );

      if (printbreaker === this.outputsperpage) {
        break;
      }

      printbreaker += 1;
    }
  }

  printpagination() {
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
        <li key="leftangular" className="page-item active">
          <button className="arrows" id="leftarrow">
            &#x3008;
          </button>
        </li>
      );
    }
    for (var i = 0; i < this.pagearrlength; i++) {
      if (this.pagearray[i] === this.selected) {
        this.pagescontainer.push(
          <li key={this.pagearray[i]} className="page-item active">
            <button className="page-link" id={this.pagearray[i]}>
              {this.pagearray[i]}
            </button>
          </li>
        );
      } else {
        this.pagescontainer.push(
          <li key={this.pagearray[i]} className="page-item">
            <button className="page-link" id={this.pagearray[i]}>
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
        <li key="rightangular" className="page-item active">
          <button className="arrows" id="rightarrow">
            &#x3009;
          </button>
        </li>
      );
    }
    this.addlistener();
  }

  addlistener() {
    /*  var clickedpage = document.getElementsByClassName("page-link");
    for (var a = 0; a < clickedpage.length; a++) {
      clickedpage[a].addEventListener("click", function () {
        this.selected = this.id;
        this.printpagination();
        this.printresults();
      });
    }
    if (this.pagearray[0] != 1) {
      document
        .getElementById("leftarrow")
        .addEventListener("click", function () {
          currentbatchnum = Math.ceil(pagearray[0] / totalpagesavailable);
          currentbatchnum -= 1;
          var ltindex = pagearray[0] - fixedpagearrlength;

          for (var t = 0; t < fixedpagearrlength; t++) {
            pagearray[t] = ltindex;
            console.log(pagearray[t] + "pagearray[t]");
            ltindex += 1;
          }

          printpagination();
        });
    }
    if (
      pagearray[pagearray.length - 1] != totalpagesavailable ||
      nextcursor != null
    ) {
      document
        .getElementById("rightarrow")
        .addEventListener("click", function () {
          console.log("right arrow clicked");
          //  console.log(pagearray[pagearray.length-1]+"pagearray[pagearray.length-1]");
          console.log(totalpagesavailable + "totalpagesavailable");
          currentbatchnum = Math.ceil(pagearray[0] / fixedpagearrlength);
          if (
            pagearray[pagearray.length - 1] == totalpagesavailable &&
            nextcursor != null
          ) {
            httpsreq(
              "adddataupdatepagearray",
              "getOutputsByAddress",
              100,
              nextcursor
            );
          } else {
            console.log("elseblock");
            currentbatchnum += 1;
            var tindex = pagearray[pagearray.length - 1];

            if (
              pagearray[pagearray.length - 1] + fixedpagearrlength >
              totalpagesavailable
            ) {
              pagearrlength = totalpagesavailable % fixedpagearrlength;
            } else {
              pagearrlength = fixedpagearrlength;
            }
            for (var t = 0; t < pagearrlength; t++) {
              tindex += 1;
              pagearray[t] = tindex;
              console.log(pagearray[t] + "pagearray[t]");
            }
            printpagination();
          }
        });
    }*/
  }

  render() {
    const allprops = this.props;
    if (allprops.allTx !== undefined) {
      this.rjdecoded = allprops.allTx;
      console.log(allprops.allTx.outputs + 'allprops');
      console.log(allprops.currentBalance + 'allprops');
    }
    // let pop;
    // const sendCurPopOpen = this.state.sendCurPopOpen;
    // if (sendCurPopOpen) {
    //   pop = (
    //     <Popopen
    //       class="pop popopen"
    //       closefunction={this.handleSendCurCloseClick.bind(this)}
    //     />
    //   );
    // } else {
    //   pop = <Popclose />;
    // }
    return (
      <>
        <div className="container nonheader">
          <div className="row">
            <div className="col-lg-12 col-md-12 col-sm-12 border-left-right">
              <center>
                <div className="cryptologo">
                  <img src={bsvlogo} alt="" />
                </div>
                <h5>Your Current Balance is</h5>
                <h4>{satoshiToBSV(currBal)} BSV</h4>
                <div className="txbtn" onClick={this.toggleSendTxPopup}>
                  Send
                </div>
              </center>
            </div>
          </div>
          <div className="row">
            <div className="col-md-12 col-lg-12">
              <h3>Recent Transactions</h3>
              <table id="txlist" className="table">
                <thead>
                  <tr>
                    <th scope="col">To / From (Address)</th>
                    <th scope="col">Sent Amount / Received Amount</th>
                    <th scope="col">Transaction ID</th>
                  </tr>
                </thead>
                <tbody>{this.renderTransaction()}</tbody>
              </table>
            </div>
          </div>
          <div className="row">
            <div className="col-md-12 col-lg-12">{this.renderPagination()}</div>
            <table id="txlist">{this.txlist}</table>
          </div>
          <div className="row">
            <div className="col-md-12 col-lg-12">
              <nav aria-label="transactions navigation">
                <ul
                  className="pagination justify-content-center"
                  id="pagination"
                >
                  {this.pagescontainer}
                </ul>
              </nav>
            </div>
          </div>
          <button
            type="button"
            className="btn btn-primary"
            onClick={this.onBack}
          >
            Back
          </button>
        </div>
      </>
    );
  }
}

WalletHome.propTypes = {
  dispatch: PropTypes.func.isRequired,
  isLoading: PropTypes.bool.isRequired,
  currBal: PropTypes.number.isRequired,
  outputs: PropTypes.arrayOf(
    PropTypes.shape({
      date: PropTypes.string.isRequired,
      amount: PropTypes.number.isRequired,
    })
  ),
};

WalletHome.defaultProps = {
  outputs: [],
};

const mapStateToProps = (state) => ({
  isLoading: walletSelectors.isLoading(state),
  currBal: walletSelectors.getCurrentBalance(state),
  outputs: walletSelectors.getOutputs(state),
});

export default connect(mapStateToProps)(WalletHome);
