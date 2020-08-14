import React from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import * as walletActions from "../walletActions";
import * as walletSelectors from "../walletSelectors";

class NewWallet extends React.Component {
  generateMnemonic = () => {
    const { dispatch } = this.props;
    dispatch(walletActions.initWallet());
  };

  onContinue = () => {
    this.props.history.push("/wallet/home");
  };

  render() {
    return (
      <div className="container nonheader">
        <div className="row">
          <div className="col-lg-12 col-md-12 col-sm-12 centerall">
            <h5 className="generalheadingscolor">
              Please write down these words on a piece of paper. This seed will
              help recover your wallet in the future.
            </h5>
            <div>
              <div className="mnemonic">{this.props.bip39Mnemonic}</div>
            </div>
            <button
              type="button"
              className="generalbtns"
              onClick={this.generateMnemonic}
            >
              Generate Mnemonic
            </button>
            <br />
            <button
              type="button"
              className="generalbtns"
              onClick={this.onContinue}
            >
              Continue
            </button>
            <p></p>
          </div>
        </div>
      </div>
    );
  }
}

NewWallet.propTypes = {
  dispatch: PropTypes.func.isRequired,
  isLoading: PropTypes.bool.isRequired,
  bip39Mnemonic: PropTypes.string
};

NewWallet.defaultProps = {
  bip39Mnemonic: ""
};

const mapStateToProps = state => ({
  isLoading: walletSelectors.isLoading(state),
  bip39Mnemonic: walletSelectors.getMnemonic(state)
});

export default connect(mapStateToProps)(NewWallet);
