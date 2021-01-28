import React from 'react';
import PropTypes from 'prop-types';

const stepSpacing = 5;
const stepIndicatorSize = 10;

export default class ProgressIndicator extends React.Component {
  activeHeight(step) {
    return step * stepIndicatorSize + (step - 1) * stepSpacing;
  }

  renderSteps(steps) {
    return Array.apply(null, {
      length: steps,
    }).map((step, index) => (
      <li
        key={'Progress Step ' + index}
        className='progress-indicator-step progressIndicatorStep'></li>
    ));
  }

  render() {
    const { steps, activeStep } = this.props;
    return (
      <div className='progress-indicator'>
        <ul className='progress-indicator-list'>{this.renderSteps(steps)}</ul>
        <span
          className='progress-indicator-fill progressIndicatorFill'
          style={{ height: this.activeHeight(activeStep) }}></span>
      </div>
    );
  }
}

ProgressIndicator.defaultProps = {
  activeStep: 1,
};
ProgressIndicator.propTypes = {
  steps: PropTypes.number.isRequired,
  activeStep: PropTypes.number,
};
