import React from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { Form, Grid, Loader, Radio } from 'semantic-ui-react';
import ImportWallet from '../../wallet/components/ImportWallet';
import NewWallet from '../../wallet/components/NewWallet';
import Profiles from '../../wallet/components/Profiles';
import * as authActions from '../../auth/authActions';
import * as authSelectors from '../../auth/authSelectors';

class WalletSetup extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedOption: undefined,
    };
  }
  async componentDidMount() {
    const { dispatch } = this.props;
    await dispatch(authActions.getProfiles());
  }

  onHandleChange = (_, { value }) => {
    this.setState({
      selectedOption: value,
    });
  };

  onSelectProfile = profile => () => {
    this.props.history.push(`/claim-twitter-handle/wallet-setup-two?profile=${profile}`);
  };

  onContinue = () => {
    this.props.history.push(`/claim-twitter-handle/wallet-setup-two`);
  };

  renderImportWallet() {
    const { selectedOption } = this.state;
    if (selectedOption === 'import') {
      return <ImportWallet onContinue={this.onContinue} />;
    }
    return null;
  }

  renderCreateWallet() {
    const { selectedOption } = this.state;
    if (selectedOption === 'new') {
      return <NewWallet onContinue={this.onContinue} />;
    }
    return null;
  }

  renderExistingProfile() {
    const { profiles } = this.props;
    const { selectedOption } = this.state;
    if (selectedOption === 'existing') {
      return <Profiles profiles={profiles} onSelect={this.onSelectProfile} />;
    }
    return null;
  }

  renderContent() {
    return (
      <Grid>
        <Grid.Row>
          <Grid.Column>
            <Form>
              <Form.Field>
                Hello {this.props.screenName}, You need a BSV wallet to proceed
              </Form.Field>
              <Form.Field>
                <Radio
                  label='I already have a seed phrase'
                  name='radioGroup'
                  value='import'
                  checked={this.state.selectedOption === 'import'}
                  onChange={this.onHandleChange}
                />
              </Form.Field>
              <Form.Field>
                <Radio
                  label='Create a new wallet and seed phrase'
                  name='radioGroup'
                  value='new'
                  checked={this.state.selectedOption === 'new'}
                  onChange={this.onHandleChange}
                />
              </Form.Field>
              <Form.Field>
                <Radio
                  label='Login to existing wallet profile'
                  name='radioGroup'
                  value='existing'
                  checked={this.state.selectedOption === 'existing'}
                  onChange={this.onHandleChange}
                />
              </Form.Field>
            </Form>
          </Grid.Column>
        </Grid.Row>
        {this.renderImportWallet()}
        {this.renderCreateWallet()}
        {this.renderExistingProfile()}
      </Grid>
    );
  }

  render() {
    const { isLoading, profile } = this.props;
    if (isLoading) {
      return <Loader active size='massive' />;
    } else if (profile) {
      return <Redirect to='/wallet' />;
    } else {
      return this.renderContent();
    }
  }
}
const mapStateToProps = state => ({
  isLoading: authSelectors.isLoading(state),
  screenName: state.twitter.screenName,
  profile: authSelectors.getProfile(state),
  profiles: authSelectors.getProfiles(state),
});

export default withRouter(connect(mapStateToProps)(WalletSetup));
