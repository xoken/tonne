import React from 'react';
import { connect } from 'react-redux';
import { chainAPI } from 'nipkow-sdk';

class Footer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      blocksSynced: null,
      chain: null,
      chainTip: null,
    };
  }

  componentDidMount() {
    this.getChainInfo();
    const autoRefreshTimeInSecs = 1 * 60 * 1000;
    this.autoRefresh = setInterval(() => {
      this.getChainInfo();
    }, autoRefreshTimeInSecs);
  }

  async getChainInfo() {
    const { nexaHost } = this.props;
    try {
      if (nexaHost) {
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
    if (this.props.nexaHost !== prevProps.nexaHost) {
      this.getChainInfo();
    }
  }

  render() {
    const { nexaHost } = this.props;
    const { blocksSynced, chain, chainTip } = this.state;
    return (
      <footer className='page-footer'>
        <div className='ui container'>
          <div className='ui transparent label'>
            Nexa Host: <div className='detail'>{nexaHost || 'UNKNOWN'}</div>
          </div>
          <div className='ui transparent label'>
            Chain: <div className='detail'>{chain}</div>
          </div>
          <div className='ui transparent label'>
            BlocksSynced: <div className='detail'>{blocksSynced}</div>
          </div>
          <div className='ui transparent label'>
            ChainTip: <div className='detail'>{chainTip}</div>
          </div>
        </div>
      </footer>
    );
  }

  componentWillUnmount() {
    clearInterval(this.autoRefresh);
  }
}

const mapStateToProps = state => ({
  nexaHost: state.settings.nexaHost,
});

export default connect(mapStateToProps)(Footer);