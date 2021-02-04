import React from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Button, Grid, Segment } from 'semantic-ui-react';
import words from '../../shared/constants/wordlist/english';
import alphabet from '../../shared/constants/alphabet/english';
import * as authActions from '../../auth/authActions';
import * as authSelectors from '../../auth/authSelectors';
const crypto = require('crypto');

class ImportWallet extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      bip39Mnemonic: '',
      suggestions: [],
      alphabets: [],
    };
    this.alphabetarray = alphabet;
    this.data = undefined;
    this.randomnumber = undefined;
    this.temp = undefined;
    this.rindex = undefined;
    this.counter = 0;
    this.alphabetul = [];
    this.mixedalphabets = [];
  }

  componentDidMount() {
    this.mix();
  }

  mix = () => {
    let index = this.alphabetarray.length - 1;
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
    const { bip39Mnemonic } = this.state;
    var splitwords;
    var tempmn;
    if (bip39Mnemonic !== undefined) {
      tempmn = bip39Mnemonic + event.currentTarget.textContent;
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
    if (this.state.suggestions !== undefined) {
      tempmnemonic = this.state.bip39Mnemonic;
      splitwords = tempmnemonic.split(' ');
      splitwords[splitwords.length - 1] = event.currentTarget.textContent;
      for (var n = 0; n < splitwords.length; n++) {
        tempmn += splitwords[n];
        if (n !== mnemoniccount - 1) {
          tempmn += ' ';
        }
      }
    } else {
      tempmnemonic = event.currentTarget.textContent;
      splitwords = tempmnemonic.split(' ');
      splitwords[splitwords.length - 1] = event.currentTarget.textContent;
      tempmn = splitwords[0] + ' ';
    }
    this.setState({ bip39Mnemonic: tempmn, suggestions: '' });
    document.getElementById('wordsremaining').textContent = '(' + splitwords.length + ' of 12)';
  };

  backspaceOnClick = () => {
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
    const { onContinue } = this.props;
    const { dispatch } = this.props;
    const { bip39Mnemonic } = this.state;
    dispatch(authActions.setMnemonic(bip39Mnemonic));
    onContinue();
  };

  renderSuggestions() {
    if (this.state.suggestions.length > 0) {
      return (
        <Grid.Row>
          <Grid.Column>
            <ul id='suggestions'>{this.state.suggestions}</ul>
          </Grid.Column>
        </Grid.Row>
      );
    }
  }

  renderContinue() {
    const { bip39Mnemonic, suggestions } = this.state;
    if (bip39Mnemonic.split(' ').length === 12 && suggestions.length === 0) {
      return (
        <Grid.Row>
          <Grid.Column textAlign='center'>
            <Button className='coral' onClick={this.onContinue}>
              Continue
            </Button>
          </Grid.Column>
        </Grid.Row>
      );
    }
    return null;
  }

  render() {
    return (
      <Grid>
        <Grid.Row>
          <Grid.Column>
            <div id='mnemonic' className='mnemonic'>
              {this.state.bip39Mnemonic}
            </div>
          </Grid.Column>
        </Grid.Row>
        <Grid.Row>
          <Grid.Column floated='left' width='8'>
            <Button className='backspace' onClick={this.backspaceOnClick}>
              &#9003;
            </Button>
          </Grid.Column>
          <Grid.Column floated='right' width='8' verticalAlign='middle'>
            <div id='wordsremaining'>(0 of 12)</div>
          </Grid.Column>
        </Grid.Row>
        <Grid.Row centered>
          <Grid.Column width='15'>
            <Segment textAlign='center'>
              <ul id='alphabets'>{this.state.alphabets}</ul>
            </Segment>
          </Grid.Column>
        </Grid.Row>
        {this.renderSuggestions()}
        {this.renderContinue()}
        {process.env.REACT_APP_ENVIRONMENT === 'development' && (
          <>
            <Grid.Row>
              <Grid.Column>
                <textarea
                  rows='2'
                  value={this.state.bip39Mnemonic}
                  onChange={event => this.setState({ bip39Mnemonic: event.target.value })}
                />
              </Grid.Column>
            </Grid.Row>
          </>
        )}
      </Grid>
    );
  }
}

ImportWallet.propTypes = {
  dispatch: PropTypes.func.isRequired,
  isLoading: PropTypes.bool.isRequired,
};

ImportWallet.defaultProps = {};

const mapStateToProps = state => ({
  isLoading: authSelectors.isLoading(state),
});

export default withRouter(connect(mapStateToProps)(ImportWallet));
