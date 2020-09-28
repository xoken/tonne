import React from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';

class ExplorerSearch extends React.Component {
  constructor(props) {
    super(props);
    this.state = { searchterm: '' };
  }

  onSearchClick = () => {
    if (this.state.searchterm !== '') {
      if (this.state.searchterm.length < 26) {
        this.props.history.push('/explorer/blockheight/' + this.state.searchterm + '/""');
      } else if (this.state.searchterm.length >= 26 && this.state.searchterm.length <= 35) {
        this.props.history.push(`/explorer/address/${this.state.searchterm}`);
      } else if (this.state.searchterm.length === 64) {
        //if (this.state.searchterm.substring(0, 3) === '000') {
        //  this.props.history.push(`/explorer/blockhash/${this.state.searchterm}/""`);
        //} else {
        this.props.history.push(`/explorer/transaction/${this.state.searchterm}`);
        //  }
      } else {
        console.log(this.props.history + 'this.props.history');
        this.props.history.push(`/explorer/404`);
      }
    }
  };

  render() {
    return (
      <div className='row'>
        <div className='col-md-12 col-lg-12'>
          <center>
            <form onSubmit={this.onSearchClick}>
              <input
                className='pagenuminput'
                placeholder='TXID / Address / BlockHeight'
                size='50'
                type='text'
                onChange={event => this.setState({ searchterm: event.target.value })}
              />
              <button className='btn btn-primary' type='submit'>
                Search
              </button>
            </form>
          </center>
        </div>
      </div>
    );
  }
}
const mapStateToProps = state => ({});

export default withRouter(connect(mapStateToProps)(ExplorerSearch));
