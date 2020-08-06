import React from 'react';

function Wallet() {
  return (
    <>
      <div id="pop">
        <div className="container">
          <span className="closepop">X</span>
          <div id="popupcontent"></div>
        </div>
      </div>
      <div className="container nonheader">
        <div className="row">
          <div className="col-lg-12 col-md-12 col-sm-12 border-left-right">
            <div id="cryptologo"></div>
            <span className="txbtn" id="sendcur">
              Send
            </span>
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
    </>
  );
}

export default Wallet;
