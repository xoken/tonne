import React from 'react';
import { connect } from 'react-redux';
import { Message } from 'semantic-ui-react';
import { wallet } from 'nipkow-sdk';

class Footer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      chain: null,
      nexaHost: localStorage.getItem('nexaHost'),
      blocksSynced: null,
      chainTip: null,
    };
  }

  async componentDidMount() {
    try {
      const chainData = await wallet.getChain();
      if (chainData) {
        this.setState({ chain: chainData.chainInfo.chain });
      } else {
        throw new Error('Chain information not found');
      }
    } catch (error) {
      this.setState({ chain: 'UNKNOWN' });
    }
  }

  componentDidUpdate() {
    console.log('Hi');
    // if (this.state.nexaHost !== localStorage.getItem('hostname')) {
    //   this.setState({ nexaHost: localStorage.getItem('hostname') });
    //   this.getChain();
    // }
  }
  render() {
    const { chain, nexaHost } = this.state;
    return (
      <>
        <Message visible className='statusbar'>
          Nexa Host : {nexaHost}
          Chain : {chain}
        </Message>
      </>
    );
  }
}

const mapStateToProps = state => ({});

export default connect(mapStateToProps)(Footer);
