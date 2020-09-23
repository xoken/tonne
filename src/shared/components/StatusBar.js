import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Message } from 'semantic-ui-react';
import { wallet } from 'nipkow-sdk';

class StatusBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = { chain: '', nexahost: '' };
  }

  getChain = async () => {
    const chainData = await wallet.getChain();
    if (chainData) {
      this.setState({ chain: chainData.chainInfo.chain });
    } else {
      this.setState({ chain: 'NA' });
    }
  };
  async componentDidMount() {
    if (this.state.nexahost !== localStorage.getItem('hostname')) {
      this.setState({ nexahost: localStorage.getItem('hostname') });
      this.getChain();
    }
  }
  componentDidUpdate() {
    if (this.state.nexahost !== localStorage.getItem('hostname')) {
      this.setState({ nexahost: localStorage.getItem('hostname') });
      this.getChain();
    }
  }
  render() {
    const { chain, nexahost } = this.state;
    return (
      <>
        <center>
          <Message visible className='statusbar'>
            <b>Connected to Nexa Node : </b>
            <span className='greenalert'>{nexahost}</span> | <b>Chain : </b>
            <span className='greenalert'>{chain}</span>
          </Message>
        </center>
      </>
    );
  }
}

const mapStateToProps = state => ({});

export default connect(mapStateToProps)(StatusBar);
