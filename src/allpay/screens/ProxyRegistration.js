import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { Button, Form, Grid, Header, Input, Checkbox } from 'semantic-ui-react';
import * as allpayActions from '../allpayActions';
import { wallet, utils } from 'allegory-allpay-sdk';

class ProxyRegistration extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      proxyProvider: undefined,
      addressCount: 10,
      unregisteredNames: [],
      showProxyProviders: false,
      defaultProxy: true,
      showRegistrationOptions: false,
      name: this.props.outpoint?.name || [],
      proxyProviders: [
        { name: 'Proxy Provider 1', proxyHost: '127.0.0.1', proxyPort: 8000 },
        { name: 'Proxy Provider 2', proxyHost: '127.0.0.1', proxyPort: 8000 },
        { name: 'Proxy Provider 3', proxyHost: '127.0.0.1', proxyPort: 8000 },
      ],
    };
  }

  async componentDidMount() {
    const {
      dispatch,
      location: { search },
    } = this.props;
    const queryParams = new URLSearchParams(search);
    const progressTotalSteps = queryParams.get('progressTotalSteps');
    const activeStep = queryParams.get('activeStep');
    if (progressTotalSteps && activeStep) {
      dispatch(
        allpayActions.updateScreenProps({
          progressTotalSteps: Number(progressTotalSteps),
          activeStep: Number(activeStep),
        })
      );
    } else {
      dispatch(
        allpayActions.updateScreenProps({
          activeStep: 4,
        })
      );
    }
    this.setState({
      proxyProvider: this.state.proxyProviders[0],
    });
    const { names } = await wallet.getUnregisteredName();
    const unregisteredNames = names.map(unregisteredName => ({
      text: unregisteredName,
      value: unregisteredName,
    }));
    this.setState({ unregisteredNames });
  }

  onRegister = async () => {
    const {
      proxyProvider: { proxyHost, proxyPort },
      name,
      addressCount,
    } = this.state;
    if (name.length > 0) {
      const { dispatch } = this.props;
      try {
        await dispatch(
          allpayActions.registerName({
            proxyHost,
            proxyPort,
            name: utils.codePointToName(name),
            addressCount,
          })
        );
        this.props.history.push('/wallet/allpay/confirm-register');
      } catch (error) {
        this.setState({ isError: true, message: error.message });
      }
    } else {
      this.setState({ isError: true, message: 'Please select a name to register' });
    }
  };

  onSelect = proxyProvider => async () => {
    this.setState({
      proxyProvider: proxyProvider,
      defaultProxy: false,
    });
  };

  renderMessage() {
    const { isError, message } = this.state;
    if (message) {
      if (isError) {
        return (
          <div className='ui negative message'>
            <p>{message}</p>
          </div>
        );
      } else {
        return (
          <div className='ui success message'>
            <p>{message}</p>
          </div>
        );
      }
    }
  }

  renderProxyProviders() {
    const { showProxyProviders, proxyProviders } = this.state;
    if (showProxyProviders) {
      return proxyProviders.map((proxyProvider, index) => {
        const { name } = proxyProvider;
        return (
          <div key={index.toString()} className='ui clearing segment'>
            <div className='ui grid'>
              <div className='row'>
                <div className='nine wide middle aligned column'>
                  <h4 className='ui header'>{name}</h4>
                </div>
                <div className='seven wide middle aligned column'>
                  <div className='ui grid'>
                    <div className='six wide column middle aligned'></div>
                    <div className='ten wide column'>
                      <div className='ui form'>
                        <div className='field'>
                          <Button fluid className='coral' onClick={this.onSelect(proxyProvider)}>
                            Select
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      });
    }
  }
  headerRegistrationMessage = () => {
    const { name, defaultProxy, proxyProvider } = this.state;
    if (defaultProxy) {
      return (
        <>
          Register {name.length > 0 ? utils.codePointToName(name) : 'name'} with default AllPay
          service provider.
        </>
      );
    } else {
      return (
        <>
          Register {name.length > 0 ? utils.codePointToName(name) : 'name'} with AllPay service
          provider {proxyProvider && proxyProvider.name}
        </>
      );
    }
  };

  renderRegistrationOption() {
    const { dispatch } = this.props;
    const { showRegistrationOptions, unregisteredNames } = this.state;
    if (showRegistrationOptions) {
      const { addressCount } = this.state;
      return (
        <div className='ui grid'>
          <div className='sixteen wide column'>
            <Grid>
              <Grid.Row>
                <Grid.Column width={3} verticalAlign='middle'>
                  Name
                </Grid.Column>
                <Grid.Column width={6}>
                  <Form.Select
                    options={unregisteredNames}
                    placeholder='Allegory Name'
                    onChange={(e, { value }) => {
                      const nameCodePoint = utils.getCodePoint(value);
                      this.setState({ name: nameCodePoint });
                      dispatch(allpayActions.setName({ name: nameCodePoint }));
                    }}
                  />
                </Grid.Column>
              </Grid.Row>
              <Grid.Row>
                <Grid.Column width={3} verticalAlign='middle'>
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
            </Grid>
          </div>
        </div>
      );
    }
    return null;
  }

  render() {
    const { name, proxyProvider, showRegistrationOptions, showProxyProviders } = this.state;
    return (
      <>
        <Grid>
          <Grid.Row>
            <Grid.Column width='16' textAlign='center'>
              <Header as='h4'>{this.headerRegistrationMessage()}</Header>
            </Grid.Column>
          </Grid.Row>
          <Grid.Row className={showRegistrationOptions ? '' : 'paddtopbottom0px'}>
            <Grid.Column>
              {this.renderMessage()}
              {this.renderProxyProviders()}
              {this.renderRegistrationOption()}
            </Grid.Column>
          </Grid.Row>
        </Grid>
        <Grid>
          <Grid.Row>
            <Grid.Column width='16' textAlign='center'>
              <Checkbox
                toggle
                label={`${showRegistrationOptions ? 'Hide' : 'Show'} Advanced Options`}
                onClick={() =>
                  this.setState({
                    showRegistrationOptions: !showRegistrationOptions,
                    showProxyProviders: !showProxyProviders,
                  })
                }
                checked={showProxyProviders}
              />
            </Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <Grid.Column width='16' textAlign='center'>
              <Button className='coral' onClick={this.onRegister}>
                Register
              </Button>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </>
    );
  }
}

const mapStateToProps = state => ({
  outpoint: state.allpay.outpoint,
});

export default withRouter(connect(mapStateToProps)(ProxyRegistration));
