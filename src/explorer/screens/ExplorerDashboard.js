import React from 'react';
import ExplorerSearch from '../components/ExplorerSearch';

export default class ExplorerDashboard extends React.Component {
  render() {
    return (
      <>
        <ExplorerSearch />
        <div class='row'>
          <div class='col-md-12 col-lg-12'>
            <h4>Summary</h4>
          </div>
        </div>
        <div class='row'>
          <div class='col-md-12 col-lg-12'>
            <table id='summarysection' border='1'></table>
          </div>
        </div>
        <hr />
        <div class='row'>
          <div class='col-lg-12 col-md-12'>
            <h4>Latest Blocks</h4>
          </div>
        </div>
        <div class='row'>
          <div class='col-md-12 col-lg-12'>
            <div class='latestblocks'>
              <table id='rowstoinsert'></table>
            </div>
            <br />
          </div>
        </div>
        <div class='row'>
          <div class='col-md-12 col-lg-12 text-center'>
            <nav aria-label='transactions navigation'>
              <ul class='pagination justify-content-center' id='pagination'></ul>
            </nav>
            Enter page number
            <input
              style='margin-left: 10px; margin-right: 10px;'
              size='5'
              type='text'
              id='enteredpagenumber'
            />
            <input class='btn btn-primary' type='button' id='pagebutton' value='Go' />
          </div>
        </div>
      </>
    );
  }
}
