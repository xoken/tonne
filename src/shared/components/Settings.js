import React from 'react';
import { Link, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { Grid, Form, Button } from 'semantic-ui-react';
import { httpsauth } from '../modules/Authenticator';

class Settings extends React.Component {
  constructor(props) {
    super(props);
    this.state = { newNexaIP: '', newPortNumber: '', username: '', password: '' };
  }

  onSubmit = async () => {
    localStorage.setItem('hostname', this.state.newNexaIP);
    localStorage.setItem('port', this.state.newPortNumber);
    localStorage.setItem('username', this.state.username);
    localStorage.setItem('password', this.state.password);
    httpsauth(localStorage.getItem('username'), localStorage.getItem('password'));
    this.props.history.goBack();
  };

  render() {
    return (
      <>
        <Grid centered>
          <Grid.Row centered columns={2}>
            <Grid.Column>
              <Form>
                <Form.Field>
                  <label>Enter Nexa IP Address or hostname</label>
                  <input
                    placeholder='0.0.0.0 or www.example.com'
                    onChange={event => this.setState({ newNexaIP: event.target.value })}
                  />
                </Form.Field>
                <Form.Field>
                  <label>Enter Port Number</label>
                  <input
                    placeholder='0000'
                    onChange={event => this.setState({ newPortNumber: event.target.value })}
                  />
                </Form.Field>
                <Form.Field>
                  <label>Enter Username</label>
                  <input
                    placeholder=''
                    onChange={event => this.setState({ username: event.target.value })}
                  />
                </Form.Field>
                <Form.Field>
                  <label>Enter Password</label>
                  <input
                    type='password'
                    placeholder=''
                    onChange={event => this.setState({ password: event.target.value })}
                  />
                </Form.Field>
                <center>
                  <Button className='txbtn' onClick={this.onSubmit}>
                    Change
                  </Button>
                </center>
              </Form>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </>
    );
  }
}

const mapStateToProps = state => ({});

export default withRouter(connect(mapStateToProps)(Settings));
