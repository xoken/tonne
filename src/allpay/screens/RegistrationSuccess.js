import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { Button } from 'semantic-ui-react';
import * as allpayActions from '../allpayActions';

class RegistrationSuccess extends React.Component {
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch(
      allpayActions.updateScreenProps({
        title: 'Registration Successful',
        activeStep: 4,
      })
    );
    this.timerID = setTimeout(() => {
      this.onExit();
    }, 3000);
  }

  onExit = () => {
    const { dispatch, history } = this.props;
    dispatch(allpayActions.resetAllpay());
    history.push('/wallet/dashboard');
  };

  render() {
    return (
      <div className='ui form'>
        <Button className='coral' onClick={this.onExit}>
          Close
        </Button>
      </div>
    );
  }

  componentWillUnmount() {
    clearTimeout(this.timerID);
  }
}

const mapStateToProps = state => ({});

export default withRouter(connect(mapStateToProps)(RegistrationSuccess));
