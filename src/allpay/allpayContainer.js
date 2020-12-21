import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter, Switch, Route } from 'react-router-dom';
import { connect } from 'react-redux';
import ProgressIndicator from './components/ProgressIndicator';
import { AllpayRoutes, allpayPaths } from './allpayRoutes';
import Navbar from './components/Navbar';
import { StyleSheet, css } from 'aphrodite';
// import { globalStyles } from 'shared/styles';

class AllpayContainer extends Component {
  render() {
    const { progressStep, progressTotalSteps, screenTitle } = this.props;
    return (
      <>
        <Navbar title={screenTitle || 'Screen Title'} />
        <div className={css(styles.contentContainer)}>
          <Switch>
            <Route
              path={allpayPaths.test}
              render={() => {
                return (
                  <div className={css(styles.slidingLayoutContainer)}>
                    <div className={css(styles.progressContainer)}>
                      <div className={css(styles.progress)}>
                        <ProgressIndicator steps={progressTotalSteps} activeStep={progressStep} />
                      </div>
                    </div>
                    <div className={css(styles.layoutContainer)}>
                      <AllpayRoutes />
                    </div>
                  </div>
                );
              }}
            />
          </Switch>
        </div>
      </>
    );
  }
}

const styles = StyleSheet.create({
  contentContainer: {
    paddingTop: 72,
  },
  layoutContainer: {
    marginLeft: 56,
    //   marginLeft: 64,
    //   width: 720,
  },
  progress: {
    position: 'fixed',
  },
  progressContainer: {
    position: 'relative',
    width: 48,
    justifyContent: 'center',
    display: 'flex',
  },
  coveragesLayoutContainer: {
    maxWidth: 1264,
    margin: '0 auto',
  },
  slidingLayoutContainer: {
    maxWidth: 1200,
    paddingLeft: 16,
    paddingRight: 16,
    paddingTop: 40,
    margin: '0 auto',
    //   paddingLeft: 32,
    //   paddingRight: 32,
  },
  bannerContainerLayout: {
    zIndex: 99,
    paddingLeft: 16,
    paddingRight: 16,
    margin: '0 auto',
    position: 'relative',
    display: 'flex',
    justifyContent: 'center',
    backgroundColor: '#F8F8F8',
    //   paddingLeft: 32,
    //   paddingRight: 32,
  },
  modalIconContainer: {
    alignItems: 'flex-start',
    display: 'flex',
    justifyContent: 'center',
  },
});

AllpayContainer.defaultProps = {
  screenTitle: '',
  progressTotalSteps: 1,
};

AllpayContainer.propTypes = {
  progressStep: PropTypes.number.isRequired,
  screenTitle: PropTypes.string,
  progressTotalSteps: PropTypes.number,
  history: PropTypes.shape({}).isRequired,
};

const mapStateToProps = state => ({
  progressStep: 0,
  progressTotalSteps: 5,
  screenTitle: 'Test',
});

export default withRouter(connect(mapStateToProps)(AllpayContainer));
