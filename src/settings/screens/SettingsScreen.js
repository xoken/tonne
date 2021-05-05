import React from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { Grid, Form, Button, Message, Segment } from 'semantic-ui-react';
import * as settingsActions from '../settingsActions';

class SettingsScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      nexaURI: '',
      userName: '',
      password: '',
      hasError: false,
      message: '',
      isValidSettings: false,
    };
  }

  onSubmit = async () => {
    const { dispatch } = this.props;
    const { nexaURI, userName, password } = this.state;
    if (nexaURI && userName && password) {
      try {
        await dispatch(settingsActions.changeConfig(nexaURI, userName, password));
        this.setState({ hasError: false, message: 'Success! New settings applied' });
      } catch (error) {
        this.setState({ hasError: true, message: error.message });
      }
    } else {
      this.setState({ hasError: true, message: 'Please enter all required field' });
    }
  };

  onTestConnection = async () => {
    const { dispatch } = this.props;
    const { nexaURI, userName, password } = this.state;
    if (nexaURI && userName && password) {
      try {
        await dispatch(settingsActions.testConfig(nexaURI, userName, password));
        this.setState({
          hasError: false,
          isValidSettings: true,
          message: 'Connection test successful! Click the Save button to save your settings',
        });
      } catch (error) {
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
    const { nexaURI, userName, password, hasError, isValidSettings } = this.state;
    return (
      <Grid centered verticalAlign='middle' style={{ height: '100%' }}>
        <Grid.Row columns={2}>
          <Grid.Column>
            <Segment>
              <Form success={!hasError} error={hasError}>
                <h4 className='ui dividing header'>Tonne Settings</h4>
                <Form.Field required>
                  <label>Enter Nexa URL</label>
                  <input
                    placeholder='example.com'
                    value={nexaURI}
                    onChange={event => this.setState({ nexaURI: event.target.value })}
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
                <Button className='coral' onClick={this.onTestConnection}>
                  Test Connection
                </Button>
                <Button className='coral' disabled={!isValidSettings} onClick={this.onSubmit}>
                  Save
                </Button>
              </Form>
            </Segment>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    );
  }
}

const mapStateToProps = state => ({});

export default withRouter(connect(mapStateToProps)(SettingsScreen));
