import React from 'react';
import { connect } from 'react-redux';
import { NavLink, Link } from 'react-router-dom';
import { Dropdown, Divider, Icon } from 'semantic-ui-react';
import images from '../images';

class Header extends React.Component {
  renderNetworkToggle() {
    const { REACT_APP_CLIENT, REACT_APP_NETWORK } = process.env;
    if (REACT_APP_CLIENT === 'browser') {
      if (REACT_APP_NETWORK === 'testnet') {
        return (
          <>
            <a href='https://tonne.app'>
              <Dropdown.Item className='menuDropDownItems purplefontcolor'>
                Switch to Mainnet
              </Dropdown.Item>
            </a>
            <Divider className='marginTopBottom0px' />
          </>
        );
      } else if (REACT_APP_NETWORK === 'bitcoinSV') {
        return (
          <>
            <a href='https://test.tonne.app'>
              <Dropdown.Item className='menuDropDownItems purplefontcolor'>
                Switch to Testnet
              </Dropdown.Item>
            </a>
            <Divider className='marginTopBottom0px' />
          </>
        );
      }
    } else {
      if (REACT_APP_NETWORK === 'testnet') {
        return (
          <>
            <Link className='ui'>
              <Dropdown.Item className='menuDropDownItems purplefontcolor'>
                Switch to Mainnet
              </Dropdown.Item>
            </Link>
            <Divider className='marginTopBottom0px' />
          </>
        );
      } else if (REACT_APP_NETWORK === 'bitcoinSV') {
        return (
          <>
            <Link className='ui'>
              <Dropdown.Item className='menuDropDownItems purplefontcolor'>
                Switch to Testnet
              </Dropdown.Item>
            </Link>
            <Divider className='marginTopBottom0px' />
          </>
        );
      }
    }
    return null;
  }

  render() {
    return (
      <header className='page-header'>
        <div className='ui container'>
          <div className='ui secondary labeled icon menu'>
            <div className='header item'>
              <Link to='/' className='' style={{ display: 'block' }}>
                <span className='tonneLogo'>T0NNE</span>
                {
                  // <img src={images.logo} className='headerLogo' alt='Tonne' />
                }
              </Link>
            </div>
            <div className='right menu'>
              <NavLink
                to='/explorer'
                activeClassName='activeheader'
                className='item headertabitems headerExplorer'>
                <img
                  alt='Bitcoin SV Explorer'
                  src={images.explorerLogo}
                  className='icon headerIcons'
                />
                Explorer
              </NavLink>
              <NavLink
                to='/wallet'
                activeClassName='activeheader'
                className='item headertabitems headerWallet'>
                <img alt='Bitcoin SV Wallet' src={images.wallet} className='icon headerIcons' />
                Wallet
              </NavLink>
              <NavLink
                to='/mail'
                activeClassName='activeheader'
                className='item headertabitems headerVoxMail'>
                <img alt='voxMail' src={images.voxmail} className='icon headerIcons' />
                voxMail
              </NavLink>
              <NavLink to='/analytics' className='item headertabitems headerVoxMail'>
                <Icon name='line graph' />
                Analytics
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
                className='icon purplefontcolor menuDropdown'
                pointing='top right'
                icon='bars'>
                <Dropdown.Menu
                  style={{
                    backgroundColor: 'white',
                    fontSize: '14px',
                  }}>
                  {this.renderNetworkToggle()}
                  <a href='https://www.xoken.org/contact-us/'>
                    <Dropdown.Item className='menuDropDownItems purplefontcolor'>
                      Contact Us
                    </Dropdown.Item>
                  </a>
                  <Divider className='marginTopBottom0px' />
                  <Link to='/downloads'>
                    <Dropdown.Item className='menuDropDownItems purplefontcolor'>
                      Download App
                    </Dropdown.Item>
                  </Link>
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
