import React from 'react';
import { Link } from 'react-router-dom';

export default class Home extends React.Component {
  componentDidMount() {
    this.props.changeTabHighlight('');
  }
  render() {
    return (
      <>
        <div className='row'>
          <div className='col-sm-6'>
            <div className='card text-center'>
              <div className='card-body'>
                <h5 className='card-title'>BSV Wallet</h5>
                <p className='card-text'>Send and Receive Coin</p>
                <Link to='/wallet' className='generalbtns'>
                  Wallet
                </Link>
              </div>
            </div>
          </div>
          <div className='col-sm-6'>
            <div className='card text-center'>
              <div className='card-body'>
                <h5 className='card-title'>BSV Block Explorer</h5>
                <p className='card-text'>Explore BSV blocks without limits</p>
                <Link to='/explorer' className='generalbtns'>
                  Explore Blocks
                </Link>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }
}
