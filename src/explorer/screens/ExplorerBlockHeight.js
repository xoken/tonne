import React from 'react';
import ExplorerSearch from '../components/ExplorerSearch';

export default class ExplorerBlockHeight extends React.Component {
  render() {
    return (
      <>
        <ExplorerSearch />
        <div class='row'>
          <div class='col-md-12 col-lg-12'>
            <h4>Block</h4>
            <h5 id='blocktitle'></h5>
            <a id='blockhash'></a>
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
                  <b>Previous Block</b>
                </td>
                <td>
                  <a id='previousblock'></a>
                </td>
              </tr>
              <tr>
                <td>
                  <b>Block Version</b>
                </td>
                <td>
                  <a id='blockversion'></a>
                </td>
              </tr>
              <tr>
                <td>
                  <b>txCount</b>
                </td>
                <td>
                  <a id='txcount'></a>
                </td>
              </tr>
              <tr>
                <td>
                  <b>Nonce</b>
                </td>
                <td>
                  <a id='bhnonce'></a>
                </td>
              </tr>
              <tr>
                <td>
                  <b>coinbaseTx</b>
                </td>
                <td>
                  <a id='coinbasetx'></a>
                </td>
              </tr>
            </table>
          </div>
          <div class='col-md-6 col-lg-6'>
            <table class='tdborderbottom'>
              <tr>
                <td>
                  <b>Next Block</b>
                </td>
                <td>
                  <a id='nextblock'></a>
                </td>
              </tr>
              <tr>
                <td>
                  <b>Block Bits</b>
                </td>
                <td>
                  <a id='blockbits'></a>
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
                  <b>Timestamp (UTC)</b>
                </td>
                <td>
                  <a id='timestamp'></a>
                </td>
              </tr>
              <tr>
                <td>
                  <b>Merkle Root</b>
                </td>
                <td>
                  <a id='merkleroot'></a>
                </td>
              </tr>
              <tr>
                <td>
                  <b>coinbaseMessage</b>
                </td>
                <td>
                  <a id='coinbasemessage'></a>
                </td>
              </tr>
              <tr>
                <td>
                  <b>guessedMiner</b>
                </td>
                <td>
                  <a id='guessedminer'></a>
                </td>
              </tr>
            </table>
          </div>
        </div>
        <hr />
        <div class='row'>
          <div class='col-md-12 col-lg-12 text-center'>
            <div id='refreshpage'></div>
            <table id='transactionsection'></table>
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
