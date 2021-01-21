import React from 'react';
import { Button, Checkbox } from 'semantic-ui-react';
import { utils } from 'allegory-allpay-sdk';

export default class NameRow extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      resellerRight: false,
    };
  }

  toggle = () => this.setState(prevState => ({ resellerRight: !prevState.resellerRight }));

  render() {
    const { isAvailable, name: codePoints, uri, protocol } = this.props.data;
    const host = '127.0.0.1';
    const port = 9189;
    const name = utils.codePointToName(codePoints);
    return (
      <div className='ten wide column centered row'>
        <div className='column'>
          <div className='ui clearing segment'>
            <div className='ui grid'>
              <div className='row'>
                <div className='nine wide middle aligned column'>
                  <h4 className='ui header'>
                    {name} is {isAvailable ? 'available' : 'not available'}
                  </h4>
                </div>
                {isAvailable && (
                  <div className='seven wide middle aligned column'>
                    <div className='ui grid'>
                      <div className='six wide column middle aligned'>
                        {/* <div className='ui plain label'>{satoshiToBSV(
                          priceInSatoshi
                        )}</div> */}
                      </div>
                      <div className='ten wide column'>
                        <div className='ui form'>
                          <div className='field'>
                            <Button
                              fluid
                              className='coral'
                              onClick={this.props.onBuy({
                                name: utils.getCodePoint(name),
                                isProducer: this.state.resellerRight,
                                host,
                                port,
                              })}>
                              Buy
                            </Button>
                          </div>
                          <div className='field'>
                            <Checkbox
                              label='Add reseller Rights'
                              onChange={this.toggle}
                              checked={this.state.resellerRight}
                            />
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
    );
  }
}
