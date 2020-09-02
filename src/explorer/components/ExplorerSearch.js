import React from 'react';

export default class ExplorerSearch extends React.Component {
  render() {
    return (
      <>
        <div className='row'>
          <div className='col-md-12 col-lg-12'>
            <center>
              <input
                className='pagenuminput'
                placeholder='TXID / Address / BlockHeight'
                size='50'
                type='text'
                id='search'
              />
              <input className='btn btn-primary' type='button' id='searchbtn' value='Search' />
              <div id='searchmsg'></div>
            </center>
          </div>
        </div>
      </>
    );
  }
}
