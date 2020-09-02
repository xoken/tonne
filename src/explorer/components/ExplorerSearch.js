import React from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';

class ExplorerSearch extends React.Component {
  constructor(props) {
    super(props);
    this.state = { searchterm: '' };
  }

  searchNegativeMsg = [];
  onSearchClick = () => {
    if (this.state.searchterm !== '') {
      if (this.state.searchterm.length < 26) {
        this.props.history.push('/explorer/blockheight/' + this.state.searchterm + '/""');
        //  window.location.replace(blhpath + '?blockheight=' + searchterm.value + '');
      } else if (this.state.searchterm.length >= 26 && this.state.searchterm.length <= 35) {
        this.props.history.push(`/explorer/address/${this.state.searchterm}`);
        //  window.location.replace(addpath + '?address=' + searchterm.value + '');
      } else if (this.state.searchterm.length === 64) {
        if (this.state.searchterm.substring(0, 3) === '000') {
          this.props.history.push(`/explorer/blockhash/${this.state.searchterm}/""`);
          //  window.location.replace(blhpath + '?blockhash=' + searchterm.value + '');
        } else {
          this.props.history.push(`/explorer/transaction/${this.state.searchterm}`);
          //  window.location.replace(txpath + '?transaction=' + searchterm.value + '');
        }
      } else {
        this.searchNegativeMsg.push(<div>No results found</div>);
        //  searchmesssage.innerHTML = 'No results found';
        //  searchnegative.style.visibility = 'hidden';
      }
    }
  };

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
                onChange={event => this.setState({ searchterm: event.target.value })}
              />
              <button className='btn btn-primary' onClick={this.onSearchClick}>
                Search
              </button>
              {this.searchNegativeMsg}
            </center>
          </div>
        </div>
      </>
    );
  }
}
const mapStateToProps = state => ({});

export default withRouter(connect(mapStateToProps)(ExplorerSearch));
