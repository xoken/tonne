import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Button, Grid, Input, Divider, Icon, TextArea } from 'semantic-ui-react';

class AttachFile extends React.Component {
  constructor(props) {
    super(props);
    this.state = { files: null };
  }

  componentDidMount() {
    window.addEventListener('dragenter', this.onDragOverEnter);
    window.addEventListener('dragover', this.onDragOverEnter);
    window.addEventListener('drop', this.onDragOverEnter);
    document.getElementById('files').addEventListener('dragleave', this.onDragLeave);
  }

  onCancel = () => {
    this.props.onCancel();
  };

  onDragOverEnter = event => {
    event.preventDefault();
  };

  onDragLeave = event => {
    this.setState({ className: 'drop-zone-hide' });
    event.stopPropagation();
    event.preventDefault();
  };

  onFileDrop = event => {
    this.setState({ files: event.dataTransfer.files });
    event.preventDefault();
  };

  render() {
    console.log(this.state.files);
    return (
      <>
        <Grid>
          <Grid.Row>
            <Grid.Column>
              <Input
                fluid
                id='files'
                type='file'
                className='form-control'
                value=''
                placeholder='Drop file here'
                style={{ width: '100%', height: '300px' }}
                onChange={event => this.setState({ files: event.target.files[0] })}
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
