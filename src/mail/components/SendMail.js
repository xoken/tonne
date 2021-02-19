import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Button, Grid, Input, Divider, Icon, TextArea, Modal } from 'semantic-ui-react';
import AttachFile from './AttachFile';

class SendMail extends React.Component {
  constructor(props) {
    super(props);
    this.state = { attachFileModal: false };
  }

  onCancel = () => {
    this.props.onCancel();
  };

  renderAttachFileModal() {
    const { attachFileModal } = this.state;
    return (
      <Modal open={attachFileModal}>
        <Modal.Header className='purplefontcolor'>Attach Files</Modal.Header>
        <Modal.Content>
          <Modal.Description>
            <AttachFile onCancel={this.toggleAttachFileModal} />
          </Modal.Description>
        </Modal.Content>
      </Modal>
    );
  }

  toggleAttachFileModal = () => {
    const { attachFileModal } = this.state;
    this.setState({ attachFileModal: !attachFileModal });
  };

  render() {
    return (
      <>
        <Grid>
          <Grid.Row>
            <Grid.Column>
              <Input fluid type='text' className='form-control' value='' placeholder='To:' />
            </Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <Grid.Column>
              <Input fluid type='text' className='form-control' value='' placeholder='Subject:' />
            </Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <Grid.Column>
              <TextArea
                fluid
                type='text'
                className='form-control'
                value=''
                placeholder='Type your message here...'
                style={{ width: '100%', height: '300px' }}
              />
              <br />

              <Icon
                name='paperclip'
                size='large'
                onClick={this.toggleAttachFileModal}
                style={{ cursor: 'pointer' }}
              />
            </Grid.Column>
          </Grid.Row>
          <Grid.Row centered>
            <Grid.Column>
              <Button className='coral' disabled='true'>
                Send
              </Button>
              <Button className='peach' onClick={this.onCancel}>
                Cancel
              </Button>
            </Grid.Column>
          </Grid.Row>
        </Grid>
        {this.renderAttachFileModal()}
      </>
    );
  }
}

SendMail.propTypes = {};

SendMail.defaultProps = {};

const mapStateToProps = state => ({});

export default withRouter(connect(mapStateToProps)(SendMail));
