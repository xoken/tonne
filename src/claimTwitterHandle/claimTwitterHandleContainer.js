import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import Navbar from '../shared/components/Navbar';
import { Grid, Card, Icon, Image, Divider } from 'semantic-ui-react';
import ProgressIndicator from '../shared/components/ProgressIndicator';
import { ClaimTwitterHandleRoutes } from './claimTwitterHandleRoutes';

class ClaimTwitterHandleContainer extends Component {
  render() {
    const { progressStep, progressTotalSteps, title } = this.props;
    return (
      <>
        <Navbar title={title || ''} />
        <Grid>
          <Grid.Row verticalAlign='middle' className='nopaddingbottom'>
            <Grid.Column centered width={1}>
              <ProgressIndicator steps={progressTotalSteps} activeStep={progressStep} />
            </Grid.Column>
            <Grid.Column floated='right' textAlign='right' width={5}>
              <Card style={{ boxShadow: 'none' }}>
                {
                  //<Image src='profileImage.png' size='small' circular centered />
                }
                <Card.Content>
                  <Card.Header style={{ whiteSpace: 'nowrap' }}>
                    <Icon name='twitter' size='large' style={{ color: '#00acee' }} />
                    @twitterHandle
                  </Card.Header>
                  <Card.Meta>Name OnTwitter</Card.Meta>
                </Card.Content>
              </Card>
            </Grid.Column>
          </Grid.Row>
          <Grid.Row className='nopadding'>
            <Grid.Column centered width={1}></Grid.Column>
            <Grid.Column centered width={15}>
              <Divider />
            </Grid.Column>
          </Grid.Row>
        </Grid>

        <div className='ui grid'>
          <div className='one wide column'></div>
          <div className='fifteen wide column'>
            <ClaimTwitterHandleRoutes />
          </div>
        </div>
      </>
    );
  }
}

ClaimTwitterHandleContainer.defaultProps = {
  title: '',
  progressTotalSteps: 1,
};

ClaimTwitterHandleContainer.propTypes = {
  progressStep: PropTypes.number.isRequired,
  title: PropTypes.string,
  progressTotalSteps: PropTypes.number,
  history: PropTypes.shape({}).isRequired,
};

const mapStateToProps = state => ({
  progressStep: state.twitter.ui.activeStep,
  progressTotalSteps: state.twitter.ui.progressTotalSteps,
  title: state.twitter.ui.title,
});

export default withRouter(connect(mapStateToProps)(ClaimTwitterHandleContainer));
