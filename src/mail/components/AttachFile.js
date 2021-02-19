import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Button, Grid, Input, Divider, Icon, TextArea } from 'semantic-ui-react';

class AttachFile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  onCancel = () => {
    this.props.onCancel();
  };

  render() {
    return (
      <>
        <Grid>
          <Grid.Row>
            <Grid.Column>
              <Input
                fluid
                type='text'
                className='form-control'
                value=''
                placeholder='Drop file here'
                style={{ width: '100%', height: '300px' }}
              />
              <br />
            </Grid.Column>
          </Grid.Row>
          <Grid.Row centered>
            <Grid.Column>
              <Button className='coral' disabled='true'>
                Attach
              </Button>
              <Button className='peach' onClick={this.onCancel}>
                Cancel
              </Button>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </>
    );
  }
}

AttachFile.propTypes = {};

AttachFile.defaultProps = {};

const mapStateToProps = state => ({});

export default withRouter(connect(mapStateToProps)(AttachFile));
