import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { Button, Icon } from 'semantic-ui-react';

class Navbar extends Component {
  render() {
    const { title } = this.props;
    return (
      <>
        <div className='ui secondary menu'>
          <div className='item'>
            <Button basic circular icon onClick={this.props.onBack}>
              <Icon name='arrow up' />
            </Button>
          </div>
          <div className='item'>
            <div className='ui medium header purplefontcolor'>{title}</div>
          </div>
          {/* <div className='right menu'>
            <div className='item'>
              <Button
                basic
                circular
                icon
                onClick={
                  this.props.onClose;
                }>
                <Icon name='close' />
              </Button>
            </div>
          </div> */}
        </div>
      </>
    );
  }
}

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
