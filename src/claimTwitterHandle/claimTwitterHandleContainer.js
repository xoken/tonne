import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import ProgressIndicator from '../allpay/components/ProgressIndicator';
import { ClaimTwitterHandleRoutes } from './claimTwitterHandleRoutes';

class ClaimTwitterHandleContainer extends Component {
  render() {
    const { progressStep, progressTotalSteps, title } = this.props;
    return (
      <>
        <div className='ui grid' verticalAlign='middle' style={{ height: '100%' }}>
          <div className='one wide column'>
            <ProgressIndicator steps={progressTotalSteps} activeStep={progressStep} />
          </div>
          <div className='fifteen wide column' verticalAlign='middle' style={{ height: '100%' }}>
            <ClaimTwitterHandleRoutes />
          </div>
        </div>
      </>
    );
  }
}

ClaimTwitterHandleContainer.defaultProps = {
  title: '',
  progressTotalSteps: 1,
};

ClaimTwitterHandleContainer.propTypes = {
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

export default withRouter(connect(mapStateToProps)(ClaimTwitterHandleContainer));
