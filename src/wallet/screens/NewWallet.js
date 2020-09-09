import React from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import * as authActions from '../../auth/authActions';
import * as authSelectors from '../../auth/authSelectors';
var globmnorig = '';
var globmndupl = '';

class NewWallet extends React.Component {
  constructor(props) {
    super(props);
    this.state = { continue: false };
  }

  morigfull = '';
  mnorig = [];
  mndupl = [];
  self = this;

  generateMnemonic = () => {
    const { dispatch } = this.props;
    dispatch(authActions.generateMnemonic());
    this.setState({ continue: true });
  };

  onContinue = () => {
    this.props.history.push('/wallet/password');
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

  printmn = () => {
    document.getElementById('mnemonic').innerHTML = this.morigfull;
    document.getElementById('unmaskhint').innerHTML =
      '<h6>Hint: Move your mouse pointer over the masked words to unmask them</h6>';
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
    var continu;
    if (this.state.continue === true) {
      continu = (
        <button type='button' className='generalbtns' onClick={this.onContinue}>
          Continue
        </button>
      );
    }

    return (
      <>
        <div className='row'>
          <div className='col-md-12 centerall'>
            <h5 className='generalheadingscolor'>
              Please write down these words on a piece of paper. This seed will help recover your
              wallet in the future.
            </h5>
            <div>
              <div className='mnemonic' id='mnemonic'></div>
            </div>
            <div id='unmaskhint'></div>

            <button type='button' className='generalbtns' onClick={this.generateMnemonic}>
              Generate Mnemonic
            </button>
            <br />
            {continu}

            <p></p>
          </div>
        </div>
      </>
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
