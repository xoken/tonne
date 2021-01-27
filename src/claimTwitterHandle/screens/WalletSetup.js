import React from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { Form, Grid, Loader, Radio, Card, Icon, Image, Divider, Button } from 'semantic-ui-react';
import ImportWallet from '../../wallet/components/ImportWallet';
import NewWallet from '../../wallet/components/NewWallet';
import Profiles from '../../wallet/components/Profiles';
import images from '../../shared/images';
import * as authActions from '../../auth/authActions';
import * as authSelectors from '../../auth/authSelectors';

class WalletSetup extends React.Component {
  constructor(props) {
    super(props);
    this.horizontalScrollRef = React.createRef();

    this.state = {
      selectedOption: undefined,
      followersListToggle: false,
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

  listAllFollowers = () => {
    let followersList = ['', '', '', '', '', '', '', '', '', '', ''];
    return (
      <>
        {followersList.map((follower, index) => {
          return (
            <span style={{ padding: '15px 25px 15px 25px', wordBreak: 'break-all' }}>
              <Image src={images.bsv} circular centered avatar />
              <span>@userHandle</span>
            </span>
          );
        })}
      </>
    );
  };
  listFollowers = () => {
    const { followersListToggle } = this.state;
    let followersList = ['', '', '', '', '', '', '', '', '', '', ''];
    if (followersListToggle) {
      return (
        <>
          <Card>
            <Card.Content extra style={{ overflow: 'auto', height: '250px' }}>
              {followersList.map((follower, index) => {
                return (
                  <>
                    <Image src={images.bsv} size='mini' circular centered />
                    <Divider hidden />
                  </>
                );
              })}
            </Card.Content>
          </Card>
        </>
      );
    }
  };
  onFollowersListToggle = () => {
    const { followersListToggle } = this.state;
    this.setState({ followersListToggle: !followersListToggle });
  };
  leftButtonOfCarousal = () => {
    this.horizontalScrollRef.current.scrollLeft -= 150;
  };
  rightButtonOfCarousal = () => {
    this.horizontalScrollRef.current.scrollLeft += 150;
  };

  renderContent() {
    return (
      <>
        <Grid>
          <Grid.Row>
            <Grid.Column>
              <center>
                <h3 className='purplefontcolor'>
                  Hello {this.props.screenName}, you need a BSV wallet to proceed
                </h3>
              </center>
            </Grid.Column>
          </Grid.Row>
          <Grid.Row style={{ backgroundColor: '#fafafa' }}>
            <Grid.Column>
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
          {this.renderImportWallet()}
          {this.renderCreateWallet()}
          {this.renderExistingProfile()}
        </Grid>
        <center>
          <h4 className='purplefontcolor' style={{ marginTop: '60px' }}>
            2000 of your followers on Bitcoin
          </h4>
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

          <span
            ref={this.horizontalScrollRef}
            style={{
              overflow: 'auto',
              width: '375px',
              minWidth: '250px',
              textAlign: 'center',
              whiteSpace: 'nowrap',
              height: '50px',
              scrollbarWidth: 'none',
              display: 'inline-flex',
              scrollBehavior: 'smooth',
            }}>
            {this.listAllFollowers()}
          </span>

          <Button
            className='peach'
            onClick={this.rightButtonOfCarousal}
            style={{ marginLeft: '10px', fontSize: '22px', padding: '8px 20px 8px 20px' }}>
            &gt;
          </Button>
        </center>
      </>
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
