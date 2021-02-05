import React from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import * as authActions from '../../auth/authActions';
import * as authSelectors from '../../auth/authSelectors';
import { Button, Grid, Header } from 'semantic-ui-react';
var globmnorig = '';
var globmndupl = '';

class NewWallet extends React.Component {
  constructor(props) {
    super(props);
    this.state = { continue: false };
    this.morigfull = '';
    this.mnorig = [];
    this.mndupl = [];
  }

  generateMnemonic = () => {
    const { dispatch } = this.props;
    dispatch(authActions.generateMnemonic());
    if (process.env.REACT_APP_ENVIRONMENT === 'development') {
      console.log(this.props.bip39Mnemonic);
    }
    this.setState({ continue: true });
  };

  addmnwordlistener = () => {
    var mnwords = document.getElementsByClassName('mnword');
    for (var j = 0; j < mnwords.length; j++) {
      mnwords[j].addEventListener('mouseenter', function () {
        this.textContent = globmnorig[this.id];
      });
      mnwords[j].addEventListener('mouseleave', function () {
        this.textContent = globmndupl[this.id];
      });
    }
  };

  onContinue = () => {
    const { onContinue } = this.props;
    onContinue();
  };

  renderContinue() {
    if (this.state.continue) {
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
  }
  printmn = () => {
    document.getElementById('mnemonic').innerHTML = this.morigfull;
  };

  render() {
    this.morigfull = '';
    this.mnorig.length = 0;
    this.mndupl.length = 0;
    if (this.props.bip39Mnemonic) {
      var mnwordarray = this.props.bip39Mnemonic.split(' ');
      for (var k = 0; k < mnwordarray.length; k++) {
        if (mnwordarray[k][0] !== undefined) {
          this.mndupl[k] = mnwordarray[k][0].toString();
          for (var l = 1; l < mnwordarray[k].length; l++) {
            this.mndupl[k] += '*';
          }
          this.morigfull += "<span class='mnword' id='" + k + "'>" + this.mndupl[k] + '</span>';
        }
        this.mnorig.push(mnwordarray[k]);

        if (k !== mnwordarray.length) {
          this.morigfull += "<span class='mnmargin'></span>";
        }
      }
      globmnorig = this.mnorig;
      globmndupl = this.mndupl;
      if (document.getElementById('mnemonic') !== null) {
        this.printmn();
        this.addmnwordlistener();
      }
    }

    return (
      <Grid>
        <Grid.Row>
          <Grid.Column>
            <Header as='h4' className='purplefontcolor' textAlign='center'>
              Please save this mnemonic securely. You will need this to recover your wallet on a new
              device.
            </Header>
          </Grid.Column>
        </Grid.Row>
        <Grid.Row>
          <Grid.Column>
            <div className='mnemonic' id='mnemonic'></div>
          </Grid.Column>
        </Grid.Row>
        <Grid.Row>
          <Grid.Column>
            <Header as='h5' id='unmaskhint' className='generalheadingscolor' textAlign='center'>
              Hint: Move your mouse pointer over the masked words to unmask them
            </Header>
          </Grid.Column>
        </Grid.Row>
        <Grid.Row>
          <Grid.Column textAlign='center'>
            <Button className='coral' onClick={this.generateMnemonic}>
              Generate Mnemonic
            </Button>
          </Grid.Column>
        </Grid.Row>
        {this.renderContinue()}
      </Grid>
    );
  }
}

NewWallet.propTypes = {
  dispatch: PropTypes.func.isRequired,
  isLoading: PropTypes.bool.isRequired,
  bip39Mnemonic: PropTypes.string,
};

NewWallet.defaultProps = {
  bip39Mnemonic: '',
};

const mapStateToProps = state => ({
  isLoading: authSelectors.isLoading(state),
  bip39Mnemonic: authSelectors.getMnemonic(state),
});

export default withRouter(connect(mapStateToProps)(NewWallet));
