import React from 'react';

function Transaction() {
  return (
    <div id="maincontent" className="container nonheader">
      <div className="row">
        <div className="col-md-12 col-lg-12">
          <input
            style={{ marginLeft: '10px', marginRight: '10px' }}
            placeholder="BlockHash / TXID / Address / BlockHeight"
            size={50}
            type="text"
            id="search"
          />
          <input
            className="btn btn-primary"
            type="button"
            id="searchbtn"
            value="Search"
          />
          <div id="searchmsg"></div>
        </div>
      </div>
      <div id="searchnegative">
        <div id="back"></div>
        <div className="row">
          <div className="col-md-12 col-lg-12">
            <h4>Transaction</h4>
            <a id="txid"></a>
            <hr />
          </div>
        </div>
        <div className="row">
          <div className="col-md-12 col-lg-12">
            <h4>Summary</h4>
          </div>
        </div>
        <div className="row">
          <div className="col-md-6 col-lg-6 summaryblock1">
            <table className="tdborderbottom">
              <tr>
                <td>
                  <b>Block</b>
                </td>
                <td>
                  <a id="blocktitle"></a>
                  <br />
                  <a id="blockhash"></a>
                </td>
              </tr>
              <tr>
                <td>
                  <b>Transaction Version</b>
                </td>
                <td>
                  <a id="txversion"></a>
                </td>
              </tr>
              <tr>
                <td>
                  <b>Locktime</b>
                </td>
                <td>
                  <a id="txlocktime"></a>
                </td>
              </tr>
            </table>
          </div>
          <div className="col-md-6 col-lg-6 summaryblock1">
            <table className="tdborderbottom">
              <tr>
                <td>
                  <b>txIndex</b>
                </td>
                <td>
                  <a id="txindex"></a>
                </td>
              </tr>
              <tr>
                <td>
                  <b>Size</b>
                </td>
                <td>
                  <a id="size"></a>
                </td>
              </tr>
              <tr>
                <td>
                  <b>Fees</b>
                </td>
                <td>
                  <a id="fees"></a>
                </td>
              </tr>
            </table>
          </div>
        </div>
        <br />
        <hr />
        <br />
        <div className="row">
          <div className="col-md-12 col-lg-12">
            <h4>MerkleBranch</h4>
            <table id="merklebranchsection"></table>
          </div>
        </div>

        <hr />
        <div className="row">
          <div className="col-md-12 col-lg-12">
            <h5>
              <a id="noofinputs"></a> Inputs, <a id="noofoutputs"></a> Outputs
            </h5>
            <hr />
          </div>
        </div>
        <div className="row">
          <div className="col-md-6 col-lg-6">
            <table id="inputaddress"></table>
          </div>
          <div className="col-md-6 col-lg-6">
            <table id="outputaddress"></table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Transaction;
