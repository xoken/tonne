import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, css } from 'aphrodite/no-important';

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
        className={`progress-indicator-step ${css(styles.progressIndicatorStep)}`}></li>
    ));
  }

  render() {
    const { steps, activeStep } = this.props;
    return (
      <div className='progress-indicator'>
        <ul className='progress-indicator-list'>{this.renderSteps(steps)}</ul>
        <span
          className={`progress-indicator-fill ${css(styles.progressIndicatorFill)}`}
          style={{ height: this.activeHeight(activeStep) }}></span>
      </div>
    );
  }
}

const styles = StyleSheet.create({
  progressIndicatorStep: {
    width: stepIndicatorSize,
    height: stepIndicatorSize,
  },
  progressIndicatorFill: {
    width: stepIndicatorSize,
    height: stepIndicatorSize,
  },
});

ProgressIndicator.defaultProps = {
  activeStep: 1,
};
ProgressIndicator.propTypes = {
  steps: PropTypes.number.isRequired,
  activeStep: PropTypes.number,
};
