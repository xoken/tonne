import React from 'react';
import ExplorerSearch from '../components/ExplorerSearch';

export default class ExplorerAddress extends React.Component {
  render() {
    return (
      <>
        <ExplorerSearch />
        <div class='row'>
          <div class='col-md-12 col-lg-12'>
            <h4>Address</h4>
            <br />
            <a id='address'></a>
            <hr />
          </div>
        </div>

        <div class='row'>
          <div class='col-md-12 col-lg-12 summaryblock1'>
            <table id='addressummary'></table>
          </div>
        </div>

        <div class='row'>
          <div class='col-md-12 col-lg-12'>
            <h5>
              <a id='nooftransactions'></a>Transactions
            </h5>
          </div>
        </div>
        <div class='row'>
          <div class='col-md-12 col-lg-12'>
            <table id='txlist'></table>
          </div>
        </div>
        <div class='row'>
          <div class='col-md-12 col-lg-12'>
            <nav aria-label='transactions navigation'>
              <ul class='pagination justify-content-center' id='pagination'></ul>
            </nav>
          </div>
        </div>
      </>
    );
  }
}
