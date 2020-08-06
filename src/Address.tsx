import React from 'react';

function Address() {
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
            <h4>Address</h4>
            <br />
            <a id="address"></a>
            <hr />
          </div>
        </div>

        <div className="row">
          <div className="col-md-12 col-lg-12 summaryblock1">
            <table id="addressummary"></table>
          </div>
        </div>

        <div className="row">
          <div className="col-md-12 col-lg-12">
            <h5>
              <a id="nooftransactions"></a>Transactions
            </h5>
          </div>
        </div>
        <div className="row">
          <div className="col-md-12 col-lg-12">
            <table id="txlist"></table>
          </div>
        </div>
        <div className="row">
          <div className="col-md-12 col-lg-12">
            <nav aria-label="transactions navigation">
              <ul
                className="pagination justify-content-center"
                id="pagination"
              ></ul>
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Address;
