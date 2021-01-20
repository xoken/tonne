import React from 'react';
import { Button, Grid, GridColumn, Icon } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import images from '../images';

export default class Home extends React.Component {
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
                  <Icon name='chain' />
                  On-Chain Name
                </div>
                <Button to='/claim-twitter-handle/auth/twitter' className='ui coral button'>
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
