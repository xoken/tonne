import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Button, Grid, Input, Divider, Icon, TextArea } from 'semantic-ui-react';

class RenderFullMail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  renderFullMail = () => {
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
            {
              //allpayname
            }
            <span style={{ color: 'lightgrey' }}>aa/allpayname</span>
          </Grid.Column>

          <Grid.Column computer={2} mobile={8} floated='right'>
            {
              //time
            }
            <span style={{ color: 'lightgrey', float: 'right' }}>10:10</span>
          </Grid.Column>
        </Grid.Row>
        <Grid.Row computer={16}>
          <Grid.Column computer='16' floated='left'>
            {
              //full subject
            }
            <b>Placeholder Subject line sdf sggs sfhfhs</b>
          </Grid.Column>
        </Grid.Row>
        <Grid.Row computer={16}>
          <Grid.Column computer='16' floated='left'>
            {
              //full message
            }
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
              incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
              exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure
              dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
              Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt
              mollit anim id est laborum
            </p>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
              incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
              exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure
              dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
              Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt
              mollit anim id est laborum
            </p>
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
