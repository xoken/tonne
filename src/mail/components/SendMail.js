import React from 'react';
//import axios from 'axios';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Button, Grid, Input, Divider, Icon, TextArea, Modal, Loader } from 'semantic-ui-react';
import AttachFile from './AttachFile';
import TextEditor from '../components/TextEditor';
import * as mailActions from '../mailActions';
import * as mailSelectors from '../mailSelectors';

class SendMail extends React.Component {
  constructor(props) {
    super(props);
    this.maxWidthRef = React.createRef();
    this.toFieldWidthRef = React.createRef();
    this.state = {
      files: undefined,
      attachFileModal: false,
      toField: [],
      subjectField: '',
      messageBodyField: '',
      message: '',
      isError: false,
      toFieldHtml: undefined,
      toFieldTemp: undefined,
      toFieldWidth: undefined,
    };
  }
  maxWidth = 0;

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

  onFilesAttach = event => {
    const { files } = this.state;
    const newFiles = event.target.files;
    let tempFiles = Array.from(newFiles),
      updatedFiles = [],
      totalSizeOfFiles = 0;

    if (files) {
      updatedFiles = Array.from(files);
    }
    for (var z = 0; z < tempFiles.length; z++) {
      updatedFiles.push(tempFiles[z]);
    }
    this.setState({ files: updatedFiles });
    for (let i = 0; i < updatedFiles.length; i++) {
      totalSizeOfFiles += parseInt(updatedFiles[i].size);
    }

    if (totalSizeOfFiles > 10485760) {
      this.setState({ message: 'Total size of all files cannot be larger than 10MB' });
    }
  };

  componentDidMount() {
    window.addEventListener('dragenter', this.onDragOverEnter);
    window.addEventListener('dragover', this.onDragOverEnter);
    window.addEventListener('drop', this.onFileDrop);
    document.getElementById('files').addEventListener('dragleave', this.onDragLeave);
    this.setState({ toFieldWidth: this.maxWidthRef.current.offsetWidth });
    this.maxWidth = this.maxWidthRef.current.offsetWidth;
  }

  onDragOverEnter = event => {
    event.preventDefault();
  };

  onDragLeave = event => {
    event.stopPropagation();
    event.preventDefault();
  };

  onFileDrop = event => {
    const { files } = this.state;
    const newFiles = event.dataTransfer.files;
    let tempFiles = Array.from(newFiles),
      updatedFiles = [],
      totalSizeOfFiles = 0;

    if (files) {
      updatedFiles = Array.from(files);
    }
    for (var z = 0; z < tempFiles.length; z++) {
      updatedFiles.push(tempFiles[z]);
    }
    this.setState({ files: updatedFiles });
    for (let i = 0; i < updatedFiles.length; i++) {
      totalSizeOfFiles += parseInt(updatedFiles[i].size);
    }

    if (totalSizeOfFiles > 10485760) {
      this.setState({
        isError: true,
        message: 'Total size of all files cannot be larger than 10MB',
      });
    }
    event.preventDefault();
  };

  fileNameList = () => {
    const { files } = this.state;
    if (files) {
      return Array.from(files).map((file, index) => {
        return (
          <Grid.Row>
            <Grid.Column>
              <b>{file.name} </b>
              <span
                style={{ color: 'blue', cursor: 'pointer' }}
                id={index}
                onClick={this.onRemoveAttachedFile}>
                X
              </span>
            </Grid.Column>
          </Grid.Row>
        );
      });
    }
  };

  onRemoveAttachedFile = event => {
    const { files } = this.state;
    const index = parseInt(event.target.id);
    let tempFiles = Array.from(files),
      totalSizeOfFiles = 0;
    tempFiles.splice(index, 1);
    for (let i = 0; i < tempFiles.length; i++) {
      totalSizeOfFiles += tempFiles[i].size;
    }
    if (totalSizeOfFiles <= 10485760) {
      this.setState({ files: tempFiles, isError: false, message: '' });
    } else {
      this.setState({ files: tempFiles });
    }
  };

  onMessageBodyFieldChange = content => {
    this.setState({ messageBodyField: content });
  };

  onToFieldChange = event => {
    const { toField, toFieldRows } = this.state;
    let eventTargetValue = event.target.value;
    let maxWidthOfInput = this.maxWidthRef.current.offsetWidth;
    let halfWidth = Math.floor(this.maxWidthRef.current.offsetWidth / 2);
    let currentToFieldWidth = this.toFieldWidthRef.current.offsetWidth;
    if (event.key === 'Enter' || event.key === 'Tab') {
      eventTargetValue += ' ';
    }
    let tempToValue = toField,
      temp = eventTargetValue.split(/[ ,\t]+/);
    if (/[ ,]+/g.test(eventTargetValue)) {
      updateToField(temp.length);
      this.setState({
        toField: tempToValue,
        toFieldTemp: '',
        toFieldWidth: halfWidth,
      });
    } else {
      updateToField(temp.length - 1);
      this.setState({
        toField: tempToValue,
        toFieldTemp: eventTargetValue,
      });
    }
    function updateToField(tempLength) {
      for (var i = 0; i < tempLength; i++) {
        tempToValue.push(temp[i]);
      }
    }

    this.updateToValueHTML(tempToValue);

    if (event.target.value.length * 10 > halfWidth && currentToFieldWidth < maxWidthOfInput) {
      this.setState({
        toFieldWidth: halfWidth + event.target.value.length * 9,
      });
    }
  };

  updateToValueHTML = tempToValue => {
    let toValueHtml;
    toValueHtml = tempToValue.map((toAddress, index) => {
      if (toAddress) {
        return (
          <>
            <span className='peach toFieldHighlight'>{toAddress}</span>
            <span
              style={{ color: 'blue', cursor: 'pointer', margin: '0px 15px 0px 5px' }}
              id={'toField' + index}
              onClick={this.onToFieldRemove}>
              x
            </span>
          </>
        );
      }
    });
    this.setState({ toFieldHtml: toValueHtml });
  };

  onToFieldRemove = event => {
    let { toField } = this.state;
    let index = parseInt(event.target.id.replaceAll(/toField/g, ''));
    toField.splice(index, 1);
    this.updateToValueHTML(toField);
    this.setState({ toField: toField });
  };

  onSend = async () => {
    const { dispatch } = this.props;
    const { toField, subjectField, messageBodyField, files } = this.state;
    const formData = new FormData();
    if (files) {
      for (let i = 0; i < files.length; i++) {
        formData.append('File', files[i], files[i].name);
      }
    }
    let filteredToField = toField.filter(function (addressName) {
      return addressName !== '';
    });

    try {
      await dispatch(
        mailActions.createMailTransaction({
          recipients: filteredToField,
          threadId: null,
          subject: subjectField,
          body: messageBodyField,
        })
      );
      this.setState({
        subjectField: null,
        messageBodyField: null,
        toField: null,
        toFieldHtml: undefined,
        toFieldTemp: undefined,
        files: null,
        isError: false,
        message: 'Mail Sent Successfully!',
      });
      setTimeout(this.onCancel, 3000);
    } catch (error) {
      this.setState({
        isError: true,
        message: error.response && error.response.data ? error.response.data : error.message,
      });
    }
  };

  render() {
    const { isLoadingMailTransactions } = this.props;
    const {
      files,
      message,
      toField,
      toFieldTemp,
      toFieldHtml,
      subjectField,
      messageBodyField,
      toFieldWidth,
      toFieldRows,
      isError,
    } = this.state;
    return (
      <>
        <Grid>
          <Grid.Row>
            <Grid.Column>
              <span className='toFieldSpanEnvelope' style={{ width: this.maxWidth + 'px' }}>
                <span ref={this.toFieldWidthRef}>
                  <Input
                    rows='1'
                    id='toField'
                    type='text'
                    style={{ width: toFieldWidth + 'px' }}
                    value={toFieldTemp}
                    className='form-control toField'
                    placeholder='To:'
                    onChange={this.onToFieldChange}
                    onKeyDown={event =>
                      event.key === 'Enter' || event.key === 'Tab'
                        ? this.onToFieldChange(event)
                        : ''
                    }
                  />
                </span>
                <span className='word-wrap'>{toFieldHtml}</span>
              </span>
            </Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <Grid.Column>
              <Input
                fluid
                type='text'
                className='form-control'
                value={subjectField}
                placeholder='Subject:'
                onChange={event => this.setState({ subjectField: event.target.value })}
              />
            </Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <Grid.Column width='16'>
              <span id='files' style={{ height: '300px', display: 'block' }} ref={this.maxWidthRef}>
                <TextEditor onMessageBodyFieldChange={this.onMessageBodyFieldChange} />
              </span>
              {
                // <TextArea
                //   fluid
                //   id='files'
                //   type='text'
                //   className='form-control'
                //   value={messageBodyField}
                //   placeholder='Type your message here / Drop files here...'
                //   style={{ width: '100%', height: '300px' }}
                //   onChange={event => this.setState({ messageBodyField: event.target.value })}
                // />
              }
              <br />
              <label htmlFor='file-attach'>
                <Icon
                  name='paperclip'
                  size='large'
                  style={{ cursor: 'pointer' }}
                  //  onClick={this.toggleAttachFileModal}
                />
              </label>

              <Input
                id='file-attach'
                style={{ display: 'none' }}
                type='file'
                icon='paperclip'
                multiple='multiple'
                onChange={this.onFilesAttach}
              />
            </Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <Grid.Column>
              {files ? <Grid>{this.fileNameList()}</Grid> : ''}
              <div className={isError ? 'colorRed' : 'colorGreen'}>{message}</div>
              <center>{isLoadingMailTransactions ? <Loader active /> : null}</center>
            </Grid.Column>
          </Grid.Row>
          <Grid.Row centered>
            <Grid.Column>
              <Button
                className='coral'
                disabled={toField ? (subjectField ? (isError ? true : false) : true) : true}
                onClick={this.onSend}>
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

const mapStateToProps = state => ({
  isLoadingMailTransactions: mailSelectors.isLoadingMailTransactions(state),
});

export default withRouter(connect(mapStateToProps)(SendMail));
