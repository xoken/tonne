import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import Navbar from '../shared/components/Navbar';
import ProgressIndicator from '../shared/components/ProgressIndicator';
import { AllpayRoutes } from './allpayRoutes';
import { decrementFlow, resetAllpay } from './allpayActions';

class AllpayContainer extends Component {
  closeAllpay() {
    const { dispatch, history } = this.props;
    dispatch(resetAllpay());
    history.push('/wallet/dashboard');
  }

  onBack = () => {
    const { dispatch, history } = this.props;
    dispatch(decrementFlow(history));
  };

  render() {
    const { progressStep, progressTotalSteps, title } = this.props;
    return (
      <div className='paddingBottom100px'>
        <Navbar title={title || ''} onBack={this.onBack} />
        <div className='ui grid stackable'>
          <div className='one wide column'>
            <ProgressIndicator steps={progressTotalSteps} activeStep={progressStep} />
          </div>
          <div className='fifteen wide column'>
            <AllpayRoutes />
          </div>
        </div>
      </div>
    );
  }
}

AllpayContainer.defaultProps = {
  title: '',
  progressTotalSteps: 1,
};

AllpayContainer.propTypes = {
  progressStep: PropTypes.number.isRequired,
  title: PropTypes.string,
  progressTotalSteps: PropTypes.number,
  history: PropTypes.shape({}).isRequired,
};

const mapStateToProps = state => ({
  progressStep: state.allpay.ui.activeStep,
  progressTotalSteps: state.allpay.ui.progressTotalSteps,
  title: state.allpay.ui.title,
});

export default withRouter(connect(mapStateToProps)(AllpayContainer));
