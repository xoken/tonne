import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { Button, Form, Radio, Header, Input } from 'semantic-ui-react';
import * as allpayActions from '../allpayActions';
import { wallet } from 'nipkow-sdk';

class NameRegistration extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      registerNameWithProxy: true,
    };
    this.onChangeValue = this.onChangeValue.bind(this);
    this.onContinue = this.onContinue.bind(this);
    this.onExit = this.onExit.bind(this);
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch(
      allpayActions.updateScreenProps({
        title: 'Name Purchase Successful',
        activeStep: 3,
      })
    );
  }

  onChangeValue(_, { value }) {
    if (value === 'True') {
      this.setState({ registerNameWithProxy: true });
    } else if (value === 'False') {
      this.setState({ registerNameWithProxy: false });
    }
  }

  onContinue() {
    this.props.history.push('/wallet/allpay/register');
  }

  onExit() {
    const { dispatch, history } = this.props;
    dispatch(allpayActions.resetAllpay());
    history.push('/wallet/dashboard');
  }

  renderActionButton() {
    if (this.state.registerNameWithProxy) {
      return (
        <Button color='yellow' onClick={this.onContinue}>
          Continue
        </Button>
      );
    } else {
      return (
        <Button color='yellow' onClick={this.onExit}>
          Exit
        </Button>
      );
    }
  }

  render() {
    return (
      <Form>
        <Form.Field>
          <Radio
            label='I would like to register with proxy provider'
            name='radioGroup'
            value='True'
            checked={this.state.registerNameWithProxy === true}
            onChange={this.onChangeValue}
          />
        </Form.Field>
        <Form.Field>
          <Radio
            label='Register with Proxy later'
            name='radioGroup'
            value='False'
            checked={this.state.registerNameWithProxy === false}
            onChange={this.onChangeValue}
          />
        </Form.Field>
        {this.renderActionButton()}
      </Form>
    );
  }
}

const mapStateToProps = state => ({});

export default withRouter(connect(mapStateToProps)(NameRegistration));
