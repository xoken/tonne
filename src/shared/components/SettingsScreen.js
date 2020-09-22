import React from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { Grid, Form, Button, Message } from 'semantic-ui-react';
import { setConfig } from '../modules/Authenticator';

class SettingsScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      nexaHost: '127.0.0.1',
      nexaPort: '9091',
      username: 'admin',
      password: '1',
      hasError: false,
      message: '',
    };
  }

  onSubmit = async () => {
    const { nexaHost, nexaPort, username, password } = this.state;
    try {
      await setConfig(nexaHost, nexaPort, username, password);
      this.setState({ hasError: false, message: 'Success! New settings applied' });
    } catch (error) {
      this.setState({ hasError: true, message: error.message });
    }
  };

  renderError() {
    const { hasError, message } = this.state;
    if (message) {
      return <Message success={!hasError} error={hasError} content={message} />;
    }
  }

  render() {
    const { nexaHost, nexaPort, username, password, hasError } = this.state;
    return (
      <>
        <Grid centered>
          <Grid.Row centered columns={2}>
            <Grid.Column>
              <Form success={!hasError} error={hasError}>
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
                    placeholder='Username'
                    value={username}
                    onChange={event => this.setState({ username: event.target.value })}
                  />
                </Form.Field>
                <Form.Field required>
                  <label>Enter Password</label>
                  <input
                    type='password'
                    placeholder='Password'
                    value={password}
                    onChange={event => this.setState({ password: event.target.value })}
                  />
                </Form.Field>
                {this.renderError()}
                <Button className='txbtn' onClick={this.onSubmit}>
                  Save
                </Button>
              </Form>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </>
    );
  }
}

const mapStateToProps = state => ({});

export default withRouter(connect(mapStateToProps)(SettingsScreen));
