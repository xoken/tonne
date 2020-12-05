import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { Button, Form, Grid, Header, Input } from 'semantic-ui-react';
import * as allpayActions from '../allpayActions';
import { wallet } from 'nipkow-sdk';

class ProxyRegistration extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      addressCount: 10,
      unregisteredNames: [],
    };
  }

  async componentDidMount() {
    const { names } = await wallet.getUnregisteredName();
    const unregisteredNames = names.map(unregisteredName => ({
      text: unregisteredName,
      value: unregisteredName,
    }));
    this.setState({ unregisteredNames });
  }

  onRegister = async () => {
    const { name, addressCount } = this.state;
    const { dispatch } = this.props;
    try {
      await dispatch(allpayActions.registerName({ name, addressCount }));
      this.props.history.push('/wallet/allpay/render/transaction');
    } catch (error) {
      console.log(error);
    }
  };

  renderMessage() {
    return null;
  }

  render() {
    const { unregisteredNames, addressCount } = this.state;
    return (
      <>
        <Header as='h2' textAlign='center'>
          Register Allpay name
        </Header>
        <div className='ui grid'>
          <div className='ten wide column centered row'>
            <div className='column'>
              <Grid>
                <Grid.Row>
                  <Grid.Column width={4} verticalAlign='middle'>
                    Name
                  </Grid.Column>
                  <Grid.Column width={6}>
                    <Form.Select
                      options={unregisteredNames}
                      placeholder='Allegory Name'
                      onChange={(e, { value }) => this.setState({ name: value })}
                    />
                  </Grid.Column>
                </Grid.Row>
                <Grid.Row>
                  <Grid.Column width={4} verticalAlign='middle'>
                    No of Address
                  </Grid.Column>
                  <Grid.Column width={6}>
                    <Input
                      type='number'
                      className='form-control'
                      value={addressCount}
                      onChange={event => this.setState({ addressCount: event.target.value })}
                    />
                  </Grid.Column>
                </Grid.Row>
                <Grid.Row>
                  <Grid.Column width={4}></Grid.Column>
                  <Grid.Column width={6}>
                    <Button color='yellow' onClick={this.onRegister}>
                      Register
                    </Button>
                  </Grid.Column>
                </Grid.Row>
                <Grid.Row>
                  <Grid.Column width={16}>{this.renderMessage()}</Grid.Column>
                </Grid.Row>
              </Grid>
            </div>
          </div>
        </div>
      </>
    );
  }
}

const mapStateToProps = state => ({});

export default withRouter(connect(mapStateToProps)(ProxyRegistration));
