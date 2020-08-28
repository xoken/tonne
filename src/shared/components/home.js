import React from 'react';
import { Link } from 'react-router-dom';

export default class Home extends React.Component {
  render() {
    return (
      <>
        <div className='container wallet-container'>
          <div className='row'>
            <div className='col-lg-4 col-sm-4'>
              <div className='card text-center'>
                <div className='card-body'>
                  <h5 className='card-title'>I already have a seed phrase</h5>
                  <p className='card-text'>
                    Import your existing wallet using a 12 word seed phrase
                  </p>
                  <Link to='/wallet/existing' className='generalbtns'>
                    Import wallet
                  </Link>
                </div>
              </div>
            </div>
            <div className='col-lg-4 col-sm-4'>
              <div className='card text-center'>
                <div className='card-body'>
                  <h5 className='card-title'>Yes, let's get set up!</h5>
                  <p className='card-text'>This will create a new wallet and seed phrase</p>
                  <Link to='/wallet/new' className='generalbtns'>
                    Create a Wallet
                  </Link>
                </div>
              </div>
            </div>
            <div className='col-lg-4 col-sm-4'>
              <div className='card text-center'>
                <div className='card-body'>
                  <h5 className='card-title'>BSV Block Explorer</h5>
                  <p className='card-text'>Explore BSV blocks without limits</p>
                  <br />
                  <a href='../src/explorer/index.html' className='generalbtns'>
                    Explore Blocks
                  </a>
                  {/* <Link to="../src/explorer/index.html" className="generalbtns">
                    Explore Blocks
                  </Link> */}
                </div>
              </div>
            </div>
          </div>
          <div className='row'>
            <div className='col-lg-12'>
              <Link to='/wallet/login' className='generalbtns'>
                Login to existing wallet
              </Link>
            </div>
          </div>
        </div>
      </>
    );
  }
}
