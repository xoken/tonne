import React from 'react';

function BlockHeight() {
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
            <h4>Block</h4>
            <h5 id="blocktitle"></h5>
            <a id="blockhash"></a>
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
                  <b>Previous Block</b>
                </td>
                <td>
                  <a id="previousblock"></a>
                </td>
              </tr>
              <tr>
                <td>
                  <b>Block Version</b>
                </td>
                <td>
                  <a id="blockversion"></a>
                </td>
              </tr>
              <tr>
                <td>
                  <b>txCount</b>
                </td>
                <td>
                  <a id="txcount"></a>
                </td>
              </tr>
              <tr>
                <td>
                  <b>Nonce</b>
                </td>
                <td>
                  <a id="bhnonce"></a>
                </td>
              </tr>
              <tr>
                <td>
                  <b>coinbaseTx</b>
                </td>
                <td>
                  <a id="coinbasetx"></a>
                </td>
              </tr>
            </table>
          </div>
          <div className="col-md-6 col-lg-6">
            <table className="tdborderbottom">
              <tr>
                <td>
                  <b>Next Block</b>
                </td>
                <td>
                  <a id="nextblock"></a>
                </td>
              </tr>
              <tr>
                <td>
                  <b>Block Bits</b>
                </td>
                <td>
                  <a id="blockbits"></a>
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
                  <b>Timestamp (UTC)</b>
                </td>
                <td>
                  <a id="timestamp"></a>
                </td>
              </tr>
              <tr>
                <td>
                  <b>Merkle Root</b>
                </td>
                <td>
                  <a id="merkleroot"></a>
                </td>
              </tr>
              <tr>
                <td>
                  <b>coinbaseMessage</b>
                </td>
                <td>
                  <a id="coinbasemessage"></a>
                </td>
              </tr>
              <tr>
                <td>
                  <b>guessedMiner</b>
                </td>
                <td>
                  <a id="guessedminer"></a>
                </td>
              </tr>
            </table>
          </div>
        </div>
        <hr />
        <div className="row">
          <div className="col-md-12 col-lg-12 text-center">
            <div id="refreshpage"></div>
            <table id="transactionsection"></table>
            <br />
          </div>
        </div>
        <div className="row">
          <div className="col-md-12 col-lg-12 text-center">
            <nav aria-label="transactions navigation">
              <ul
                className="pagination justify-content-center"
                id="pagination"
              ></ul>
            </nav>
            Enter page number
            <input
              style={{ marginLeft: '10px', marginRight: '10px' }}
              size={5}
              type="text"
              id="enteredpagenumber"
            />
            <input
              className="btn btn-primary"
              type="button"
              id="pagebutton"
              value="Go"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default BlockHeight;
