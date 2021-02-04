import React from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { Grid, Button } from 'semantic-ui-react';

class ExplorerSearch extends React.Component {
  constructor(props) {
    super(props);
    this.state = { searchterm: '' };
  }

  onSearchClick = event => {
    event.preventDefault();
    if (this.state.searchterm !== '') {
      if (this.state.searchterm.length < 26) {
        this.props.history.push(`/explorer/blockheight/${this.state.searchterm}`);
      } else if (this.state.searchterm.length >= 26 && this.state.searchterm.length <= 35) {
        this.props.history.push(`/explorer/address/${this.state.searchterm}`);
      } else if (this.state.searchterm.length === 64) {
        if (this.state.searchterm.substring(0, 4) === '0000') {
          this.props.history.push(`/explorer/blockhash/${this.state.searchterm}`);
        } else {
          this.props.history.push(`/explorer/transaction/${this.state.searchterm}`);
        }
      } else {
        setTimeout(3000);
        this.props.history.push(`/explorer/404`);
      }
    }
  };

  render() {
    return (
      <Grid>
        <Grid.Row>
          <Grid.Column className='cen'>
            <form onSubmit={this.onSearchClick}>
              <div className='ui form'>
                <div className='inline fields'>
                  <div
                    className='ten wide field'
                    style={{ marginLeft: 'auto', marginRight: 'auto' }}>
                    <input
                      type='text'
                      placeholder='TXID / Address / BlockHeight / BlockHash'
                      className='searchBoxAndButtons'
                      onChange={event =>
                        this.setState({ searchterm: event.target.value.replace(/\s/g, '') })
                      }
                    />

                    <Button type='submit' className='coral searchBoxAndButtons'>
                      Search
                    </Button>
                  </div>
                </div>
              </div>
            </form>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    );
  }
}
const mapStateToProps = state => ({});

export default withRouter(connect(mapStateToProps)(ExplorerSearch));
