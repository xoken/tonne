import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { Button, Grid, Container } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import * as claimTwitterHandleActions from '../../claimTwitterHandle/claimTwitterHandleActions';
import images from '../images';

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.learnMoreRef = React.createRef();
    this.rowOneShow = React.createRef();
    this.rowTwoShow = React.createRef();
    this.state = {
      rowOneShow: false,
      rowTwoShow: false,
    };
  }
  componentDidMount() {
    window.addEventListener('scroll', this.onScrollEvent);
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.onScrollEvent);
  }
  onClaimTwitterHandle = () => {
    const { dispatch, history, user } = this.props;
    if (user) {
      history.push('/claim-twitter-handle/wallet-setup');
    } else {
      dispatch(claimTwitterHandleActions.doTwitterAuth(history));
    }
  };

  scrollToLearnMore = () => {
    window.scrollTo({
      top: this.learnMoreRef.current.offsetTop,
      behavior: 'smooth',
    });
  };

  onScrollEvent = () => {
    let rowOneOffsetTop = this.rowOneShow.current.offsetTop;
    let rowTwoOffsetTop = this.rowTwoShow.current.offsetTop;
    const pageYOffset = window.pageYOffset;
    const fortyPercentOfWindowHeight = (window.innerHeight * 40) / 100;
    if (pageYOffset >= rowOneOffsetTop - fortyPercentOfWindowHeight) {
      this.setState({ rowOneShow: true });
    }
    if (pageYOffset >= rowTwoOffsetTop - fortyPercentOfWindowHeight) {
      this.setState({ rowTwoShow: true });
      window.removeEventListener('scroll', this.onScrollEvent);
    }
  };

  render() {
    const { rowOneShow, rowTwoShow } = this.state;
    return (
      <Grid verticalAlign='middle' className='homeMainGrid'>
        <Grid.Row centered>
          <Grid.Column verticalAlign='middle' className='introImage'>
            <div className='introText'>
              Bitcoin wallet, self-sovereign handles,
              <br className='breakDisplay' /> explorer & gateway to Bitcoin apps.
            </div>
          </Grid.Column>
          <span className='purplePaperRocket' style={{ left: '35%', top: '0%' }}></span>
          <span className='peachPaperRocket' style={{ left: '30%', top: '-5%' }}></span>
          <span className='peachPaperRocket2' style={{ left: '25%', top: '12%' }}></span>
          <span className='peachPaperRocket' style={{ left: '20%', top: '10%' }}></span>
          <span className='peachPaperRocket2' style={{ left: '-30%', top: '-15%' }}></span>
          <span className='peachPaperRocket' style={{ left: '-40%', top: '16%' }}></span>
          <span className='peachPaperRocket2' style={{ left: '-50%', top: '20%' }}></span>
          <span className='peachPaperRocket' style={{ left: '-35%', top: '10%' }}></span>
        </Grid.Row>

        <Grid.Row
          style={{
            background: 'linear-gradient(180deg, #f9f4fd 0%, #ffffff 100%)',
            height: 'min-content',
          }}>
          <Grid.Column>
            <Container>
              <center>
                <div className='ui placeholder segment homeSegment'>
                  <div className='ui four column stackable center aligned grid'>
                    <Grid.Row>
                      <div className='column'>
                        <div className='homeMainSection'>
                          <div className='ui icon header purplefontcolor'>
                            <img
                              alt='Bitcoin SV Blockchain'
                              src={images.explorerLogo}
                              style={{
                                display: 'block',
                                height: 53,
                                width: 'auto',
                                borderRadius: '100px',
                              }}
                              className='icon'
                            />
                            Bitcoin SV Blockchain
                          </div>
                          <Link to='/explorer' className='ui button coral coralButton'>
                            Explore
                          </Link>
                        </div>
                      </div>
                      <div className='column'>
                        <div className='homeMainSection'>
                          <div className='ui icon header purplefontcolor'>
                            <img
                              alt='Bitcoin SV Wallet'
                              src={images.wallet}
                              style={{
                                display: 'block',
                                height: 53,
                                width: 'auto',
                                borderRadius: '100px',
                              }}
                              className='icon'
                            />
                            Bitcoin SV Wallet
                          </div>
                          <Link to='/wallet' className='ui button coral coralButton'>
                            Send / Receive
                          </Link>
                        </div>
                      </div>
                      <div className='column'>
                        <div className='homeMainSection'>
                          <div className='ui icon header purplefontcolor'>
                            <img
                              alt='Twitter handle'
                              src={images.twitterLogo}
                              className='icon'
                              style={{
                                display: 'block',
                                height: 53,
                                borderRadius: '100px',
                                width: 'auto',
                              }}
                            />
                            Twitter handle
                          </div>
                          <Button
                            fluid
                            className='coral coralButton'
                            onClick={this.onClaimTwitterHandle}>
                            Claim on-chain
                          </Button>
                        </div>
                      </div>
                      <div className='column'>
                        <div className='homeMainSection'>
                          <div className='ui icon header purplefontcolor'>
                            <img
                              alt='voxMail'
                              src={images.voxmail}
                              className='icon'
                              style={{
                                display: 'block',
                                height: 53,
                                borderRadius: '100px',
                                width: 'auto',
                              }}
                            />
                            voxMail
                          </div>
                          <Button
                            fluid
                            className='coral coralButton'
                            onClick={this.onClaimTwitterHandle}>
                            Use voxMail
                          </Button>
                        </div>
                      </div>
                    </Grid.Row>
                    <Grid.Row centered verticalAlign='middle'>
                      <Grid.Column width={16} textAlign='center' style={{ paddingTop: '80px' }}>
                        <div
                          style={{
                            fontWeight: 'bold',
                            color: 'black',
                            cursor: 'pointer',
                          }}
                          onClick={this.scrollToLearnMore}>
                          Learn More<div>&#9660;</div>
                        </div>
                      </Grid.Column>
                    </Grid.Row>
                  </div>
                </div>
              </center>
            </Container>
          </Grid.Column>
        </Grid.Row>
        <div ref={this.learnMoreRef}></div>
        <span ref={this.rowOneShow}></span>
        <Grid.Row>
          <Grid.Column>
            <Container>
              <Grid stackable>
                <Grid.Row>
                  <Grid.Column computer={8} tablet={12} mobile={8} floated='left'>
                    <h2 className='h2homepage'>Simple to use, yet super secure & private</h2>
                    <div className='width70'>
                      Send & receive Bitcoins with intuitive handles, secured by provably correct
                      payment addresses with enhanced privacy. Unwieldy Bitcoin addresses are now a
                      relic of the past!
                    </div>
                  </Grid.Column>

                  <Grid.Column
                    computer={8}
                    tablet={8}
                    mobile={8}
                    className={rowOneShow ? 'alice rowOneShow' : 'alice homeRowOne'}></Grid.Column>
                </Grid.Row>
                <Grid.Row className='computer reversed'>
                  <Grid.Column computer={8} tablet={12} mobile={8} floated='right'>
                    <h2 className='h2homepage'>Self sovereign handles & data</h2>
                    <div className='width70'>
                      Truly own your usernames & associated data, and be in full control of it. You
                      can also authorize other services to access your data, secure and private
                      always.
                    </div>
                  </Grid.Column>

                  <Grid.Column
                    computer={8}
                    tablet={8}
                    mobile={8}
                    className={
                      rowTwoShow ? 'strange rowTwoShow' : 'strange homeRowTwo'
                    }></Grid.Column>
                </Grid.Row>
                <span ref={this.rowTwoShow}></span>
                <Grid.Row>
                  <Grid.Column computer={16} tablet={16} mobile={16} textAlign='center'>
                    <h2 className='h2homepage'>Develop powerful self-sovereign apps</h2>
                    <img
                      alt='Xoken Labs'
                      src={images.xokenFooterLogo}
                      style={{
                        width: 'max-content',
                        verticalAlign: 'middle',
                        backgroundColor: '#fafafa',
                        padding: '0px',
                        borderRadius: '100px',
                      }}
                    />
                    <div className='width70'>
                      Develop self-sovereign Bitcoin native apps with Xoken SDK (Javascript) & the
                      powerful Nexa APIs. Readily leverage our scalable backend infrastructure and
                      cutting edge open protocols Allegory (Simplified Name Verification) & AllPay
                      (provably correct payment addresses).
                    </div>
                  </Grid.Column>
                </Grid.Row>
              </Grid>
            </Container>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    );
  }
}

Home.propTypes = {
  dispatch: PropTypes.func.isRequired,
};

Home.defaultProps = {};

const mapStateToProps = state => ({
  user: state.twitter.user,
});

export default withRouter(connect(mapStateToProps)(Home));
