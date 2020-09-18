import React from 'react';
import { Link, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { Grid, Form, Button } from 'semantic-ui-react';
import Authenticator from '../modules/Authenticator';

class GlobalSettings extends React.Component {
  constructor(props) {
    super(props);
    this.state = { newNexaIP: '', newPortNumber: '' };
  }

  onSubmit = async () => {
    localStorage.setItem('hostname', this.state.newNexaIP);
    localStorage.setItem('port', this.state.newPortNumber);
    Authenticator.httpsauth(localStorage.getItem('username'), localStorage.getItem('password'));
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

export default withRouter(connect(mapStateToProps)(GlobalSettings));
