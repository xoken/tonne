import React from 'react';
import ExplorerSearch from '../components/ExplorerSearch';

export default class ExplorerTransaction extends React.Component {
  render() {
    return (
      <>
        <ExplorerSearch />
        <div class='row'>
          <div class='col-md-12 col-lg-12'>
            <h4>Transaction</h4>
            <a id='txid'></a>
            <hr />
          </div>
        </div>
        <div class='row'>
          <div class='col-md-12 col-lg-12'>
            <h4>Summary</h4>
          </div>
        </div>
        <div class='row'>
          <div class='col-md-6 col-lg-6 summaryblock1'>
            <table class='tdborderbottom'>
              <tr>
                <td>
                  <b>Block</b>
                </td>
                <td>
                  <a id='blocktitle'></a>
                  <br />
                  <a id='blockhash'></a>
                </td>
              </tr>
              <tr>
                <td>
                  <b>Transaction Version</b>
                </td>
                <td>
                  <a id='txversion'></a>
                </td>
              </tr>
              <tr>
                <td>
                  <b>Locktime</b>
                </td>
                <td>
                  <a id='txlocktime'></a>
                </td>
              </tr>
            </table>
          </div>
          <div class='col-md-6 col-lg-6 summaryblock1'>
            <table class='tdborderbottom'>
              <tr>
                <td>
                  <b>txIndex</b>
                </td>
                <td>
                  <a id='txindex'></a>
                </td>
              </tr>
              <tr>
                <td>
                  <b>Size</b>
                </td>
                <td>
                  <a id='size'></a>
                </td>
              </tr>
              <tr>
                <td>
                  <b>Fees</b>
                </td>
                <td>
                  <a id='fees'></a>
                </td>
              </tr>
            </table>
          </div>
        </div>
        <br />
        <hr />
        <br />
        <div class='row'>
          <div class='col-md-12 col-lg-12'>
            <center>
              <h4>MerkleBranch</h4>
            </center>
            <table id='merklebranchsection'></table>
          </div>
        </div>

        <hr />
        <div class='row'>
          <div class='col-md-12 col-lg-12'>
            <h5>
              <a id='noofinputs'></a> Inputs, <a id='noofoutputs'></a> Outputs
            </h5>
            <hr />
          </div>
        </div>
        <div class='row'>
          <div class='col-md-6 col-lg-6'>
            <table id='inputaddress'></table>
          </div>
          <div class='col-md-6 col-lg-6'>
            <table id='outputaddress'></table>
          </div>
        </div>
      </>
    );
  }
}
