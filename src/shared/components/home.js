import React from 'react';
import { Icon } from 'semantic-ui-react';
import { Link } from 'react-router-dom';

export default class Home extends React.Component {
  render() {
    return (
      <>
        <div className='ui placeholder segment'>
          <div className='ui two column stackable center aligned grid'>
            <div className='column'>
              <div className='ui icon header'>
                <Icon name='wpexplorer' />
                BSV Block Explorer
              </div>
              <p>Explore BSV blocks without limits</p>
              <Link to='/explorer' className='ui yellow button'>
                Explorer
              </Link>
            </div>
            <div className='column'>
              <div className='ui icon header'>
                <Icon name='google wallet' />
                BSV Wallet
              </div>
              <p>Send and Receive Coin</p>
              <Link to='/wallet' className='ui yellow button'>
                Wallet
              </Link>
            </div>
          </div>
        </div>
      </>
    );
  }
}
