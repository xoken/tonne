import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { generateMnemonic } from '../walletActions';
import { isLoading, getMnemonic } from '../walletSelectors';

class NewWallet extends React.Component {
  generateMnemonic = () => {
    const { dispatch } = this.props;
    dispatch(generateMnemonic());
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
        <p></p>
      </div>
    );
  }
}

NewWallet.propTypes = {
  dispatch: PropTypes.func.isRequired,
  mnemonic: PropTypes.string,
};

NewWallet.defaultProps = {
  mnemonic: '',
};

const mapStateToProps = (state) => ({
  isLoading: isLoading(state),
  mnemonic: getMnemonic(state),
});

export default connect(mapStateToProps)(NewWallet);
