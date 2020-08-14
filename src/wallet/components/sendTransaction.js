import React from 'react';
import { connect } from 'react-redux';
import * as walletSelectors from '../walletSelectors';

class SendTransaction extends React.Component {
  render() {
    return (
      <div className={this.props.class}>
        <div className="container">
          {/*<span className="closepop" onClick={this.props.closefunction}>
            X
    </span>*/}
          <div className="form-group popupcontent">
            <label htmlFor="receiveraddress">
              <h5>Send BSV to the Address</h5>
            </label>
            <input
              type="text"
              className="form-input"
              id="receiveraddress"
              placeholder="1xxxxxxxxxxxxxxxxxxxxxxxx"
            />
            <input
              type="text"
              className="form-input"
              id="receiveraddress"
              placeholder="1xxxxxxxxxxxxxxxxxxxxxxxx"
            />
            <input
              type="text"
              className="form-input"
              id="receiveraddress"
              placeholder="1xxxxxxxxxxxxxxxxxxxxxxxx"
            />
            <div className="txbtn">Confirm</div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  isLoading: walletSelectors.isLoading(state),
});

export default connect(mapStateToProps)(SendTransaction);
