import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { Header, Input } from 'semantic-ui-react';
import { utils } from 'nipkow-sdk';
import NameRow from '../components/NameRow';
import * as allpayActions from '../allpayActions';

class BuyName extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      queryName: '',
      searchResults: undefined,
      isError: false,
      message: '',
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
        // const data = { host: '127.0.0.1', port: 9189, name: [115], isProducer: true };
        // await dispatch(allpayActions.buyName(data));
        // this.props.history.push('/wallet/allpay/render/transaction');
        const { isAvailable, name, uri, protocol } = await dispatch(
          allpayActions.getResellerURI(utils.getCodePoint(queryName))
        );
        this.setState({ searchResults: [{ isAvailable, name, uri, protocol }] });
      } catch (error) {
        this.setState({ isError: true, message: error.message });
      }
    }
  };

  onBuy = data => async () => {
    const { dispatch } = this.props;
    try {
      await dispatch(allpayActions.buyName(data));
      this.props.history.push('/wallet/allpay/render/transaction');
    } catch (error) {
      this.setState({ isError: true, message: error.message });
    }
  };

  onNamespaceCheckClick = () => {};

  renderSearchResults() {
    const { searchResults } = this.state;
    if (searchResults) {
      if (searchResults.length) {
        return searchResults.map((data, index) => {
          return <NameRow key={index.toString()} data={data} onBuy={this.onBuy} />;
        });
      } else {
        return;
      }
    }
  }

  renderError() {
    const { isError, message } = this.state;
    if (message) {
      if (isError) {
        return (
          <div className='ui negative message'>
            <p>{message}</p>
          </div>
        );
      } else {
        return (
          <div className='ui success message'>
            <p>{message}</p>
          </div>
        );
      }
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
          {/* <div className='ten wide column centered row'>
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
          </div> */}
          {this.renderSearchResults()}
          <div className='ten wide column centered row'>
            <div className='column'>{this.renderError()}</div>
          </div>
        </div>
      </>
    );
  }
}

const mapStateToProps = state => ({});

export default withRouter(connect(mapStateToProps)(BuyName));
