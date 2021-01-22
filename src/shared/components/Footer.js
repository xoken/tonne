import React from 'react';
import { connect } from 'react-redux';
import { chainAPI } from 'allegory-allpay-sdk';
import { Link } from 'react-router-dom';
import { Button, Grid } from 'semantic-ui-react';
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
            style={{ backgroundColor: '#fbe1e2', color: '#9173a8' }}>
            <div className='ui container'>
              <div className='ui transparent label' style={{ color: '#9173a8' }}>
                Nexa Host: <div className='detail'>{nexaURI || 'UNKNOWN'}</div>
              </div>
              <div className='ui transparent label' style={{ color: '#9173a8' }}>
                Chain: <div className='detail'>{chain}</div>
              </div>
              <div className='ui transparent label' style={{ color: '#9173a8' }}>
                BlocksSynced: <div className='detail'>{blocksSynced}</div>
              </div>
              <div className='ui transparent label' style={{ color: '#9173a8' }}>
                ChainTip: <div className='detail'>{chainTip}</div>
              </div>
            </div>
          </footer>
        </>
      );
    } else {
      return (
        <>
          <footer className='page-footer peach'>
            <Grid className='nopadding newpagefooter' columns={3}>
              <Grid.Row className='nopadding'>
                <Grid.Column width={5}>
                  <a href='https://www.xoken.org' className='peach'>
                    Powered by{' '}
                    <img
                      src={images.xokenFooterLogo}
                      style={{ width: 63, verticalAlign: 'middle' }}
                    />
                  </a>
                </Grid.Column>
                <Grid.Column width={6}>
                  {process.env.REACT_APP_CLIENT === 'browser' && (
                    <Link to='/downloads' className='peach'>
                      Download Tonne App
                    </Link>
                  )}
                </Grid.Column>
                <Grid.Column width={5}>
                  <a href='https://www.xoken.org/contact-us/' className='peach'>
                    Contact Us
                  </a>
                </Grid.Column>
              </Grid.Row>
            </Grid>
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
