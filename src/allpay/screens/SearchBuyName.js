import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { Button } from 'semantic-ui-react';
import { utils } from 'allegory-allpay-sdk';
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
        title: 'Buy AllPay name',
        activeStep: 1,
        progressTotalSteps: 4,
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
          const { isAvailable, name, uri, protocol } = await dispatch(
            allpayActions.getResellerURI([97, 97, 47].concat(utils.getCodePoint(queryName)))
          );
          this.setState({ searchResults: [{ isAvailable, name, uri, protocol }] });
        } catch (error) {
          this.setState({
            isError: true,
            message: error.response && error.response.data ? error.response.data : error.message,
          });
        }
      }
    }
  };

  onSetRoot = async () => {
    try {
      const { dispatch } = this.props;
      const data = { uri: process.env.REACT_APP_RESELLER_URI, name: [115], isProducer: false };
      await dispatch(allpayActions.buyName(data));
      this.props.history.push('/wallet/allpay/confirm-purchase');
    } catch (error) {}
  };

  onBuy = data => async () => {
    const { dispatch } = this.props;
    try {
      await dispatch(allpayActions.buyName(data));
      this.props.history.push('/wallet/allpay/confirm-purchase');
    } catch (error) {
      this.setState({
        isError: true,
        message: error.response && error.response.data ? error.response.data : error.message,
      });
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
    const { requestInProgress } = this.props;
    const { searchResults } = this.state;
    return (
      <>
        <div className='ui grid'>
          <div className='fifteen wide column centered row'>
            <div className='column centered'>
              <div className='ui fluid action labeled large input'>
                <div className='uneditableinput'>
                  <span className='purplefontcolor' style={{ paddingLeft: '5px' }}>
                    aa/
                  </span>
                </div>
                <input
                  className='searchname inputWidth'
                  type='text'
                  placeholder='Enter a name you want to purchase'
                  value={this.state.queryName}
                  onChange={event =>
                    this.setState({
                      queryName: event.target.value.replaceAll(/\s/g, '').toLowerCase(),
                      searchResults: undefined,
                      isError: false,
                      message: '',
                    })
                  }
                  onKeyPress={this.onKeyPress}
                />
                <Button
                  loading={!searchResults && requestInProgress}
                  className='coral'
                  onClick={this.onSearch}>
                  Search
                </Button>
                {process.env.REACT_APP_ENVIRONMENT === 'development' && (
                  <button className='ui coral button' onClick={this.onSetRoot}>
                    Set Root
                  </button>
                )}
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
          <div className='fifteen wide column centered row'>
            <div className='column'>{this.renderError()}</div>
          </div>
        </div>
      </>
    );
  }
}

const mapStateToProps = state => ({
  requestInProgress: state.allpay.requestInProgress,
});

export default withRouter(connect(mapStateToProps)(SearchBuyName));
