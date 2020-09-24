import React from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { Grid, Form, Button, Message } from 'semantic-ui-react';
import * as settingsActions from '../settingsActions';

class SettingsScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      nexaHost: '',
      nexaPort: '',
      userName: '',
      password: '',
      hasError: false,
      message: '',
      isValidSettings: false,
    };
  }

  onSubmit = async () => {
    const { dispatch } = this.props;
    const { nexaHost, nexaPort, userName, password } = this.state;
    if (nexaHost && nexaPort && userName && password) {
      try {
        await dispatch(settingsActions.changeConfig(nexaHost, nexaPort, userName, password));
        this.setState({ hasError: false, message: 'Success! New settings applied' });
      } catch (error) {
        dispatch(settingsActions.initHttp());
        this.setState({ hasError: true, message: error.message });
      }
    } else {
      this.setState({ hasError: true, message: 'Please enter all required field' });
    }
  };

  onTestConnection = async () => {
    const { dispatch } = this.props;
    const { nexaHost, nexaPort, userName, password } = this.state;
    if (nexaHost && nexaPort && userName && password) {
      try {
        await dispatch(settingsActions.testConfig(nexaHost, nexaPort, userName, password));
        dispatch(settingsActions.initHttp());
        this.setState({
          hasError: false,
          isValidSettings: true,
          message: 'Connection test successful! Click the Save button to save your settings',
        });
      } catch (error) {
        dispatch(settingsActions.initHttp());
        this.setState({ hasError: true, message: error.message });
      }
    } else {
      this.setState({ hasError: true, message: 'Please enter all required field' });
    }
  };

  renderError() {
    const { hasError, message } = this.state;
    if (message) {
      return <Message success={!hasError} error={hasError} content={message} />;
    }
  }

  render() {
    const { nexaHost, nexaPort, userName, password, hasError, isValidSettings } = this.state;
    return (
      <>
        <div className='ui segment'>
          <Grid centered>
            <Grid.Row centered columns={2}>
              <Grid.Column>
                <Form success={!hasError} error={hasError}>
                  <h4 className='ui dividing header'>Nipkow Settings</h4>
                  <Form.Field required>
                    <label>Enter Nexa IP Address or hostname</label>
                    <input
                      placeholder='0.0.0.0 or www.example.com'
                      value={nexaHost}
                      onChange={event => this.setState({ nexaHost: event.target.value })}
                    />
                  </Form.Field>
                  <Form.Field required>
                    <label>Enter Port Number</label>
                    <input
                      placeholder='0000'
                      value={nexaPort}
                      onChange={event => this.setState({ nexaPort: event.target.value })}
                    />
                  </Form.Field>
                  <Form.Field required>
                    <label>Enter Username</label>
                    <input
                      placeholder='Nexa Username'
                      value={userName}
                      onChange={event => this.setState({ userName: event.target.value })}
                    />
                  </Form.Field>
                  <Form.Field required>
                    <label>Enter Password</label>
                    <input
                      type='password'
                      placeholder='Nexa Password'
                      value={password}
                      onChange={event => this.setState({ password: event.target.value })}
                    />
                  </Form.Field>
                  {this.renderError()}
                  <Button color='yellow' onClick={this.onTestConnection}>
                    Test Connection
                  </Button>
                  <Button color='yellow' disabled={!isValidSettings} onClick={this.onSubmit}>
                    Save
                  </Button>
                </Form>
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </div>
      </>
    );
  }
}

const mapStateToProps = state => ({});

export default withRouter(connect(mapStateToProps)(SettingsScreen));
