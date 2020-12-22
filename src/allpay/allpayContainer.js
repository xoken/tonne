import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import ProgressIndicator from './components/ProgressIndicator';
import { AllpayRoutes } from './allpayRoutes';
import Navbar from './components/Navbar';

class AllpayContainer extends Component {
  render() {
    const { progressStep, progressTotalSteps, title } = this.props;
    return (
      <>
        <Navbar title={title || ''} />
        <div className='ui grid'>
          <div className='one wide column'>
            <ProgressIndicator steps={progressTotalSteps} activeStep={progressStep} />
          </div>
          <div className='fifteen wide column'>
            <AllpayRoutes />
          </div>
        </div>
      </>
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
