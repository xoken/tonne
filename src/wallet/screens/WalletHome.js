import React from 'react';
import { Link, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { Divider, Grid, GridColumn, Header, List, Loader, Segment } from 'semantic-ui-react';
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
      <Grid verticalAlign='middle' style={{ height: '100%' }}>
        <GridColumn>
          <Segment placeholder>
            <Grid columns={2} textAlign='center'>
              {profiles && profiles.length > 0 && (
                <Grid.Column verticalAlign='middle'>
                  <Header>Login to Existing Profile</Header>
                  <List selection verticalAlign='middle'>
                    {profiles.map((profile, index) => {
                      const { name } = profile;
                      /* FIX ME - Use only semantic css*/
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
              )}
              <Grid.Column>
                <Grid.Row>
                  <Grid.Column>
                    <Header>I already have a seed phrase</Header>
                    <p>Import your existing wallet using a 12 word seed phrase</p>
                    <Link to='/wallet/existing' className='ui coral button'>
                      Existing Wallet
                    </Link>
                  </Grid.Column>
                </Grid.Row>
                <Divider horizontal>Or</Divider>
                <Grid.Row>
                  <Grid.Column>
                    <Header>Yes, let's get set up!</Header>
                    <p>This will create a new wallet and seed phrase</p>
                    <Link to='/wallet/new' className='ui coral button'>
                      Create a Wallet
                    </Link>
                  </Grid.Column>
                </Grid.Row>
              </Grid.Column>
            </Grid>
            {profiles && profiles.length > 0 && <Divider vertical>Or</Divider>}
          </Segment>
        </GridColumn>
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

export default withRouter(connect(mapStateToProps)(WalletHome));
