import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import * as walletActions from '../walletActions';
import * as walletSelectors from '../walletSelectors';

class NewWallet extends React.Component {
  generateMnemonic = () => {
    const { dispatch } = this.props;
    dispatch(walletActions.generateMnemonic());
  };

  onContinue = () => {
    this.props.history.push('/wallet/home');
  };

  render() {
    return (
      <div>
        <h3>Secret Backup Phrase</h3>
        <p className="lead">
          Your secret backup phrase makes it easy to back up and restore your
          account
        </p>
        <div>
          <textarea rows="2" value={this.props.mnemonic} readOnly />
        </div>
        <button
          type="button"
          className="btn btn-primary btn-md"
          onClick={this.generateMnemonic}
        >
          Generate Mnemonic
        </button>
        <button
          type="button"
          className="btn btn-primary btn-md"
          onClick={this.onContinue}
        >
          Continue
        </button>
        <p></p>
      </div>
    );
  }
}

NewWallet.propTypes = {
  dispatch: PropTypes.func.isRequired,
  isLoading: PropTypes.bool.isRequired,
  mnemonic: PropTypes.string,
};

NewWallet.defaultProps = {
  mnemonic: '',
};

const mapStateToProps = (state) => ({
  isLoading: walletSelectors.isLoading(state),
  mnemonic: walletSelectors.getMnemonic(state),
});

export default connect(mapStateToProps)(NewWallet);
