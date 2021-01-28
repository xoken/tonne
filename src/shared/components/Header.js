import React from 'react';
import { connect } from 'react-redux';
import { NavLink, Link } from 'react-router-dom';
import { Icon, Menu, Dropdown } from 'semantic-ui-react';
import images from '../images';

class Header extends React.Component {
  onSwitchNetworkToggle = () => {
    if (process.env.REACT_APP_CLIENT === 'browser') {
      if (process.env.REACT_APP_NETWORK === 'testnet') {
        return (
          <Dropdown.Item>
            <a href='https://tonne.app'>Switch to Mainnet</a>
          </Dropdown.Item>
        );
      } else {
        return (
          <Dropdown.Item>
            <a href='https://test.tonne.app'>Switch to Testnet</a>
          </Dropdown.Item>
        );
      }
    } else {
      if (process.env.REACT_APP_NETWORK === 'testnet') {
        return (
          <Dropdown.Item>
            <Link className='ui'>Switch to Mainnet</Link>
          </Dropdown.Item>
        );
      } else {
        return (
          <Dropdown.Item>
            <Link className='ui'>Switch to Testnet</Link>
          </Dropdown.Item>
        );
      }
    }
  };

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
                  alt='Bitcoin SV Wallet'
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
              {/* <NavLink
                to='/settings'
                activeClassName='activeheader'
                className='ui item headertabitems'>
                <Icon name='setting' />
                Settings
              </NavLink> */}

              <Dropdown
                button
                className='icon purplefontcolor'
                icon='bars'
                style={{
                  backgroundColor: 'white',
                  height: 'auto',
                  marginTop: 'auto',
                  marginBottom: 'auto',
                  zIndex: 999,
                  fontSize: '25px',
                }}>
                <Dropdown.Menu
                  style={{
                    backgroundColor: 'white',
                    fontSize: '14px',
                  }}>
                  {this.onSwitchNetworkToggle()}

                  <Dropdown.Item>
                    <a href='https://www.xoken.org/contact-us/'>Contact Us</a>
                  </Dropdown.Item>
                  <Dropdown.Item>
                    <Link to='/downloads'>Download App</Link>
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </div>
          </div>
        </div>
      </header>
    );
  }
}

const mapStateToProps = state => ({});

export default connect(mapStateToProps)(Header);
