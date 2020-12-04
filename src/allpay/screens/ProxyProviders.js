import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { Button, Header } from 'semantic-ui-react';
import * as allpayActions from '../allpayActions';

class ProxyProviders extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      queryName: '',
      searchResultsSuggestions: false,
      namespace: false,
    };
  }

  onRegister = (proxyHost, proxyPort) => async () => {
    const { dispatch } = this.props;
    try {
      await dispatch(allpayActions.selectProxyProvider({ proxyHost, proxyPort }));
      this.props.history.push('/wallet/allpay/register');
    } catch (error) {}
  };

  renderProxyProviders() {
    const proxyProviders = [
      { name: 'Proxy Provider 1', proxyHost: '127.0.0.1', proxyPort: 9099 },
      { name: 'Proxy Provider 2', proxyHost: '127.0.0.1', proxyPort: 9099 },
      { name: 'Proxy Provider 3', proxyHost: '127.0.0.1', proxyPort: 9099 },
    ];
    return proxyProviders.map(({ name, proxyHost, proxyPort }, index) => {
      return (
        <div key={index.toString()} className='ten wide column centered row'>
          <div className='column'>
            <div className='ui clearing segment'>
              <div className='ui grid'>
                <div className='row'>
                  <div className='nine wide middle aligned column'>
                    <h4 className='ui header'>{name}</h4>
                  </div>
                  <div className='seven wide middle aligned column'>
                    <div className='ui grid'>
                      <div className='six wide column middle aligned'></div>
                      <div className='ten wide column'>
                        <div className='ui form'>
                          <div className='field'>
                            <Button fluid onClick={this.onRegister(proxyHost, proxyPort)}>
                              Register
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    });
  }

  render() {
    return (
      <>
        <Header as='h2' textAlign='center'>
          Proxy Providers
        </Header>
        <div className='ui grid'>{this.renderProxyProviders()}</div>
      </>
    );
  }
}

const mapStateToProps = state => ({});

export default withRouter(connect(mapStateToProps)(ProxyProviders));
