import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { Button, Grid, GridColumn, Icon, Image } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import * as claimTwitterHandleActions from '../../claimTwitterHandle/claimTwitterHandleActions';
import images from '../images';

class Home extends React.Component {
  onClaimTwitterHandle = () => {
    const { dispatch, history } = this.props;
    dispatch(claimTwitterHandleActions.doTwitterAuth(history));
  };

  render() {
    return (
      <Grid verticalAlign='middle' style={{ height: '100%' }}>
        <GridColumn>
          <div className='ui placeholder segment'>
            <div className='ui three column stackable center aligned grid'>
              <div className='column'>
                <div className='homeMainSection'>
                  <div className='ui icon header purplefontcolor'>
                    <Icon name='bitcoin' style={{ transform: 'rotate(-14deg)' }} />
                    Bitcoin SV Blockchain
                  </div>
                  <Link to='/explorer' className='ui coral button'>
                    Explore
                  </Link>
                </div>
              </div>
              <div className='column'>
                <div className='homeMainSection'>
                  <div className='ui icon header purplefontcolor'>
                    <img
                      alt='Bitcoin SV Wallet'
                      src={images.wallet}
                      style={{
                        display: 'block',
                        height: 53,
                        width: 'auto',
                        borderRadius: '100px',
                      }}
                      className='icon'
                    />
                    Bitcoin SV Wallet
                  </div>
                  <Link to='/wallet' className='ui coral button'>
                    Send / Receive
                  </Link>
                </div>
              </div>
              {process.env.REACT_APP_ENVIRONMENT === 'development' && (
                <div className='column'>
                  <div className='homeMainSection'>
                    <div className='ui icon header purplefontcolor'>
                      <img
                        src={images.twitterLogo}
                        className='icon'
                        style={{
                          display: 'block',
                          height: 53,
                          borderRadius: '100px',
                          width: 'auto',
                        }}
                      />
                      Twitter handle
                    </div>
                    <Link
                      to='/claim-twitter-handle/auth/twitter'
                      className='ui coral button'
                      onClick={this.onClaimTwitterHandle}>
                      Claim on-chain
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        </GridColumn>
      </Grid>
    );
  }
}

Home.propTypes = {
  dispatch: PropTypes.func.isRequired,
};

Home.defaultProps = {};

const mapStateToProps = state => ({});

export default withRouter(connect(mapStateToProps)(Home));
