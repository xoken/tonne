import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { Header, Input } from 'semantic-ui-react';
import { getCodePoint } from '../../shared/utils';
import NameRow from '../components/NameRow';
import * as allpayActions from '../allpayActions';

class BuyName extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      queryName: '',
      searchResults: undefined,
    };
  }

  onKeyPress = e => {
    if (e.key === 'Enter') {
      this.onSearch();
    }
  };

  onSearch = async () => {
    const { queryName } = this.state;
    if (queryName) {
      try {
        const { dispatch } = this.props;
        const response = await dispatch(allpayActions.getOutpointForName(getCodePoint(queryName)));
        this.setState({ searchResults: response });
      } catch (error) {
        console.log(error);
      }
    }
  };

  onBuy = data => async () => {
    const { dispatch } = this.props;
    try {
      await dispatch(allpayActions.buyName(data));
      this.props.history.push('/wallet/allpay/render/transaction');
    } catch (error) {}
  };

  onNamespaceCheckClick = () => {};

  renderSearchResults() {
    const { searchResults } = this.state;
    if (searchResults && searchResults.length) {
      return searchResults.map((data, index) => {
        return <NameRow key={index.toString()} data={data} onBuy={this.onBuy} />;
      });
    }
  }

  render() {
    return (
      <>
        <Header as='h2' textAlign='center'>
          Buy Allpay name
        </Header>
        <div className='ui grid'>
          <div className='ten wide column centered row'>
            <div className='column'>
              <Input
                fluid
                placeholder='Enter a name you want to purchase'
                action={{ content: 'Search', onClick: this.onSearch }}
                onChange={event => this.setState({ queryName: event.target.value })}
                onKeyPress={this.onKeyPress}
              />
            </div>
          </div>
          <div className='ten wide column centered row'>
            <div className='column'>
              <div className='ui form'>
                <div className='fields'>
                  <div className='field'>
                    <div className='ui checkbox'>
                      <input type='checkbox' name='example' />
                      <label>ap</label>
                    </div>
                  </div>
                  <div className='field'>
                    <div className='ui checkbox'>
                      <input type='checkbox' name='example' />
                      <label>id</label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {this.renderSearchResults()}
        </div>
      </>
    );
  }
}

const mapStateToProps = state => ({});

export default withRouter(connect(mapStateToProps)(BuyName));
