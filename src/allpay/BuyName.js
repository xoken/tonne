import React from 'react';
import { connect } from 'react-redux';
import { Button, Header, Checkbox, Input } from 'semantic-ui-react';
import * as allpayActions from './allpayActions';

class BuyName extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      queryName: '',
      searchResultsSuggestions: false,
      namespace: false,
    };
  }

  onSearch = () => {
    const { queryName } = this.state;
    const { dispatch } = this.props;
    if (queryName) {
      try {
        dispatch(allpayActions.getOutpointForName(queryName));
        this.setState({ searchResultsSuggestions: true });
      } catch (error) {}
    }
  };

  onBuy = (resellerHost, name, priceInSatoshi, isProducer) => () => {
    const { dispatch } = this.props;
    try {
      dispatch(allpayActions.buyName({ resellerHost, name, priceInSatoshi, isProducer }));
    } catch (error) {}
  };

  onNamespaceCheckClick = () => {
    this.setState({ namespace: !this.state.namespace });
  };

  renderSearchResult() {
    const canBuy = true;
    const name = 'shubendra';
    return (
      <>
        <div className='ten wide column centered row'>
          <div className='column'>
            <div className='ui clearing segment'>
              <div className='ui grid'>
                <div className='row'>
                  <div className='nine wide middle aligned column'>
                    <h4 className='ui header'>
                      {name} is {canBuy ? 'available' : 'not available'}
                    </h4>
                  </div>
                  {canBuy && (
                    <div className='seven wide middle aligned column'>
                      <div className='ui grid'>
                        <div className='six wide column middle aligned'>
                          <div className='ui plain label'>20 BSV</div>
                        </div>
                        <div className='ten wide column'>
                          <div className='ui form'>
                            <div className='field'>
                              <Button fluid onClick={this.onBuy(name)}>
                                Buy
                              </Button>
                            </div>
                            <div className='field'>
                              <Checkbox label='Add reseller Rights' />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
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
                action='Search'
                onChange={event => this.setState({ queryName: event.target.value })}
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
                      <label>Domain 1</label>
                    </div>
                  </div>
                  <div className='field'>
                    <div className='ui checkbox'>
                      <input type='checkbox' name='example' />
                      <label>Domain 2</label>
                    </div>
                  </div>
                  <div className='field'>
                    <div className='ui checkbox'>
                      <input type='checkbox' name='example' />
                      <label>Domain 3</label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {this.renderSearchResult()}
        </div>
      </>
    );
  }
}

const mapStateToProps = state => ({});

export default connect(mapStateToProps)(BuyName);
