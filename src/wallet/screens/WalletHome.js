import React from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import * as walletActions from "../walletActions";
import * as walletSelectors from "../walletSelectors";

class WalletHome extends React.Component {
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch(walletActions.getCurrentBalance());
  }

  render() {
    const { currentBalance } = this.props;
    return (
      <>
        <Popup />
        <div className="container nonheader">
          <div className="row">
            <div className="col-lg-12 col-md-12 col-sm-12 border-left-right">
              <center>
                <div id="cryptologo">
                  <img />
                </div>
                <h5>Your Current Balance is</h5>
                <h4>{currentBalance} BSV</h4>
                <a className="txbtn" id="sendcur">
                  Send
                </a>
              </center>
            </div>
          </div>

          <div className="row">
            <div className="col-md-12 col-lg-12">
              <table id="txlist"></table>
            </div>
          </div>
          <div className="row">
            <div className="col-md-12 col-lg-12">
              <nav aria-label="transactions navigation">
                <ul
                  className="pagination justify-content-center"
                  id="pagination"
                ></ul>
              </nav>
            </div>
          </div>
        </div>
        <div id="back"></div>
      </>
    );
  }
}

class Popup extends React.Component {
  render() {
    return (
      <div id="pop">
        <div className="container">
          <span className="closepop" onclick="popupclose();">
            X
          </span>
          <div id="popupcontent"></div>
        </div>
      </div>
    );
  }
}

WalletHome.propTypes = {
  dispatch: PropTypes.func.isRequired,
  isLoading: PropTypes.bool.isRequired,
  currentBalance: PropTypes.number.isRequired,
};

WalletHome.defaultProps = {};

const mapStateToProps = (state) => ({
  isLoading: walletSelectors.isLoading(state),
  currentBalance: walletSelectors.getCurrentBalance(state),
});

export default connect(mapStateToProps)(WalletHome);
