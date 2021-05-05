import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { Button } from 'semantic-ui-react';
import { utils } from 'allegory-allpay-sdk';

class NameRow extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      resellerRight: false,
    };
  }

  toggle = () => this.setState(prevState => ({ resellerRight: !prevState.resellerRight }));

  render() {
    const { requestInProgress, data } = this.props;
    const { isAvailable, name: codePoints, uri, protocol } = data;
    const name = utils.codePointToName(codePoints);
    return (
      <div className='fifteen wide column centered row'>
        <div className='column'>
          <div className='ui clearing segment'>
            <div className='ui grid stackable'>
              <div className='row'>
                <div className='nine wide middle aligned column'>
                  <h4 className='ui header'>
                    {name} is {isAvailable ? 'available' : 'not available'}
                  </h4>
                </div>
                {isAvailable && (
                  <div className='seven wide middle aligned column'>
                    <div className='ui grid'>
                      <div className='six wide computer only column middle aligned'>
                        {/* <div className='ui plain label'>{utils.satoshiToBSV(
                             priceInSatoshi
                           )}</div> */}
                      </div>

                      <div className='ten wide computer column'>
                        <div className='ui form'>
                          <div className='field floatRightOnComp'>
                            <Button
                              fluid
                              className='coral'
                              loading={requestInProgress}
                              onClick={this.props.onBuy({
                                name: utils.getCodePoint(name),
                                isProducer: this.state.resellerRight,
                                uri,
                                protocol,
                              })}>
                              Buy
                            </Button>
                          </div>
                          {/* <div className='field'>
                            <Checkbox
                              label='Add reseller Rights'
                              onChange={this.toggle}
                              checked={this.state.resellerRight}
                            />
                          </div> */}
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

const mapStateToProps = state => ({
  requestInProgress: state.allpay.requestInProgress,
});

export default withRouter(connect(mapStateToProps)(NameRow));
