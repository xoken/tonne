import React from 'react';
import { withRouter, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { Button, Grid, Loader, Message } from 'semantic-ui-react';
import * as allpayActions from '../../allpay/allpayActions';
import * as walletActions from '../../wallet/walletActions';
import * as claimTwitterHandleActions from '../claimTwitterHandleActions';
import * as authSelectors from '../../auth/authSelectors';
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
    const { user, dispatch } = this.props;
    if (user) {
      const { screen_name, followers_count } = user;
      try {
        const { dispatch } = this.props;
        const { isAvailable, name, uri } = await dispatch(
          allpayActions.getResellerURI(
            [116, 119, 47].concat(
              utils.getCodePoint(screen_name.replaceAll(/\s/g, '').toLowerCase())
            )
          )
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
        if (error.name === 'NotEnoughUtxoError') {
          if (followers_count >= process.env.REACT_APP_MIN_TWITTER_FOLLOWER) {
            const { unusedAddresses } = await dispatch(walletActions.getUnusedAddresses());
            try {
              const { success } = await dispatch(
                claimTwitterHandleActions.getCoin({
                  faucetURI: process.env.REACT_APP_PROXY_URI,
                  address: unusedAddresses[0],
                })
              );
              if (success) {
                await dispatch(
                  claimTwitterHandleActions.setMessage(
                    `Since you have more than ${
                      process.env.REACT_APP_MIN_TWITTER_FOLLOWER
                    } followers, we have credited ${utils.satoshiToBSV(
                      process.env.REACT_APP_FAUCET_FREE_CREDIT
                    )} to your account.`
                  )
                );
                await this.buyTwitterHandle();
              }
            } catch (error) {
              this.setState({
                isError: true,
                message:
                  error.response && error.response.data ? error.response.data : error.message,
              });
            }
          } else {
            this.setState({
              isError: true,
              message: `Please deposit a minimum of ${utils.satoshiToBSV(
                process.env.REACT_APP_FAUCET_FREE_CREDIT
              )} in your wallet to claim your Twitter handle.`,
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
      allpayActions.getResellerURI(
        [116, 119, 47].concat(utils.getCodePoint(screen_name.replaceAll(/\s/g, '').toLowerCase()))
      )
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
              <Message>
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
      return <Loader content='Please wait while we setup your account' active size='massive' />;
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
