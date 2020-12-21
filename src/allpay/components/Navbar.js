import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { Button } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { decrementFlow, resetAllpay } from '../allpayActions';
import { StyleSheet, css } from 'aphrodite';
// import { dispatchModal } from '../../actions/modalActions';

class Navbar extends Component {
  closeAllpay() {
    this.props.dispatch(resetAllpay());
    this.props.history.push('/auth');
  }
  render() {
    const { title, dispatch, history } = this.props;

    return (
      <div className={css(styles.nav)}>
        <div className={css(styles.container)}>
          <div className={css(styles.navBarHeight)}>
            <div className={css(styles.navBarSection)}>
              <Button
                icon='angle up'
                onClick={() => {
                  dispatch(decrementFlow(history));
                }}
              />
              <h1 className={css(styles.navBarTitle)}>{title}</h1>
            </div>
            <div className={css(styles.navBarAction)}>
              <Button
                style={{ marginLeft: 4 }}
                icon='close'
                onClick={() => {
                  this.closeAllpay();
                }}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const styles = StyleSheet.create({
  nav: {
    position: 'fixed',
    height: 72,
    width: '100vw',
    left: 0,
    top: 0,
    zIndex: 100,
    borderBottomStyle: 'solid',
    borderBottomWidth: 2,
    borderBottomColor: '#E1E1E1',
    backgroundColor: '#FFFFFF',
  },
  container: {
    maxWidth: 1200,
    paddingLeft: 16,
    paddingRight: 16,
    margin: '0 auto',
    // [common.mediaQuery.minSm]: {
    // paddingLeft: 32,
    // paddingRight: 32,
    // },
  },
  navBarHeight: {
    height: 72,
    display: 'flex',
    // [common.mediaQuery.minMd]: {
    position: 'relative',
    width: '100%',
    maxWidth: 1200,
    // height: NAVBAR_HEIGHTS.desktop,
    // },
  },
  navBarSection: {
    alignItems: 'center',
    display: 'flex',
    justifyContent: 'space-between',
  },
  navBarTitle: {
    fontSize: '24px',
    lineHeight: '30px',
    fontWeight: 500,
    display: 'inline-block',
    margin: 16,
    width: 'auto',
  },
  navBarAction: {
    alignItems: 'center',
    display: 'flex',
    justifyContent: 'space-between',
    marginLeft: 'auto',
  },
});

Navbar.defaultProps = {};

Navbar.propTypes = {
  dispatch: PropTypes.func.isRequired,
  history: PropTypes.shape({
    goBack: PropTypes.func.isRequired,
    push: PropTypes.func.isRequired,
  }).isRequired,
  location: PropTypes.shape({}).isRequired,
  title: PropTypes.string.isRequired,
};

const mapStateToProps = () => ({});

export default withRouter(connect(mapStateToProps)(Navbar));
