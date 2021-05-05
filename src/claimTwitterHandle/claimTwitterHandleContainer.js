import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import Navbar from '../shared/components/Navbar';
import ProgressIndicator from '../shared/components/ProgressIndicator';
import { ClaimTwitterHandleRoutes } from './claimTwitterHandleRoutes';
import { decrementFlow } from './claimTwitterHandleActions';

class ClaimTwitterHandleContainer extends Component {
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
            <ClaimTwitterHandleRoutes />
          </div>
        </div>
      </div>
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
  progressStep: state.twitter.ui.activeStep,
  progressTotalSteps: state.twitter.ui.progressTotalSteps,
  title: state.twitter.ui.title,
});

export default withRouter(connect(mapStateToProps)(ClaimTwitterHandleContainer));
