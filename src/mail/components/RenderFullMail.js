import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Button, Grid, Input, Divider, Icon, TextArea } from 'semantic-ui-react';
import * as mailSelectors from '../mailSelectors';

class RenderFullMail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  renderFullMail = () => {
    const {
      currentlyOpenMailThreadId,
      currentlyOpenMailData,
      currentlyOpenSentMail,
      currentlyOpenReceivedMail,
    } = this.props;

    return (
      <Grid>
        <Grid.Row>
          <Grid.Column computer={16} mobile={16} floated='right'>
            {
              //close pane
            }
            <span
              style={{
                color: 'lightgrey',
                cursor: 'pointer',
                padding: '8px',
                color: 'red',
                float: 'right',
              }}
              onClick={this.props.toggleFullMailPane}>
              X
            </span>
          </Grid.Column>
        </Grid.Row>
        <Grid.Row>
          <Grid.Column computer={8} mobile={8} floated='left'>
            <span style={{ color: 'lightgrey' }} className='word-wrap'>
              {currentlyOpenSentMail
                ? currentlyOpenMailData.commonMetaData.recepient
                : currentlyOpenMailData.commonMetaData.sender}
            </span>
          </Grid.Column>

          <Grid.Column computer={4} mobile={8} floated='right'>
            <span style={{ color: 'lightgrey', float: 'right' }} className='word-wrap'>
              {currentlyOpenMailData.createdAt}
            </span>
          </Grid.Column>
        </Grid.Row>
        <Grid.Row computer={16}>
          <Grid.Column computer='16' floated='left'>
            {currentlyOpenMailData.commonMetaData.subject}
          </Grid.Column>
        </Grid.Row>
        <Grid.Row computer={16}>
          <Grid.Column computer='16' floated='left'>
            {currentlyOpenMailData.body}
          </Grid.Column>
        </Grid.Row>

        <Grid.Row>
          <Grid.Column>
            {
              //Attached files
            }
          </Grid.Column>
        </Grid.Row>
      </Grid>
    );
  };

  render() {
    return <>{this.renderFullMail()}</>;
  }
}

RenderFullMail.propTypes = {};

RenderFullMail.defaultProps = {};

const mapStateToProps = state => ({});

export default withRouter(connect(mapStateToProps)(RenderFullMail));
