import React from 'react';

function Mnemonic() {
  return (
    <div className="container nonheader">
      <div className="row">
        <div className="col-lg-12 col-md-12 col-sm-12">
          <div id="mnemonic"></div>
          <div id="wordsremaining">(0 of 12)</div>
        </div>
      </div>
      <div className="row">
        <div className="col-lg-12 col-md-12 col-sm-12">
          <br />
          <a className="btn btn-primary" id="backspc">
            &#9003;
          </a>
          <br />
          <br />
          <ul id="alphabets"></ul>
        </div>
      </div>

      <div className="row">
        <div className="col-lg-12 col-md-12 col-sm-12">
          <ul id="suggestions"></ul>
        </div>
      </div>
    </div>
  );
}

export default Mnemonic;
