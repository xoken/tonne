import React from 'react';
import { connect } from 'react-redux';
import { Button, Header } from 'semantic-ui-react';
import * as allpayActions from './allpayActions';

class ProxyRegistration extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      queryName: '',
      searchResultsSuggestions: false,
      namespace: false,
    };
  }

  onRegister = (proxyHost, port) => () => {
    const { dispatch } = this.props;
    try {
      dispatch(allpayActions.registerName({ proxyHost, port }));
    } catch (error) {}
  };

  renderProxyProviders() {
    const proxyProviders = [
      { name: 'Proxy Provider 1', host: '127.0.0.1', port: 9091 },
      { name: 'Proxy Provider 2', host: '127.0.0.1', port: 9091 },
      { name: 'Proxy Provider 3', host: '127.0.0.1', port: 9091 },
    ];
    return proxyProviders.map(({ name, host, port }, index) => {
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
                            <Button fluid onClick={this.onRegister(host, port)}>
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
          Register Allpay name
        </Header>
        <div className='ui grid'>{this.renderProxyProviders()}</div>
      </>
    );
  }
}

const mapStateToProps = state => ({});

export default connect(mapStateToProps)(ProxyRegistration);
