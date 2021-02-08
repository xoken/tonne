import React from 'react';
import { withRouter, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { Button, Grid, Loader, Message } from 'semantic-ui-react';
import * as allpayActions from '../../allpay/allpayActions';
import * as walletActions from '../../wallet/walletActions';
import * as claimTwitterHandleActions from '../claimTwitterHandleActions';
import * as authSelectors from '../../auth/authSelectors';
import { satoshiToBSV } from '../../shared/utils';
import { utils } from 'allegory-allpay-sdk';

class TwitterAuthHome extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      message: '',
      isError: false,
    };
  }

  async componentDidMount() {
    const {
      user: { screen_name, followers_count },
      dispatch,
    } = this.props;
    if (screen_name) {
      try {
        const { dispatch } = this.props;
        const { isAvailable, name, uri } = await dispatch(
          allpayActions.getResellerURI([116, 119, 47].concat(utils.getCodePoint(screen_name)))
        );
        if (isAvailable) {
          await dispatch(walletActions.getTransactions({ limit: 10 }));
          const data = {
            uri,
            name,
            isProducer: false,
          };
          await dispatch(allpayActions.buyName(data));
          this.props.history.push('/wallet/allpay/confirm-purchase');
        } else {
          const nameString = utils.codePointToName(name);
          this.setState({ isError: true, message: `${nameString} is not available` });
        }
      } catch (error) {
        if (error.message === 'Empty inputs or outputs') {
          if (followers_count >= 1) {
            const { unusedAddresses } = await dispatch(walletActions.getUnusedAddresses());
            try {
              const { success } = await dispatch(
                claimTwitterHandleActions.getCoin({
                  faucetURI: process.env.REACT_APP_PROXY_URI,
                  address: unusedAddresses[0],
                })
              );
              if (success) {
                this.setState({
                  isError: false,
                  message: `Since you have more than 1 followers, we have credited ${satoshiToBSV(
                    150000
                  )} to your account.`,
                });
                setTimeout(async () => {
                  await this.buyTwitterHandle();
                }, 3000);
              }
            } catch (error) {
              this.setState({
                isError: true,
                message: error.message,
              });
            }
          } else {
            this.setState({
              isError: true,
              message: "You don't have sufficient coin to claim your twitter handle.",
            });
          }
        }
      }
    } else {
      this.props.history.push('/wallet');
    }
  }

  async buyTwitterHandle() {
    const {
      user: { screen_name },
      dispatch,
    } = this.props;
    await dispatch(walletActions.getTransactions({ limit: 10 }));
    const { name, uri } = await dispatch(
      allpayActions.getResellerURI([116, 119, 47].concat(utils.getCodePoint(screen_name)))
    );
    const data = {
      uri,
      name,
      isProducer: false,
    };
    await dispatch(allpayActions.buyName(data));
    this.props.history.push('/wallet/allpay/confirm-purchase');
  }

  onDashboardClick = () => {
    this.props.history.push('/wallet');
  };

  renderContent() {
    const { isError, message } = this.state;
    if (message) {
      return (
        <Grid>
          <Grid.Row>
            <Grid.Column>
              <Message positive={!isError} negative={isError}>
                <Message.Header>{isError ? 'Sorry!' : 'Congratulation!'}</Message.Header>
                <p>{message}</p>
              </Message>
            </Grid.Column>
          </Grid.Row>
          {isError && (
            <Grid.Row>
              <Grid.Column textAlign='center'>
                <Button className='coral' onClick={this.onDashboardClick}>
                  Dashboard
                </Button>
              </Grid.Column>
            </Grid.Row>
          )}
        </Grid>
      );
    }
  }

  render() {
    const { user, profile } = this.props;
    const { message } = this.state;
    if (message) {
      return this.renderContent();
    } else if (user && profile) {
      return <Loader active size='massive' />;
    } else {
      return <Redirect to='/' />;
    }
  }
}

const mapStateToProps = state => ({
  user: state.twitter.user,
  profile: authSelectors.getProfile(state),
});

export default withRouter(connect(mapStateToProps)(TwitterAuthHome));
