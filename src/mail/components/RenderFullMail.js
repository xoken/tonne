import React from 'react';
import { connect } from 'react-redux';
import { withRouter, Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Button, Grid, Input, Divider, Icon, TextArea } from 'semantic-ui-react';
import * as mailSelectors from '../mailSelectors';
import { EditorState, ContentState } from 'draft-js';
import htmlToDraft from 'html-to-draftjs';
import { Editor } from 'react-draft-wysiwyg';
import TextEditor from '../components/TextEditor';
import '../../../node_modules/react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import * as mailActions from '../mailActions';

class RenderFullMail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      replyMessageBodyField: null,
      files: null,
      isError: false,
      message: '',
    };
  }

  componentDidMount() {
    window.addEventListener('dragenter', this.onDragOverEnter);
    window.addEventListener('dragover', this.onDragOverEnter);
    window.addEventListener('drop', this.onFileDrop);
    document.getElementById('file-attach').addEventListener('dragleave', this.onDragLeave);
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
    this.setState({ replyMessageBodyField: content });
  };

  onReply = async () => {
    const { dispatch, currentlyOpenMailData } = this.props;
    const { replyMessageBodyField, files } = this.state;
    let subject, toField;
    const formData = new FormData();
    if (files) {
      for (let i = 0; i < files.length; i++) {
        formData.append('File', files[i], files[i].name);
      }
    }
    if (currentlyOpenMailData[0].additionalInfo.value.senderInfo) {
      subject = currentlyOpenMailData[0].additionalInfo.value.senderInfo.commonMetaData.subject;
      toField =
        currentlyOpenMailData[0].additionalInfo.value.senderInfo.commonMetaData.recepient[0];
    } else {
      subject = currentlyOpenMailData[0].additionalInfo.value.recipientInfo.commonMetaData.subject;
      toField = currentlyOpenMailData[0].additionalInfo.value.recipientInfo.commonMetaData.sender;
    }

    try {
      await dispatch(
        mailActions.createMailTransaction({
          recipients: Array.of(toField),
          threadId: currentlyOpenMailData[0].threadId,
          subject: subject,
          body: replyMessageBodyField,
        })
      );
      this.setState({
        replyMessageBodyField: null,
        files: null,
        isError: false,
        message: 'Mail Sent Successfully!',
      });
    } catch (error) {
      this.setState({
        isError: true,
        message: error.response && error.response.data ? error.response.data : error.message,
      });
    }
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

  renderFullMail = () => {
    const { currentlyOpenMailData } = this.props;
    return currentlyOpenMailData.map((mail, index) => {
      let mailData = null,
        sentMail = false,
        receivedMail = false,
        numberOfMails = mail.length;

      if (mail.additionalInfo.value.senderInfo) {
        mailData = mail.additionalInfo.value.senderInfo;
        sentMail = true;
      } else {
        mailData = mail.additionalInfo.value.recipientInfo;
        receivedMail = true;
      }
      const blocksFromHtml = htmlToDraft(mailData.body);
      const { contentBlocks, entityMap } = blocksFromHtml;
      const contentState = ContentState.createFromBlockArray(contentBlocks, entityMap);
      const editorState = EditorState.createWithContent(contentState);
      return (
        <Grid key={index.toString()}>
          <Grid.Row>
            <Grid.Column computer={8} mobile={8} floated='left'>
              <span style={{ color: 'lightgrey' }} className='word-wrap purplefontcolor'>
                {sentMail ? mailData.commonMetaData.recepient : mailData.commonMetaData.sender}{' '}
              </span>
              <span>
                {sentMail ? (
                  <span className='toArrow'>&#129133; </span>
                ) : (
                  <span className='fromArrow'>&#129134; </span>
                )}
              </span>
            </Grid.Column>

            <Grid.Column computer={4} mobile={8} floated='right'>
              <span style={{ color: 'lightgrey', float: 'right' }} className='word-wrap'>
                {mail.createdAt}
              </span>
            </Grid.Column>
          </Grid.Row>
          <Grid.Row computer={16}>
            <Grid.Column computer='16' floated='left'>
              <b>{mailData.commonMetaData.subject}</b>
            </Grid.Column>
          </Grid.Row>
          <Grid.Row computer={16}>
            <Grid.Column computer='16' floated='left'>
              <Editor
                editorStyle={{
                  border: 'none',
                  height: 'auto',
                }}
                editorState={editorState}
                toolbarClassName='hideEditorToolbar'
                readOnly='readOnly'
              />
            </Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <Grid.Column>
              {
                //Attached files
              }
              <Divider />
            </Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <Grid.Column className='recentTxidAddressColumn' style={{ marginBottom: '30px' }}>
              <span className='monospace word-wrap recentTxidAddress'>
                <span className='purplefontcolor'>TxID:</span> {mail.txId}
              </span>{' '}
              <Link to={'/explorer/transaction/' + mail.txId}>
                <span className='padding10px'>
                  <i className='walletLink'></i>
                </span>
              </Link>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      );
    });
  };

  render() {
    const { currentlyOpenMailThreadId } = this.props;
    const { isError, replyMessageBodyField, message } = this.state;
    return (
      <>
        <Grid
          style={{
            boxShadow: '5px 5px 5px #fafafa',
            marginBottom: '30px',
          }}>
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
            <Grid.Column computer={16} mobile={16}>
              {this.renderFullMail()}
              <span id='replyFiles' style={{ height: '300px' }} ref={this.maxWidthRef}>
                <TextEditor onMessageBodyFieldChange={this.onMessageBodyFieldChange} />
              </span>
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
              <div className={isError ? 'colorRed' : 'colorGreen'}>{message}</div>

              <br />
              <Button
                className='coral'
                disabled={replyMessageBodyField ? (isError ? true : false) : true}
                onClick={this.onReply}>
                Reply
              </Button>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </>
    );
  }
}

RenderFullMail.propTypes = {};

RenderFullMail.defaultProps = {};

const mapStateToProps = state => ({});

export default withRouter(connect(mapStateToProps)(RenderFullMail));
