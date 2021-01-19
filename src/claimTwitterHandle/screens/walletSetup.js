import React from 'react';
import { Link, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import NewWallet from '../../wallet/screens/NewWallet';
import ImportWallet from '../../wallet/screens/ImportWallet';
import { Divider, Grid, GridColumn, Header, List, Loader, Segment, Radio } from 'semantic-ui-react';
import * as authActions from '../../auth/authActions';
import * as authSelectors from '../../auth/authSelectors';

class WalletSetup extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      importWalletChecked: false,
      createWalletChecked: false,
      loginToExistingProfile: false,
      checkedRadio: '',
    };
  }
  async componentDidMount() {
    const { dispatch } = this.props;
    await dispatch(authActions.getProfiles());
  }

  onSelectProfile = profile => () => {
    localStorage.setItem('currentprofile', profile);
    this.props.history.push(`/wallet/login?profile=${profile}`);
  };

  renderImportWalletButton = () => {
    const { importWalletChecked } = this.state;
    if (importWalletChecked) {
      return (
        <Grid className='paddtopbottom25px' textAlign='left'>
          <Grid.Row>
            <Grid.Column>
              <ImportWallet
                continueLocation='/claim-twitter-handle/login'
                dashboardLocation='/claim-twitter-handle/wallet-dashboard'
              />
            </Grid.Column>
          </Grid.Row>
        </Grid>
      );
    }
  };
  renderCreateWalletButton = () => {
    const { createWalletChecked } = this.state;
    if (createWalletChecked) {
      return (
        <Grid className='paddtopbottom25px'>
          <Grid.Row>
            <Grid.Column>
              <NewWallet
                continueLocation='/claim-twitter-handle/new-password'
                dashboardLocation='/claim-twitter-handle/wallet-dashboard'
              />
            </Grid.Column>
          </Grid.Row>
        </Grid>
      );
    }
  };

  renderLoginToProfileButton = () => {
    const { profiles } = this.props;
    const { loginToExistingProfile } = this.state;
    if (loginToExistingProfile) {
      if (profiles && profiles.length > 0) {
        return (
          <>
            <Grid className='paddtopbottom25px'>
              <Grid.Row>
                <Grid.Column verticalAlign='middle'>
                  <List selection verticalAlign='middle'>
                    {profiles.map((profile, index) => {
                      const { name } = profile;
                      return (
                        <List.Item
                          key={index}
                          onClick={this.onSelectProfile(name)}
                          className='ui coralinverted button custommargin'>
                          <List.Content>
                            <List.Header>{name}</List.Header>
                          </List.Content>
                        </List.Item>
                      );
                    })}
                  </List>
                </Grid.Column>
              </Grid.Row>
            </Grid>
          </>
        );
      } else {
        return (
          <>
            <Grid className='paddtopbottom25px'>
              <Grid.Row>
                <Grid.Column textAlign='center'>
                  <b class='purplefontcolor'>You have not imported any profiles yet.</b>
                </Grid.Column>
              </Grid.Row>
            </Grid>
          </>
        );
      }
    }
  };

  renderContent() {
    const { checkedRadio } = this.state;
    return (
      <Grid verticalAlign='middle' style={{ height: '100%' }}>
        <Grid.Row>
          <Grid.Column>
            <center>
              <h3 className='purplefontcolor'>You need a Tonne wallet to proceed</h3>
            </center>
            <Segment placeholder>
              <Grid columns={1}>
                <Grid.Row>
                  <Grid.Column>
                    <b>
                      <Radio
                        className='purplefontcolor'
                        label='I already have a wallet'
                        checked={checkedRadio === 'import' ? true : false}
                        value='import'
                        onChange={event =>
                          this.setState({
                            checkedRadio: 'import',
                            importWalletChecked: true,
                            createWalletChecked: false,
                            loginToExistingProfile: false,
                          })
                        }
                      />
                    </b>
                    {this.renderImportWalletButton()}
                  </Grid.Column>
                </Grid.Row>
                <Grid.Row>
                  <Grid.Column>
                    <b>
                      <Radio
                        className='purplefontcolor'
                        label='Create a wallet'
                        checked={checkedRadio === 'create' ? true : false}
                        value='create'
                        onChange={event =>
                          this.setState({
                            checkedRadio: 'create',
                            importWalletChecked: false,
                            createWalletChecked: true,
                            loginToExistingProfile: false,
                          })
                        }
                      />
                    </b>
                    {this.renderCreateWalletButton()}
                  </Grid.Column>
                </Grid.Row>
                <Grid.Row>
                  <Grid.Column>
                    <b>
                      <Radio
                        className='purplefontcolor'
                        label='Login to imported profile'
                        checked={checkedRadio === 'login' ? true : false}
                        value='login'
                        onChange={event =>
                          this.setState({
                            checkedRadio: 'login',
                            importWalletChecked: false,
                            createWalletChecked: false,
                            loginToExistingProfile: true,
                          })
                        }
                      />
                    </b>
                    {this.renderLoginToProfileButton()}
                  </Grid.Column>
                </Grid.Row>
              </Grid>
            </Segment>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    );
  }

  render() {
    const { isLoading, profile } = this.props;
    if (isLoading) {
      return <Loader active size='massive' />;
    } else if (profile) {
      return <Redirect to='/wallet/dashboard' />;
    }
    return <>{this.renderContent()}</>;
  }
}
const mapStateToProps = state => ({
  isLoading: authSelectors.isLoading(state),
  profile: authSelectors.getProfile(state),
  profiles: authSelectors.getProfiles(state),
});

export default withRouter(connect(mapStateToProps)(WalletSetup));
