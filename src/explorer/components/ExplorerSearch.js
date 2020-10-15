import React from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { Segment, Grid, Button } from 'semantic-ui-react';

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
        if (this.state.searchterm.substring(0, 4) === '0000') {
          this.props.history.push(`/explorer/blockhash/${this.state.searchterm}/""`);
        } else {
          this.props.history.push(`/explorer/transaction/${this.state.searchterm}`);
        }
      } else {
        console.log(this.props.history + 'this.props.history');
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
                  <div className='three wide field'></div>
                  <div className='nine wide field'>
                    <input
                      type='text'
                      placeholder='TXID / Address / BlockHeight / BlockHash'
                      onChange={event =>
                        this.setState({ searchterm: event.target.value.replace(/\s/g, '') })
                      }
                    />
                  </div>
                  <div className='one wide field'>
                    <Button type='submit' className='explorerbuttoncolor'>
                      Search
                    </Button>
                  </div>
                  <div className='three wide field'></div>
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
