import React from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import {
  Button,
  Card,
  Divider,
  Form,
  Grid,
  Header,
  Image,
  Loader,
  Radio,
  Segment,
} from 'semantic-ui-react';
import ImportWallet from '../../wallet/components/ImportWallet';
import NewWallet from '../../wallet/components/NewWallet';
import Profiles from '../../wallet/components/Profiles';
import images from '../../shared/images';
import * as authActions from '../../auth/authActions';
import * as claimTwitterHandleActions from '../../claimTwitterHandle/claimTwitterHandleActions';
import * as authSelectors from '../../auth/authSelectors';

class WalletSetup extends React.Component {
  constructor(props) {
    super(props);
    this.horizontalScrollRef = React.createRef();

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
      return (
        <Grid>
          <Grid.Row centered>
            <Grid.Column width='4' textAlign='center'>
              <Segment>
                <Profiles profiles={profiles} onSelect={this.onSelectProfile} />
              </Segment>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      );
    }
    return null;
  }

  renderPurchasedTwitterFollowers() {
    const { purchasedTwitterFollowers } = this.props;
    if (purchasedTwitterFollowers.length > 0) {
      return (
        <Grid>
          <Grid.Row>
            <Grid.Column>
              <Header as='h4' textAlign='center' className='purplefontcolor'>
                {purchasedTwitterFollowers.length} of your followers on BitcoinSV
              </Header>
            </Grid.Column>
          </Grid.Row>
          <Grid.Row centered>
            <Grid.Column textAlign='center'>
              <Button
                className='peach'
                onClick={this.leftButtonOfCarousal}
                style={{
                  marginRight: '10px',
                  fontSize: '22px',
                  padding: '8px 20px 8px 20px',
                }}>
                &lt;
              </Button>

              <div
                ref={this.horizontalScrollRef}
                style={{
                  overflow: 'auto',
                  width: '375px',
                  minWidth: '250px',
                  textAlign: 'center',
                  whiteSpace: 'nowrap',
                  scrollbarWidth: 'none',
                  display: 'inline-flex',
                  scrollBehavior: 'smooth',
                }}>
                {purchasedTwitterFollowers.map((follower, index) => {
                  return (
                    <div key={String(index)} style={{ padding: '15px 25px 15px 25px' }}>
                      <Image src={follower.profile_image_url_https} avatar />
                      <span>{`tw/${follower.screen_name}`}</span>
                    </div>
                  );
                })}
              </div>

              <Button
                className='peach'
                onClick={this.rightButtonOfCarousal}
                style={{ marginLeft: '10px', fontSize: '22px', padding: '8px 20px 8px 20px' }}>
                &gt;
              </Button>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      );
    }
    return null;
  }

  leftButtonOfCarousal = () => {
    this.horizontalScrollRef.current.scrollLeft -= 150;
  };

  rightButtonOfCarousal = () => {
    this.horizontalScrollRef.current.scrollLeft += 150;
  };

  renderContent() {
    const {
      user: { screen_name, name, profile_image_url_https },
    } = this.props;
    return (
      <>
        <Grid>
          <Grid.Row>
            <Grid.Column width={5} floated='right' textAlign='right'>
              <Card className='twitter-card'>
                <Card.Content>
                  <Card.Header>
                    <Image src={profile_image_url_https} avatar />
                    <span>{screen_name}</span>
                  </Card.Header>
                  <Card.Meta>{name}</Card.Meta>
                </Card.Content>
              </Card>
            </Grid.Column>
          </Grid.Row>
        </Grid>
        <Divider />
        <Grid>
          <Grid.Row>
            <Grid.Column>
              <Header as='h3' textAlign='center' className='purplefontcolor'>
                Hello {screen_name}, you need a BSV wallet to proceed
              </Header>
            </Grid.Column>
          </Grid.Row>
        </Grid>
        <Segment>
          <Grid>
            <Grid.Row>
              <Grid.Column te>
                <Form
                  style={{
                    width: 'max-content',
                    marginLeft: 'auto',
                    marginRight: 'auto',
                  }}>
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
          </Grid>
        </Segment>
        {this.renderImportWallet()}
        {this.renderCreateWallet()}
        {this.renderExistingProfile()}
        {this.renderPurchasedTwitterFollowers()}
      </>
    );
  }

  render() {
    const { isLoading, profile, user } = this.props;
    if (isLoading) {
      return <Loader active size='massive' />;
    } else if (!user) {
      return <Redirect to='/' />;
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
  user: state.twitter.user,
  purchasedTwitterFollowers: state.twitter.purchasedTwitterFollowers,
});

export default withRouter(connect(mapStateToProps)(WalletSetup));
