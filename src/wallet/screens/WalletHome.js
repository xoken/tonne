import React from 'react';
import { Link, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { Divider, Grid, GridColumn, Header, Loader, Segment } from 'semantic-ui-react';
import Profiles from '../components/Profiles';
import * as authActions from '../../auth/authActions';
import * as authSelectors from '../../auth/authSelectors';

class WalletHome extends React.Component {
  async componentDidMount() {
    const { dispatch } = this.props;
    await dispatch(authActions.getProfiles());
  }

  onSelectProfile = profile => () => {
    this.props.history.push(`/wallet/login?profile=${profile}`);
  };

  renderContent() {
    const { profiles } = this.props;
    return (
      <div style={{ marginBottom: '100px', height: '100%', verticalAlign: 'middle' }}>
        <Grid verticalAlign='middle' style={{ height: '100%' }}>
          <GridColumn>
            <Segment placeholder>
              <Grid columns={2} textAlign='center' stackable>
                {profiles && profiles.length > 0 && (
                  <Grid.Column verticalAlign='middle' className='negativeMarginBottom'>
                    <Header className='purplefontcolor'>Login to Existing Profile</Header>
                    <Profiles profiles={profiles} onSelect={this.onSelectProfile} />
                    <span className='walletHomeDividerHorizontal'>
                      <Divider horizontal className='negativeMarginBottom'>
                        Or
                      </Divider>
                    </span>
                  </Grid.Column>
                )}
                <Grid.Column>
                  <Grid.Row>
                    <Grid.Column>
                      <Header className='purplefontcolor'>I already have a seed phrase</Header>
                      <p>Import your existing wallet using a 12 word seed phrase</p>
                      <Link to='/wallet/existing' className='ui coral button'>
                        Import Wallet
                      </Link>
                    </Grid.Column>
                  </Grid.Row>
                  <Divider horizontal>Or</Divider>
                  <Grid.Row>
                    <Grid.Column>
                      <Header className='purplefontcolor'>Yes, let's get set up!</Header>
                      <p>This will create a new wallet and seed phrase</p>
                      <Link to='/wallet/new' className='ui coral button'>
                        Create a Wallet
                      </Link>
                    </Grid.Column>
                  </Grid.Row>
                </Grid.Column>
              </Grid>
              <span className='walletHomeDividerVertical'>
                {profiles && profiles.length > 0 && <Divider vertical>Or</Divider>}
              </span>
            </Segment>
          </GridColumn>
        </Grid>
      </div>
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

export default withRouter(connect(mapStateToProps)(WalletHome));
