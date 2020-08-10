import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import * as walletActions from '../walletActions';
import * as walletSelectors from '../walletSelectors';

class WalletHome extends React.Component {
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch(walletActions.getCurrentBalance());
  }

  render() {
    const { currentBalance } = this.props;
    return (
      <>
        <h3>{currentBalance}</h3>
      </>
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
