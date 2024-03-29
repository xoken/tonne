import React from 'react';
import { connect } from 'react-redux';
import { chainAPI } from 'allegory-allpay-sdk';
import { Button } from 'semantic-ui-react';
import images from '../images';

class Footer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      blocksSynced: null,
      chain: null,
      chainTip: null,
      statusButton: false,
    };
  }

  componentDidMount() {
    // this.getChainInfo();
    // const autoRefreshTimeInSecs = 1 * 60 * 1000;
    // this.autoRefresh = setInterval(() => {
    //   this.getChainInfo();
    // }, autoRefreshTimeInSecs);
  }

  async getChainInfo() {
    const { nexaURI } = this.props;
    try {
      if (nexaURI) {
        const { chainInfo } = await chainAPI.getChainInfo();
        if (chainInfo) {
          const { chain, chainTip, blocksSynced } = chainInfo;
          this.setState({ chain, chainTip, blocksSynced });
        } else {
          throw new Error('Chain information not found');
        }
      } else {
        throw new Error('Host not found!');
      }
    } catch (error) {
      this.setState({ blocksSynced: 'UNKNOWN', chain: 'UNKNOWN', chainTip: 'UNKNOWN' });
    }
  }

  componentDidUpdate(prevProps) {
    // if (this.props.nexaURI !== prevProps.nexaURI) {
    //   this.getChainInfo();
    // }
  }

  renderFooter() {
    const { nexaURI } = this.props;
    const { statusButton, blocksSynced, chain, chainTip } = this.state;
    if (statusButton) {
      return (
        <>
          <Button onClick={this.onStatusButtonToggle} className='statusbuttontext'>
            <div>Connection status &lt;&lt;</div>
          </Button>
          <footer
            className={
              this.state.statusButton
                ? 'page-footer page-footer-displayed'
                : 'page-footer page-footer-hidden'
            }
            style={{ backgroundColor: '#fff3f3', color: '#922FDF' }}>
            <div className='ui container'>
              <div className='ui transparent label' style={{ color: '#922FDF' }}>
                Nexa Host: <div className='detail'>{nexaURI || 'UNKNOWN'}</div>
              </div>
              <div className='ui transparent label' style={{ color: '#922FDF' }}>
                Chain: <div className='detail'>{chain}</div>
              </div>
              <div className='ui transparent label' style={{ color: '#922FDF' }}>
                BlocksSynced: <div className='detail'>{blocksSynced}</div>
              </div>
              <div className='ui transparent label' style={{ color: '#922FDF' }}>
                ChainTip: <div className='detail'>{chainTip}</div>
              </div>
            </div>
          </footer>
        </>
      );
    } else {
      return (
        <>
          <footer className='page-footer peach newpagefooter'>
            <span className='footerLeftCol'>
              <a href='https://www.xoken.org' className='peach' style={{ whiteSpace: 'nowrap' }}>
                Powered by{' '}
                <span style={{ fontFamily: 'Didact Gothic', color: '#2f355b' }}>Xoken</span>{' '}
                <img
                  alt='Xoken Labs'
                  src={images.xokenFooterLogo.default}
                  style={{
                    width: 22,
                    verticalAlign: 'middle',
                    backgroundColor: 'white',
                    padding: '0px',
                    borderRadius: '100px',
                  }}
                />
              </a>
            </span>
            <span className='footerRightCol'>
              Network: <span className='indicator peach'>{`${process.env.REACT_APP_NETWORK}`}</span>
            </span>
          </footer>
        </>
      );
    }
  }

  onStatusButtonToggle = () => {
    this.setState({ statusButton: !this.state.statusButton });
  };

  render() {
    return <>{this.renderFooter()}</>;
  }

  componentWillUnmount() {
    // clearInterval(this.autoRefresh);
  }
}

const mapStateToProps = state => ({
  nexaURI: state.settings.nexaURI,
});

export default connect(mapStateToProps)(Footer);
