import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { Header, Input, Popup } from 'semantic-ui-react';
import { utils } from 'nipkow-sdk';
import NameRow from '../components/NameRow';
import * as allpayActions from '../allpayActions';

class SearchBuyName extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      queryName: '',
      searchResults: undefined,
      isError: false,
      message: '',
    };
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch(
      allpayActions.updateScreenProps({
        title: 'Buy Allpay name',
      })
    );
  }

  onKeyPress = e => {
    if (e.key === 'Enter') {
      this.onSearch();
    }
  };

  onSearch = async () => {
    this.setState({ searchResults: undefined, isError: false, message: '' });
    const { queryName } = this.state;
    if (queryName) {
      if (queryName.includes('/') || queryName.includes('\\')) {
        this.setState({ isError: true, message: '\\ , / characters are not allowed' });
      } else {
        try {
          const { dispatch } = this.props;
          // const data = { host: '127.0.0.1', port: 9189, name: [115], isProducer: false };
          // await dispatch(allpayActions.buyName(data));
          // this.props.history.push('/wallet/allpay/confirm-purchase');
          // [97, 112, 47]
          const { isAvailable, name, uri, protocol } = await dispatch(
            allpayActions.getResellerURI([97, 112, 47].concat(utils.getCodePoint(queryName)))
          );
          this.setState({ searchResults: [{ isAvailable, name, uri, protocol }] });
        } catch (error) {
          this.setState({ isError: true, message: error.message });
        }
      }
    }
  };

  onBuy = data => async () => {
    const { dispatch } = this.props;
    try {
      await dispatch(allpayActions.buyName(data));
      this.props.history.push('/wallet/allpay/confirm-purchase');
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
        <div className='ui grid'>
          <div className='ten wide column centered row'>
            <div className='column'>
              <div className='ui fluid action labeled large input'>
                <Popup
                  trigger={<div className='ui yellow label'>ap/</div>}
                  content='AllPay default namespace'
                  inverted
                />
                <input
                  type='text'
                  placeholder='Enter a name you want to purchase'
                  onChange={event =>
                    this.setState({
                      queryName: event.target.value,
                      searchResults: undefined,
                      isError: false,
                      message: '',
                    })
                  }
                  onKeyPress={this.onKeyPress}
                />
                <button className='ui yellow button' onClick={this.onSearch}>
                  Search
                </button>
              </div>
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

export default withRouter(connect(mapStateToProps)(SearchBuyName));