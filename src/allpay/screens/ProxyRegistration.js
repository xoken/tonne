import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import {
  Button,
  Checkbox,
  Form,
  Grid,
  Header,
  Input,
  Message,
  Modal,
  Segment,
} from 'semantic-ui-react';
import * as allpayActions from '../allpayActions';
import * as walletActions from '../../wallet/walletActions';
import { utils } from 'allegory-allpay-sdk';

class ProxyRegistration extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedProxyProvider: undefined,
      addressCount: process.env.REACT_APP_PROXY_DEFAULT_ADDRESS_COUNT || 64,
      unregisteredNames: [],
      showRegistrationOptions: this.props.outpoint?.name ? false : true,
      name: this.props.outpoint?.name || [],
      proxyProviders: [{ name: 'Xoken Proxy Provider', proxyURI: process.env.REACT_APP_PROXY_URI }],
      skipRegistrationModal: false,
      message: '',
      isError: false,
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
          activeStep: 3,
        })
      );
    }
    this.setState({
      selectedProxyProvider: this.state.proxyProviders[0],
    });
    const { names } = await dispatch(walletActions.getUnregisteredNames());
    const unregisteredNames = names.map(unregisteredName => ({
      text: unregisteredName,
      value: unregisteredName,
    }));
    this.setState({ unregisteredNames });
    if (this.state.name.length === 0 && unregisteredNames.length > 0) {
      const nameCodePoint = utils.getCodePoint(unregisteredNames[0].value);
      this.setState({ name: nameCodePoint });
      dispatch(allpayActions.setName({ name: nameCodePoint }));
    }
  }

  onRegister = async () => {
    const {
      selectedProxyProvider: { proxyURI },
      name,
      addressCount,
    } = this.state;
    if (name.length > 0) {
      const { dispatch } = this.props;
      try {
        await dispatch(
          allpayActions.registerName({
            proxyURI,
            name: utils.codePointToName(name),
            addressCount,
          })
        );
        this.props.history.push('/wallet/allpay/register-success');
      } catch (error) {
        this.setState({
          isError: true,
          message: error.response && error.response.data ? error.response.data : error.message,
        });
      }
    } else {
      this.setState({ isError: true, message: 'Please select a name to register' });
    }
  };

  onToggle = () => {
    const { skipRegistrationModal } = this.state;
    this.setState({
      skipRegistrationModal: !skipRegistrationModal,
    });
  };

  onSkipAnyWay = () => {
    this.props.history.push('/wallet');
  };

  onSelect = proxyProvider => async () => {
    this.setState({
      selectedProxyProvider: proxyProvider,
    });
  };

  renderMessage() {
    const { isError, message } = this.state;
    if (message) {
      return (
        <Grid.Row>
          <Grid.Column>
            <Message positive={!isError} negative={isError}>
              {message}
            </Message>
          </Grid.Column>
        </Grid.Row>
      );
    }
  }

  renderHeader() {
    const { name, selectedProxyProvider } = this.state;
    return (
      <>
        <Header as='h3' textAlign='center' className='word-wrap'>
          Register{' '}
          {name.length > 0 ? (
            <span className='purplefontcolor'>{utils.codePointToName(name)} </span>
          ) : (
            <span className='purplefontcolor'>name</span>
          )}{' '}
          with AllPay service provider{' '}
          {selectedProxyProvider && (
            <span className='purplefontcolor'>{selectedProxyProvider.name}</span>
          )}
        </Header>
        <Header textAlign='center'>
          <Header.Subheader>
            The proxy generates provably correct Bitcoin addresses on your behalf. The AllPay
            protocol is completely trustless and secure.
          </Header.Subheader>
        </Header>
      </>
    );
  }

  renderRegistrationOption() {
    const { dispatch } = this.props;
    const { showRegistrationOptions, unregisteredNames } = this.state;
    if (showRegistrationOptions) {
      const { addressCount } = this.state;
      return (
        <>
          <Grid.Row>
            <Grid.Column width={3} verticalAlign='middle'>
              Name
            </Grid.Column>
            <Grid.Column width={6}>
              <Form.Select
                options={unregisteredNames}
                placeholder='Allegory Name'
                value={utils.codePointToName(this.state.name)}
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
          {this.renderProxyProviders()}
        </>
      );
    }
    return null;
  }

  renderProxyProviders() {
    const { selectedProxyProvider, proxyProviders } = this.state;
    return (
      <Grid.Row>
        <Grid.Column>
          {proxyProviders.map((proxyProvider, index) => {
            const { name } = proxyProvider;
            const isSelected = selectedProxyProvider?.name === name;
            return (
              <Segment key={index.toString()}>
                <Grid stackable>
                  <Grid.Row>
                    <Grid.Column width='13' verticalAlign='middle'>
                      <Header as='h4'>{name}</Header>
                    </Grid.Column>
                    <Grid.Column width='3'>
                      <div className='ui form'>
                        <div className='field'>
                          <Button
                            disabled={isSelected}
                            fluid
                            className='coral'
                            onClick={this.onSelect(proxyProvider)}>
                            {isSelected ? 'Selected' : 'Select'}
                          </Button>
                        </div>
                      </div>
                    </Grid.Column>
                  </Grid.Row>
                </Grid>
              </Segment>
            );
          })}
        </Grid.Column>
      </Grid.Row>
    );
  }

  renderSkipModal() {
    const { skipRegistrationModal } = this.state;
    return (
      <Modal open={skipRegistrationModal}>
        <Modal.Content>
          <Modal.Description>
            <p>
              If you skip you will not be able to receive BitcoinSV by AllPay name. Click Cancel to
              proceed with proxy registration.
            </p>
          </Modal.Description>
        </Modal.Content>
        <Modal.Actions>
          <Button className='coral' onClick={this.onToggle}>
            Cancel
          </Button>
          <Button basic className='borderless' onClick={this.onSkipAnyWay}>
            Skip Anyway
          </Button>
        </Modal.Actions>
      </Modal>
    );
  }

  render() {
    const { requestInProgress } = this.props;
    const { showRegistrationOptions } = this.state;
    return (
      <>
        <Grid stackable>
          <Grid.Row>
            <Grid.Column>{this.renderHeader()}</Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <Grid.Column textAlign='center'>
              <Checkbox
                toggle
                label={`${showRegistrationOptions ? 'Hide' : 'Show'} Advanced Options`}
                onClick={() =>
                  this.setState({
                    showRegistrationOptions: !showRegistrationOptions,
                  })
                }
                checked={showRegistrationOptions}
              />
            </Grid.Column>
          </Grid.Row>
          {this.renderRegistrationOption()}
          <Grid.Row>
            <Grid.Column width='16' textAlign='center'>
              <Button className='coral' loading={requestInProgress} onClick={this.onRegister}>
                Register
              </Button>
              <Button basic className='borderless' onClick={this.onToggle}>
                Skip
              </Button>
            </Grid.Column>
          </Grid.Row>
          {this.renderMessage()}
        </Grid>
        {this.renderSkipModal()}
      </>
    );
  }
}

const mapStateToProps = state => ({
  requestInProgress: state.allpay.requestInProgress,
  outpoint: state.allpay.outpoint,
});

export default withRouter(connect(mapStateToProps)(ProxyRegistration));
