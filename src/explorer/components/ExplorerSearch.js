import React from 'react';

export default class ExplorerSearch extends React.Component {
  render() {
    return (
      <>
        <div class='row'>
          <div class='col-md-12 col-lg-12'>
            <center>
              <input
                style='margin-left: 10px; margin-right: 10px;'
                placeholder='TXID / Address / BlockHeight'
                size='50'
                type='text'
                id='search'
              />
              <input class='btn btn-primary' type='button' id='searchbtn' value='Search' />
              <div id='searchmsg'></div>
            </center>
          </div>
        </div>
      </>
    );
  }
}
