import React from 'react';
import { connect } from 'react-redux';
import { NavLink, Link } from 'react-router-dom';
import { Icon } from 'semantic-ui-react';
import images from '../images';

class Header extends React.Component {
  render() {
    return (
      <header className='page-header'>
        <div className='ui container'>
          <div className='ui secondary labeled icon menu'>
            <div className='header item'>
              <Link to='/' className='' style={{ display: 'block' }}>
                <img src={images.logo} style={{ display: 'block', width: 150 }} alt='Tonne' />
              </Link>
            </div>
            <div className='right menu'>
              <NavLink
                to='/explorer'
                activeClassName='activeheader'
                className='item headertabitems'>
                <Icon name='bitcoin' style={{ transform: 'rotate(-14deg)' }} />
                Explorer
              </NavLink>
              <NavLink to='/wallet' activeClassName='activeheader' className='item headertabitems'>
                <img
                  src={images.wallet}
                  style={{
                    display: 'block',
                    height: 23,
                    width: 'auto',
                  }}
                  className='icon'
                />
                Wallet
              </NavLink>
              <NavLink
                to='/settings'
                activeClassName='activeheader'
                className='ui item headertabitems'>
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
