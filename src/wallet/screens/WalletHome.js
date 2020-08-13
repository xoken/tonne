import React from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import * as walletActions from "../walletActions";
import * as walletSelectors from "../walletSelectors";
import bsvlogo from "../../shared/images/bsv.png";

class WalletHome extends React.Component {
  constructor(props) {
    super(props);
    this.handleSendCurClick = this.handleSendCurClick.bind(this);
    this.handleSendCurCloseClick = this.handleSendCurCloseClick.bind(this);
    this.state = { sendCurPopOpen: false };
  }
  handleSendCurClick() {
    this.setState({ sendCurPopOpen: true });
  }

  handleSendCurCloseClick() {
    this.setState({ sendCurPopOpen: false });
  }
  onBack = () => {
    this.props.history.goBack();
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch(walletActions.getCurrentBalance());

    dispatch(walletActions.getAllTx());
  }

  render() {
    const allprops = this.props;
    let pop;
    const sendCurPopOpen = this.state.sendCurPopOpen;
    if (sendCurPopOpen) {
      pop = (
        <Popopen
          class="pop popopen"
          closefunction={this.handleSendCurCloseClick.bind(this)}
        />
      );
    } else {
      pop = <Popclose />;
    }
    return (
      <>
        {pop}
        <div className="container nonheader">
          <div className="row">
            <div className="col-lg-12 col-md-12 col-sm-12 border-left-right">
              <center>
                <div className="cryptologo">
                  <img src={bsvlogo} alt="" />
                </div>
                <h5>Your Current Balance is</h5>
                <h4>{allprops.currentBalance} BSV</h4>
                <div className="txbtn" onClick={this.handleSendCurClick}>
                  Send
                </div>
              </center>
            </div>
          </div>

          <div className="row">
            <div className="col-md-12 col-lg-12">
              <table id="txlist"></table>
              {allprops.allTx}
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
        <button type="button" className="btn btn-primary" onClick={this.onBack}>
          Back
        </button>
      </>
    );
  }
}
function Popopen(props) {
  return <SendCur class={props.class} closefunction={props.closefunction} />;
}
function Popclose(props) {
  return <i></i>;
}
class SendCur extends React.Component {
  render() {
    return (
      <div className={this.props.class}>
        <div className="container">
          <span className="closepop" onClick={this.props.closefunction}>
            X
          </span>
          <div className="form-group popupcontent">
            <label for="receiveraddress">
              <h5>Send BSV to the Address</h5>
            </label>
            <input
              type="text"
              className="form-input"
              id="receiveraddress"
              placeholder="1xxxxxxxxxxxxxxxxxxxxxxxx"
            />
            <div className="txbtn" onClick={confirmSend}>
              Confirm
            </div>
          </div>
        </div>
      </div>
    );
  }
}
function confirmSend() {}

WalletHome.propTypes = {
  dispatch: PropTypes.func.isRequired,
  isLoading: PropTypes.bool.isRequired,
  currentBalance: PropTypes.number.isRequired,
  allTx: PropTypes.string.isRequired,
};

WalletHome.defaultProps = {};

const mapStateToProps = (state) => ({
  isLoading: walletSelectors.isLoading(state),
  currentBalance: walletSelectors.getCurrentBalance(state),
  allTx: walletSelectors.getAllTx(state),
});

export default connect(mapStateToProps)(WalletHome);
