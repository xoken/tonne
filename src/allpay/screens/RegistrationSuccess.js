import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { Button } from 'semantic-ui-react';
import * as allpayActions from '../allpayActions';

class RegistrationSuccess extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.onExit = this.onExit.bind(this);
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch(
      allpayActions.updateScreenProps({
        title: 'Registration Successful',
        activeStep: 6,
      })
    );
    setTimeout(() => {
      this.props.history.push('/wallet/dashboard');
    }, 3000);
  }

  onExit() {
    const { dispatch, history } = this.props;
    dispatch(allpayActions.resetAllpay());
    history.push('/wallet/dashboard');
  }

  renderActionButton() {
    return (
      <Button className='coral' onClick={this.onExit}>
        Close
      </Button>
    );
  }

  render() {
    return <div className='ui form'>{this.renderActionButton()}</div>;
  }
}

const mapStateToProps = state => ({});

export default withRouter(connect(mapStateToProps)(RegistrationSuccess));
