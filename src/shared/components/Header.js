import React from 'react';
import { connect } from 'react-redux';
import { NavLink, Link } from 'react-router-dom';
import { Icon } from 'semantic-ui-react';
import images from '../images';

class Header extends React.Component {
  render() {
    return (
      <header className='page-header'>
        <div className='ui secondary labeled icon menu'>
          <div className='ui container'>
            <div className='header item'>
              <Link to='/' className='' style={{ display: 'block' }}>
                <img src={images.logo} style={{ display: 'block', width: 150 }} alt='Xoken' />
              </Link>
            </div>
            <div className='right menu'>
              <NavLink to='/explorer' activeClassName='active' className='item'>
                <Icon name='wpexplorer' />
                Explorer
              </NavLink>
              <NavLink to='/wallet' activeClassName='active' className='item'>
                <Icon name='google wallet' />
                Wallet
              </NavLink>
              <NavLink to='/settings' className='ui item'>
                <Icon name='setting' />
                Settings
              </NavLink>
            </div>
          </div>
        </div>
      </header>
    );
  }
}

const mapStateToProps = state => ({});

export default connect(mapStateToProps)(Header);
