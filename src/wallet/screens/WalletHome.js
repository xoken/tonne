import React from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import * as walletActions from "../walletActions";
import * as walletSelectors from "../walletSelectors";
import { satoshiToBSV } from "../../shared/utils";
import bsvlogo from "../../shared/images/bsv.png";
import loadinggif from "../../shared/images/loading.gif";

class WalletHome extends React.Component {
  constructor(props) {
    super(props);
    this.state = { sendTxPopup: false };
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch(walletActions.getCurrentBalance());
  }

  toggleSendTxPopup = () => {
    // const { sendTxPopup } = this.state;
    // this.setState({ sendTxPopup: !sendTxPopup });
    this.props.history.push("/wallet/send");
  };

  onBack = () => {
    this.props.history.goBack();
  };

  groupByTXID = (outputarr, txid) => {
    return outputarr.reduce((finalOutput, currentValue) => {
      if (!finalOutput[currentValue[txid]]) {
        finalOutput[currentValue[txid]] = [];
      }
      finalOutput[currentValue[txid]].push(currentValue);
      return finalOutput;
    }, {});
  };

  sentreceived = spendinfo => {
    if (spendinfo === null) {
      return <div className="greenalert">+</div>;
    } else {
      return <div className="redalert">-</div>;
    }
  };

  renderTransaction() {
    const { outputs } = this.props;
    var tempout = [];
    var temp;
    var outputsGroupedByTXIDobject = this.groupByTXID(outputs, "outputTxHash");
    /*  function sortFunc(a, b) {
      return (
        outputs.indexOf(a["outputTxHash"]) - outputs.indexOf(b["outputTxHash"])
      );
    }
*/
    //  temp.sort(sortFunc);
    console.log(outputs);
    //  console.log(outputsGroupedByTXIDobject);
    //  console.log(temp + "tempobj");
    var ctr = 0;
    Object.entries(outputsGroupedByTXIDobject).forEach(
      ([, outvalue], outindex) => {
        console.log(outindex + "" + outvalue[0].outputTxHash);
        tempout.push(
          <tr>
            <td>{outvalue[0].address}</td>
            <td>
              {this.sentreceived(outvalue[0].spendInfo)}{" "}
              {satoshiToBSV(outvalue[0].value)} BSV
            </td>
            <td>{outvalue[0].outputTxHash}</td>
          </tr>
        );
        if (ctr == 100) {
          return false;
        } else {
          return true;
        }
        ctr++;
      }
    );

    return tempout;

    /*
    return outputs.map(transaction => {
      return (
        <>
          <tr>
            <td>{transaction.outputTxHash}</td>
          </tr>
          <tr>
            <td></td>
          </tr>
        </>
      );
    });
    */
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

  // spendata(i) {
  //   if (this.addressCache[i].spendInfo != null) {
  //     var spinfo = [];
  //     for (
  //       var b = 0;
  //       b < Object.keys(this.addressCache[i].spendInfo.spendData).length;
  //       b++
  //     ) {
  //       spinfo.push(
  //         <tr key={this.addressCache[i].outputTxHash + '' + b}>
  //           <td>
  //             <table className="subtable">
  //               <tr>
  //                 <th>
  //                   <p>
  //                     <b>spendData</b>
  //                   </p>
  //                 </th>
  //               </tr>
  //               <tr>
  //                 <td>
  //                   <b>Value:</b>
  //                   {this.addressCache[i].spendInfo.spendData[b].value}
  //                 </td>
  //                 <td>
  //                   <b>Output Address:</b>{' '}
  //                   <div>
  //                     {
  //                       this.addressCache[i].spendInfo.spendData[b]
  //                         .outputAddress
  //                     }
  //                   </div>
  //                 </td>
  //               </tr>
  //             </table>
  //           </td>
  //         </tr>
  //       );
  //     }
  //     return spinfo;
  //   }
  // }

  // printresults() {
  // this.txlist.length = 0;
  // var printbreaker = 1;
  // var txnumber = (this.selected - 1) * this.outputsperpage;
  // for (var i = txnumber; i < this.addressCache.length; i++) {
  //   this.txlist.push(
  //     <tr key={this.addressCache[i].outputTxHash}>
  //       <td className="txslnum">
  //         #{i + 1} - <div>{this.addressCache[i].outputTxHash}</div> -
  //         outputTxHash
  //         <br />
  //         <table>{this.spendata(i)}</table>
  //       </td>
  //     </tr>
  //   );
  //   if (printbreaker === this.outputsperpage) {
  //     break;
  //   }
  //   printbreaker += 1;
  // }
  // }

  // printpagination() {
  // if (this.currentbatchnum === this.batches) {
  //   if (this.totalpagesavailable % this.fixedpagearrlength === 0) {
  //     this.pagearrlength = this.fixedpagearrlength;
  //   } else {
  //     this.pagearrlength = this.totalpagesavailable % this.fixedpagearrlength;
  //   }
  // } else {
  //   this.pagearrlength = this.fixedpagearrlength;
  // }
  // this.pagescontainer.length = 0;
  // if (this.pagearray[0] !== 1) {
  //   this.pagescontainer.push(
  //     <li key="leftangular" className="page-item active">
  //       <button className="arrows" id="leftarrow">
  //         &#x3008;
  //       </button>
  //     </li>
  //   );
  // }
  // for (var i = 0; i < this.pagearrlength; i++) {
  //   if (this.pagearray[i] === this.selected) {
  //     this.pagescontainer.push(
  //       <li key={this.pagearray[i]} className="page-item active">
  //         <button className="page-link" id={this.pagearray[i]}>
  //           {this.pagearray[i]}
  //         </button>
  //       </li>
  //     );
  //   } else {
  //     this.pagescontainer.push(
  //       <li key={this.pagearray[i]} className="page-item">
  //         <button className="page-link" id={this.pagearray[i]}>
  //           {this.pagearray[i]}
  //         </button>
  //       </li>
  //     );
  //   }
  // }
  // if (
  //   this.pagearray[this.pagearrlength - 1] !== this.totalpagesavailable ||
  //   this.nextcursor != null
  // ) {
  //   this.pagescontainer.push(
  //     <li key="rightangular" className="page-item active">
  //       <button className="arrows" id="rightarrow">
  //         &#x3009;
  //       </button>
  //     </li>
  //   );
  // }
  // this.addlistener();
  // }

  /* addlistener() {
      var clickedpage = document.getElementsByClassName("page-link");
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
    }
  }*/

  render() {
    // const allprops = this.props;
    // if (allprops.allTx !== undefined) {
    //   this.rjdecoded = allprops.allTx;
    //   console.log(allprops.allTx.outputs + 'allprops');
    //   console.log(allprops.currentBalance + 'allprops');
    // }
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
    const { balance } = this.props;
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
                <img src={loadinggif} className="loadinggif" />
                <h4>{satoshiToBSV(balance)} BSV</h4>
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
                <tr>
                  <td>To / From(address)</td>
                  <td>Sent amount/Received amount</td>
                  <td>Transaction ID</td>
                </tr>
                <tbody>{this.renderTransaction()}</tbody>
              </table>
            </div>
          </div>
          {/* <div className="row">
            <div className="col-md-12 col-lg-12">{this.renderPagination()}</div>
            <table id="txlist">{this.txlist}</table>
          </div> */}
          {/* <div className="row">
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
          </div> */}
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
  balance: PropTypes.number.isRequired,
  outputs: PropTypes.arrayOf(PropTypes.object)
};

WalletHome.defaultProps = {
  outputs: []
};

const mapStateToProps = state => ({
  isLoading: walletSelectors.isLoading(state),
  balance: walletSelectors.getBalance(state),
  outputs: walletSelectors.getOutputs(state)
});

export default connect(mapStateToProps)(WalletHome);
