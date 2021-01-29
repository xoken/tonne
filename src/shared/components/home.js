import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { Button, Grid, GridColumn, Icon } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import * as claimTwitterHandleActions from '../../claimTwitterHandle/claimTwitterHandleActions';
import images from '../images';

class Home extends React.Component {
  onClaimTwitterHandle = () => {
    const { dispatch, history, user } = this.props;
    if (user) {
      history.push('/claim-twitter-handle/wallet-setup');
    } else {
      dispatch(claimTwitterHandleActions.doTwitterAuth(history));
    }
  };

  render() {
    return (
      <Grid verticalAlign='middle' style={{ height: '100%' }}>
        <GridColumn>
          <div className='ui placeholder segment'>
            <div className='ui three column stackable center aligned grid'>
              <div className='column'>
                <div className='ui icon header purplefontcolor'>
                  <Icon name='bitcoin' style={{ transform: 'rotate(-14deg)' }} />
                  Bitcoin SV Block Explorer
                </div>
                <Link to='/explorer' className='ui coral button'>
                  Explorer
                </Link>
              </div>
              <div className='column'>
                <div className='ui icon header purplefontcolor'>
                  <img
                    alt='Bitcoin SV Wallet'
                    src={images.wallet}
                    style={{
                      display: 'block',
                      height: 53,
                      width: 'auto',
                    }}
                    className='icon'
                  />
                  Bitcoin SV Wallet
                </div>
                <Link to='/wallet' className='ui coral button'>
                  Wallet
                </Link>
              </div>
              <div className='column'>
                <div className='ui icon header purplefontcolor'>
                  <Icon name='twitter' />
                  On-Chain Name
                </div>
                <Button
                  to='/claim-twitter-handle/auth/twitter'
                  className='ui coral button'
                  onClick={this.onClaimTwitterHandle}>
                  Claim Twitter Handle
                </Button>
              </div>
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

const mapStateToProps = state => ({
  user: state.twitter.user,
});

export default withRouter(connect(mapStateToProps)(Home));
