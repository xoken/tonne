import React from 'react';
import { Grid, GridColumn, Icon } from 'semantic-ui-react';
import { Link } from 'react-router-dom';

export default class Home extends React.Component {
  render() {
    return (
      <Grid verticalAlign='middle' style={{ height: '100%' }}>
        <GridColumn>
          <div className='ui placeholder segment'>
            <div className='ui two column stackable center aligned grid'>
              <div className='column'>
                <div className='ui icon header purplefontcolor'>
                  <Icon name='wpexplorer' />
                  BSV Block Explorer
                </div>
                <p class='coralfontcolor'>Explore BSV blocks without limits</p>
                <Link to='/explorer' className='ui coral button'>
                  Explorer
                </Link>
              </div>
              <div className='column'>
                <div className='ui icon header purplefontcolor'>
                  <Icon name='bitcoin' />
                  BSV Wallet
                </div>
                <p class='coralfontcolor'>Send and Receive Coin</p>
                <Link to='/wallet' className='ui coral button'>
                  Wallet
                </Link>
              </div>
            </div>
          </div>
        </GridColumn>
      </Grid>
    );
  }
}
