import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, css } from 'aphrodite';

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
      <li key={'Progress Step ' + index} className={css(styles.progressIndicatorStep)}></li>
    ));
  }

  render() {
    const { steps, activeStep } = this.props;
    return (
      <div className={css(styles.progressIndicator)}>
        <ul className={css(styles.progressIndicatorList)}>{this.renderSteps(steps)}</ul>
        <span
          className={css(styles.progressIndicatorFill)}
          style={{ height: this.activeHeight(activeStep) }}></span>
      </div>
    );
  }
}

const styles = StyleSheet.create({
  progressIndicator: {
    position: 'relative',
  },
  progressIndicatorList: {
    listStyle: 'none',
    margin: 0,
    padding: 0,
  },
  progressIndicatorStep: {
    width: stepIndicatorSize,
    height: stepIndicatorSize,
    backgroundColor: '#F1F1F1',
    borderRadius: 20,
    marginBottom: stepSpacing,
  },
  progressIndicatorFill: {
    display: 'block',
    position: 'absolute',
    top: 0,
    left: 0,
    width: stepIndicatorSize,
    height: stepIndicatorSize,
    borderRadius: 100,
    backgroundColor: '#FBBD08',
    transition: 'height 0.25s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
  },
});

ProgressIndicator.defaultProps = {
  activeStep: 1,
};
ProgressIndicator.propTypes = {
  steps: PropTypes.number.isRequired,
  activeStep: PropTypes.number,
};
