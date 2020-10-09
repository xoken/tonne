import React from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import words from '../../shared/constants/wordlist/english';
import alphabet from '../../shared/constants/alphabet/english';
import * as authActions from '../../auth/authActions';
import * as authSelectors from '../../auth/authSelectors';
import { Button } from 'semantic-ui-react';
const crypto = require('crypto');

class ExistingWallet extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      bip39Mnemonic: '',
    };
    this.state = { alphabets: [] };
    this.state = { suggestions: [] };
    this.state = { mncompleted: false };
    this.letterOnClick = this.letterOnClick.bind(this);
    this.wordOnClick = this.wordOnClick.bind(this);
    this.backspaceOnClick = this.backspaceOnClick.bind(this);
  }
  alphabetarray = alphabet;
  data;
  randomnumber;
  temp;
  rindex;
  counter = 0;
  alphabetul = [];
  self = this;
  mixedalphabets = [];

  mix = () => {
    var index = this.alphabetarray.length - 1;
    for (var i = 0; i < this.alphabetarray.length; i++) {
      if (this.counter === this.alphabetarray.length * 20) {
        for (var u = 0; u < this.alphabetarray.length; u++) {
          this.mixedalphabets.push(
            <li key={u} onClick={this.letterOnClick} className='letter'>
              {this.alphabetarray[u]}
            </li>
          );
        }
        this.setState({ alphabets: this.mixedalphabets });
        break;
      }
      crypto.randomBytes(5, (err, buf) => {
        if (err) throw err;
        this.counter += 1;
        this.data = buf.toString('hex');
        this.randomnumber = parseInt(this.data, 16);
        this.rindex = this.randomnumber % 26;
        this.temp = this.alphabetarray[index];
        this.alphabetarray[index] = this.alphabetarray[this.rindex];
        this.alphabetarray[this.rindex] = this.temp;
        index -= 1;
        if (0 === this.counter % 26) {
          this.mix();
        }
      });
    }
  };

  letterOnClick = event => {
    var self = this;
    var splitwords;
    var tempmn;
    if (this.state.bip39Mnemonic != undefined) {
      tempmn = this.state.bip39Mnemonic += event.currentTarget.textContent;
      this.setState({
        bip39Mnemonic: tempmn,
      });
      splitwords = tempmn.split(' ');
      document.getElementById('wordsremaining').textContent = '(' + splitwords.length + ' of 12)';
      this.wordsuggest(splitwords[splitwords.length - 1].length, splitwords[splitwords.length - 1]);
    } else {
      this.setState({
        bip39Mnemonic: event.currentTarget.textContent,
      });
      splitwords = event.currentTarget.textContent.split(' ');
      document.getElementById('wordsremaining').textContent = '(' + splitwords.length + ' of 12)';
      this.wordsuggest(splitwords[splitwords.length - 1].length, splitwords[splitwords.length - 1]);
    }
  };

  wordsuggest = (len, cont) => {
    var count = 0;
    var tempsuggestion = [];

    if (len !== 0) {
      for (var w = 0; w < words.length; w++) {
        if (words[w].substring(0, len) === cont) {
          tempsuggestion.push(
            <li key={w + 100} onClick={this.wordOnClick} className='wordlist'>
              {words[w]}
            </li>
          );
          count += 1;
        }
      }
      if (count <= 36) {
        this.setState({ suggestions: tempsuggestion });
      }
    }
  };

  wordOnClick = event => {
    var splitwords,
      tempmnemonic,
      tempmn = '',
      mnemoniccount = 12;
    if (this.state.suggestions != undefined) {
      tempmnemonic = this.state.bip39Mnemonic;
      splitwords = tempmnemonic.split(' ');
      splitwords[splitwords.length - 1] = event.currentTarget.textContent;
      for (var n = 0; n < splitwords.length; n++) {
        tempmn += splitwords[n];
        if (n != mnemoniccount - 1) {
          tempmn += ' ';
        }
      }
    } else {
      tempmnemonic = event.currentTarget.textContent;
      splitwords = tempmnemonic.split(' ');
      splitwords[splitwords.length - 1] = event.currentTarget.textContent;
      tempmn = splitwords[0] + ' ';
    }
    this.setState({ bip39Mnemonic: tempmn });
    this.setState({ suggestions: '' });
    document.getElementById('wordsremaining').textContent = '(' + splitwords.length + ' of 12)';
    if (splitwords.length === 12) {
      this.setState({ mncompleted: true });
    }
  };

  backspaceOnClick = () => {
    this.setState({ mncompleted: false });
    if (this.state.bip39Mnemonic.length !== 0) {
      var splitwords,
        tempmn = this.state.bip39Mnemonic.substring(0, this.state.bip39Mnemonic.length - 1);
      this.setState({ bip39Mnemonic: tempmn });
      splitwords = tempmn.split(' ');
      if (tempmn.length !== 0) {
        document.getElementById('wordsremaining').textContent = '(' + splitwords.length + ' of 12)';
      } else {
        document.getElementById('wordsremaining').textContent = '(0 of 12)';
        this.setState({ suggestions: '' });
      }
      this.wordsuggest(splitwords[splitwords.length - 1].length, splitwords[splitwords.length - 1]);
    }
  };

  onContinue = () => {
    const { dispatch } = this.props;
    const { bip39Mnemonic } = this.state;
    dispatch(authActions.setMnemonic(bip39Mnemonic));
    this.props.history.push('/wallet/password');
  };

  componentDidMount() {
    this.mix();
  }
  render() {
    return (
      <>
        <div className='row'>
          <div className='col-md-12'>
            <div id='mnemonic' className='mnemonic'>
              {this.state.bip39Mnemonic || ''}
            </div>
            <div id='wordsremaining'>(0 of 12)</div>
          </div>
        </div>
        <div className='row'>
          <div className='col-md-12'>
            <br />
            <button className='btn btn-primary' id='backspc' onClick={this.backspaceOnClick}>
              &#9003;
            </button>
          </div>
        </div>
        <div className='row'>
          <div className='col-md-12'>
            <br />
            <br />

            <ul id='alphabets'>{this.state.alphabets}</ul>
          </div>
        </div>

        <div className='row'>
          <div className='col-md-12'>
            <ul id='suggestions'>{this.state.suggestions}</ul>
          </div>
        </div>
        <div className='row'>
          <div className='col-md-12'>
            <center>
              <MnemonicCompleted
                mncompleted={this.state.mncompleted}
                continuefunction={this.onContinue}
              />
            </center>
          </div>
        </div>

        {/* <div className="dispnone"> */}
        <div>
          <div>
            <textarea
              rows='2'
              value={this.state.bip39Mnemonic || ''}
              onChange={event => this.setState({ bip39Mnemonic: event.target.value })}
            />
          </div>
          <button type='button' className='btn btn-primary btn-md' onClick={this.onContinue}>
            Continue
          </button>
        </div>
      </>
    );
  }
}
function MnemonicCompleted(props) {
  if (props.mncompleted === true) {
    return (
      <Button className='txbtn' onClick={props.continuefunction}>
        Continue
      </Button>
    );
  } else {
    return <i></i>;
  }
}
ExistingWallet.propTypes = {
  dispatch: PropTypes.func.isRequired,
  isLoading: PropTypes.bool.isRequired,
};

ExistingWallet.defaultProps = {};

const mapStateToProps = state => ({
  isLoading: authSelectors.isLoading(state),
});

export default withRouter(connect(mapStateToProps)(ExistingWallet));
