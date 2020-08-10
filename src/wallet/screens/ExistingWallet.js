import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import * as walletActions from '../walletActions';
import * as walletSelectors from '../walletSelectors';

class ExistingWallet extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      mnemonic: '',
    };
  }

  onContinue = () => {
    const { dispatch } = this.props;
    dispatch(walletActions.fromMnemonic(this.state.mnemonic));
  };

  render() {
    return (
      <div>
        <h3>Enter Secret Backup Phrase</h3>
        <div>
          <textarea
            rows="2"
            value={this.state.mnemonic}
            onChange={(event) =>
              this.setState({ mnemonic: event.target.value })
            }
          />
        </div>
        <button
          type="button"
          className="btn btn-primary btn-md"
          onClick={this.onContinue}
        >
          Continue
        </button>
      </div>
    );
  }
}

ExistingWallet.propTypes = {
  dispatch: PropTypes.func.isRequired,
  isLoading: PropTypes.bool.isRequired,
};

ExistingWallet.defaultProps = {};

const mapStateToProps = (state) => ({
  isLoading: walletSelectors.isLoading(state),
});

export default connect(mapStateToProps)(ExistingWallet);
