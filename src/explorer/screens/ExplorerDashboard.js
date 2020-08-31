import React from 'react';
import ExplorerSearch from '../components/ExplorerSearch';

export default class ExplorerDashboard extends React.Component {
  render() {
    return (
      <>
        <ExplorerSearch />
        <div className='row'>
          <div className='col-md-12 col-lg-12'>
            <h4>Summary</h4>
          </div>
        </div>
        <div className='row'>
          <div className='col-md-12 col-lg-12'>
            <table id='summarysection' border='1'></table>
          </div>
        </div>
        <hr />
        <div className='row'>
          <div className='col-lg-12 col-md-12'>
            <h4>Latest Blocks</h4>
          </div>
        </div>
        <div className='row'>
          <div className='col-md-12 col-lg-12'>
            <div className='latestblocks'>
              <table id='rowstoinsert'></table>
            </div>
            <br />
          </div>
        </div>
        <div className='row'>
          <div className='col-md-12 col-lg-12 text-center'>
            <nav aria-label='transactions navigation'>
              <ul className='pagination justify-content-center' id='pagination'></ul>
            </nav>
            Enter page number
            <input className='pagenuminput' size='5' type='text' id='enteredpagenumber' />
            <input className='btn btn-primary' type='button' id='pagebutton' value='Go' />
          </div>
        </div>
      </>
    );
  }
}
