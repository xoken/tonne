import React from 'react';
import { connect } from 'react-redux';
import { withRouter, Link } from 'react-router-dom';
import { Button, Grid, Icon, Input } from 'semantic-ui-react';
import { EditorState, ContentState } from 'draft-js';
import htmlToDraft from 'html-to-draftjs';
import { Editor } from 'react-draft-wysiwyg';
import TextEditor from '../components/TextEditor';
import * as mailActions from '../mailActions';
import { format } from 'date-fns';
import images from '../../shared/images';

class RenderFullMail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      replyMessageBodyField: '',
      files: null,
      isError: false,
      message: '',
      replyField: false,
      replyAll: false,
      subject: '',
      toField: '',
      toAllField: [],
      toAllFieldHtml: null,
      threadId: null,
      sentMail: false,
      isWelcomeMail: false,
      isLoading: false,
    };
  }

  componentDidMount() {
    const { currentlyOpenMailData, threadId } = this.props;
    if (currentlyOpenMailData[0].additionalInfo.value.senderInfo) {
      let recipientList = [];
      currentlyOpenMailData.forEach(openMailData => {
        if (openMailData.additionalInfo.value.senderInfo?.commonMetaData?.recepient) {
          openMailData.additionalInfo.value.senderInfo.commonMetaData.recepient.forEach(
            recepient => {
              recipientList.push(recepient);
            }
          );
        }
        if (openMailData.additionalInfo.value.recipientInfo?.commonMetaData?.recepient) {
          openMailData.additionalInfo.value.recipientInfo.commonMetaData.recepient.forEach(
            recepient => {
              recipientList.push(recepient);
            }
          );
        }
        if (openMailData.additionalInfo.value.recipientInfo?.commonMetaData?.sender) {
          recipientList.push(openMailData.additionalInfo.value.recipientInfo.commonMetaData.sender);
        }
      });
      let seen = {};
      let uniqueRecipients = recipientList.filter(function (item) {
        return seen.hasOwnProperty(item) ? false : (seen[item] = true);
      });

      this.setState({
        sentMail: true,
        threadId: threadId,
        toAllField: uniqueRecipients,
        toField:
          currentlyOpenMailData[0].additionalInfo.value.senderInfo.commonMetaData.recepient[0],
        subject: currentlyOpenMailData[0].additionalInfo.value.senderInfo.commonMetaData.subject,
      });
    } else {
      let recipientList = [];
      currentlyOpenMailData.forEach(openMailData => {
        if (openMailData.additionalInfo.value.recipientInfo?.commonMetaData?.recepient) {
          openMailData.additionalInfo.value.recipientInfo.commonMetaData.recepient.forEach(
            recepient => {
              recipientList.push(recepient);
            }
          );
        }
        if (openMailData.additionalInfo.value.senderInfo?.commonMetaData?.recepient) {
          openMailData.additionalInfo.value.senderInfo.commonMetaData.recepient.forEach(
            recepient => {
              recipientList.push(recepient);
            }
          );
        }
        if (openMailData.additionalInfo.value.recipientInfo?.commonMetaData?.sender) {
          recipientList.push(openMailData.additionalInfo.value.recipientInfo.commonMetaData.sender);
        }
      });

      let seen = {};
      let uniqueRecipients = recipientList.filter(function (item) {
        return seen.hasOwnProperty(item) ? false : (seen[item] = true);
      });

      this.setState({
        sentMail: false,
        threadId: threadId,
        toAllField: uniqueRecipients,
        toField: currentlyOpenMailData[0].additionalInfo.value.recipientInfo.commonMetaData.sender,
        subject: currentlyOpenMailData[0].additionalInfo.value.recipientInfo.commonMetaData.subject,
      });
    }

    window.addEventListener('dragenter', this.onDragOverEnter);
    window.addEventListener('dragover', this.onDragOverEnter);
    window.addEventListener('drop', this.onFileDrop);
    document.getElementById('replyFiles').addEventListener('dragleave', this.onDragLeave);
  }

  componentDidUpdate() {
    if (this.props.threadId !== this.state.threadId) {
      const { currentlyOpenMailData, threadId } = this.props;
      if (currentlyOpenMailData[0].additionalInfo.value.senderInfo) {
        let recipientList = [];
        currentlyOpenMailData.forEach(openMailData => {
          if (openMailData.additionalInfo.value.senderInfo?.commonMetaData?.recepient) {
            openMailData.additionalInfo.value.senderInfo.commonMetaData.recepient.forEach(
              recepient => {
                recipientList.push(recepient);
              }
            );
          }
          if (openMailData.additionalInfo.value.recipientInfo?.commonMetaData?.recepient) {
            openMailData.additionalInfo.value.recipientInfo.commonMetaData.recepient.forEach(
              recepient => {
                recipientList.push(recepient);
              }
            );
          }
          if (openMailData.additionalInfo.value.recipientInfo?.commonMetaData?.sender) {
            recipientList.push(
              openMailData.additionalInfo.value.recipientInfo.commonMetaData.sender
            );
          }
        });
        let seen = {};
        let uniqueRecipients = recipientList.filter(function (item) {
          return seen.hasOwnProperty(item) ? false : (seen[item] = true);
        });
        this.setState({
          sentMail: true,
          replyMessageBodyField: '',
          files: null,
          isError: false,
          message: '',
          replyField: false,
          replyAll: false,
          toAllFieldHtml: null,
          threadId: threadId,
          toAllField: uniqueRecipients,
          toField:
            currentlyOpenMailData[0].additionalInfo.value.senderInfo.commonMetaData.recepient[0],
          subject: currentlyOpenMailData[0].additionalInfo.value.senderInfo.commonMetaData.subject,
        });
      } else {
        let recipientList = [];
        currentlyOpenMailData.forEach(openMailData => {
          if (openMailData.additionalInfo.value.recipientInfo?.commonMetaData?.recepient) {
            openMailData.additionalInfo.value.recipientInfo.commonMetaData.recepient.forEach(
              recepient => {
                recipientList.push(recepient);
              }
            );
          }
          if (openMailData.additionalInfo.value.senderInfo?.commonMetaData?.recepient) {
            openMailData.additionalInfo.value.senderInfo.commonMetaData.recepient.forEach(
              recepient => {
                recipientList.push(recepient);
              }
            );
          }
          if (openMailData.additionalInfo.value.recipientInfo?.commonMetaData?.sender) {
            recipientList.push(
              openMailData.additionalInfo.value.recipientInfo.commonMetaData.sender
            );
          }
        });

        let seen = {};
        let uniqueRecipients = recipientList.filter(function (item) {
          return seen.hasOwnProperty(item) ? false : (seen[item] = true);
        });
        this.setState({
          sentMail: false,
          replyMessageBodyField: '',
          files: null,
          isError: false,
          message: '',
          replyField: false,
          replyAll: false,
          toAllFieldHtml: null,
          threadId: threadId,
          toAllField: uniqueRecipients,
          toField:
            currentlyOpenMailData[0].additionalInfo.value.recipientInfo.commonMetaData.sender,
          subject:
            currentlyOpenMailData[0].additionalInfo.value.recipientInfo.commonMetaData.subject,
        });
      }
    }
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

  replyFieldToggle = () => {
    this.setState({ replyField: true, replyAll: false });
  };

  onReplyFieldClose = () => {
    const { sentMail } = this.state;
    const { currentlyOpenMailData } = this.props;
    let recipientList = [],
      uniqueRecipients = [];
    if (sentMail) {
      currentlyOpenMailData.forEach(openMailData => {
        if (openMailData.additionalInfo.value.senderInfo?.commonMetaData?.recepient) {
          openMailData.additionalInfo.value.senderInfo.commonMetaData.recepient.forEach(
            recepient => {
              recipientList.push(recepient);
            }
          );
        }
        if (openMailData.additionalInfo.value.recipientInfo?.commonMetaData?.recepient) {
          openMailData.additionalInfo.value.recipientInfo.commonMetaData.recepient.forEach(
            recepient => {
              recipientList.push(recepient);
            }
          );
        }
        if (openMailData.additionalInfo.value.recipientInfo?.commonMetaData?.sender) {
          recipientList.push(openMailData.additionalInfo.value.recipientInfo.commonMetaData.sender);
        }
      });
      let seen = {};
      uniqueRecipients = recipientList.filter(function (item) {
        return seen.hasOwnProperty(item) ? false : (seen[item] = true);
      });
    } else {
      currentlyOpenMailData.forEach(openMailData => {
        if (openMailData.additionalInfo.value.recipientInfo?.commonMetaData?.recepient) {
          openMailData.additionalInfo.value.recipientInfo.commonMetaData.recepient.forEach(
            recepient => {
              recipientList.push(recepient);
            }
          );
        }
        if (openMailData.additionalInfo.value.senderInfo?.commonMetaData?.recepient) {
          openMailData.additionalInfo.value.senderInfo.commonMetaData.recepient.forEach(
            recepient => {
              recipientList.push(recepient);
            }
          );
        }
        if (openMailData.additionalInfo.value.recipientInfo?.commonMetaData?.sender) {
          recipientList.push(openMailData.additionalInfo.value.recipientInfo.commonMetaData.sender);
        }
      });

      let seen = {};
      uniqueRecipients = recipientList.filter(function (item) {
        return seen.hasOwnProperty(item) ? false : (seen[item] = true);
      });
    }
    this.updateToValueHTML(uniqueRecipients);
    this.setState({ replyField: false, toAllField: uniqueRecipients });
  };

  onToFieldRemove = event => {
    let { toAllField } = this.state;
    let index = parseInt(event.target.id.replaceAll(/toField/g, ''));
    toAllField.splice(index, 1);
    this.updateToValueHTML(toAllField);
    this.setState({ toAllField: toAllField });
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
    if (content.length > 8) {
      this.setState({ replyMessageBodyField: content, isError: false, message: '' });
    } else {
      this.setState({
        replyMessageBodyField: content,
        isError: true,
        message: 'Message body is empty',
      });
    }
  };

  onReply = async () => {
    const { dispatch, currentlyOpenMailData } = this.props;
    const { replyMessageBodyField, files, subject, toField, toAllField, replyAll } = this.state;
    const formData = new FormData();
    if (files) {
      for (let i = 0; i < files.length; i++) {
        formData.append('File', files[i], files[i].name);
      }
    }
    try {
      this.setState({ isLoading: true });
      await dispatch(
        mailActions.createMailTransaction({
          recipients: replyAll ? toAllField : Array.of(toField),
          threadId: currentlyOpenMailData[0].threadId,
          subject: subject,
          body: replyMessageBodyField,
        })
      );
      this.setState({
        isLoading: false,
        replyMessageBodyField: '',
        files: null,
        isError: false,
        message: 'Mail Sent Successfully!',
      });
      this.onReplyFieldClose();
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

  replyAllFieldToggle = () => {
    const { toAllField, replyAll } = this.state;
    if (!replyAll) {
      this.updateToValueHTML(toAllField);
    }
    this.setState({ replyField: true, replyAll: true });
  };

  updateToValueHTML = tempToValue => {
    let toValueHtml;
    toValueHtml = tempToValue
      .filter(toAddress => {
        if (toAddress) return true;
        return false;
      })
      .map((toAddress, index) => {
        return (
          <span key={index.toString()}>
            <span className='peach toFieldHighlight'>{toAddress}</span>
            {tempToValue.length > 1 ? (
              <span
                style={{ color: 'blue', cursor: 'pointer', margin: '0px 15px 0px 5px' }}
                id={'toField' + index}
                onClick={this.onToFieldRemove}>
                x
              </span>
            ) : (
              ''
            )}
          </span>
        );
      });
    this.setState({ toAllFieldHtml: toValueHtml });
  };

  fileNameList() {
    const { files } = this.state;
    if (files) {
      return Array.from(files).map((file, index) => {
        return (
          <Grid.Row key={index.toString()}>
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
  }

  replyAllToField() {
    const { replyAll, toField, toAllFieldHtml } = this.state;
    if (replyAll) {
      return (
        <span className='toFieldSpanEnvelope'>
          To:
          <span className='word-wrap'>{toAllFieldHtml}</span>
        </span>
      );
    } else {
      return (
        <span className='toFieldSpanEnvelope'>
          To:
          <span className='word-wrap'>
            <span className='peach toFieldHighlight'>{toField}</span>
          </span>
        </span>
      );
    }
  }

  renderFullMail() {
    const { currentlyOpenMailData } = this.props;
    let paddingLeft = 0;
    return currentlyOpenMailData.map((mail, index) => {
      let mailData = null,
        sentMail = false;

      if (mail.additionalInfo.value.senderInfo) {
        mailData = mail.additionalInfo.value.senderInfo;
        sentMail = true;
      } else {
        mailData = mail.additionalInfo.value.recipientInfo;
      }

      const blocksFromHtml = htmlToDraft(mailData.body);
      const { contentBlocks, entityMap } = blocksFromHtml;
      const contentState = ContentState.createFromBlockArray(contentBlocks, entityMap);
      const editorState = EditorState.createWithContent(contentState);
      if (index !== 0) {
        paddingLeft += 10;
      }
      let dateTime = null;
      if (mail.createdAt) {
        dateTime = format(new Date(mail.createdAt), 'dd-MM-yyyy hh:mm:ss');
      }
      return (
        <div key={index.toString()} className='fullMailBorder'>
          <Grid
            className={index !== 0 ? 'fullMailBorder' : ''}
            style={{ marginLeft: paddingLeft + 'px' }}>
            <Grid.Row>
              <Grid.Column computer={8} mobile={8} floated='left'>
                <span style={{ color: 'lightgrey' }} className='word-wrap purplefontcolor'>
                  {sentMail ? mailData.commonMetaData.recepient : mailData.commonMetaData.sender}{' '}
                </span>
                <span>
                  {sentMail ? (
                    <img alt='To' src={images.yellowArrow} className='toFromIcons' />
                  ) : (
                    <img alt='From' src={images.greenArrow} className='toFromIcons' />
                  )}
                </span>
              </Grid.Column>

              <Grid.Column computer={4} mobile={8} floated='right'>
                <span style={{ color: 'lightgrey', float: 'right' }} className='word-wrap'>
                  {dateTime}
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
              <Grid.Column
                className='recentTxidAddressColumn'
                computer={16}
                mobile={16}
                style={{ borderTop: '1px solid #fafafa', borderBottom: '1px solid #fafafa' }}>
                {mail.txId ? (
                  <>
                    <span className='monospace word-wrap'>
                      <span className='purplefontcolor'>TxID:</span> {mail.txId}
                    </span>{' '}
                    <Link to={'/explorer/transaction/' + mail.txId}>
                      <span className='padding10px'>
                        <i className='walletLink'></i>
                      </span>
                    </Link>
                  </>
                ) : (
                  ''
                )}
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </div>
      );
    });
  }

  render() {
    const { threadId } = this.props;
    const { isError, files, replyMessageBodyField, message, replyField, isLoading } = this.state;
    return (
      <>
        <Grid style={{}}>
          <Grid.Row>
            <Grid.Column computer={16} mobile={16} floated='right'>
              <div
                style={{
                  cursor: 'pointer',
                  color: 'red',
                  float: 'right',
                }}
                onClick={this.props.toggleFullMailPane}>
                X
              </div>
            </Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <Grid.Column computer={16} mobile={16}>
              {this.renderFullMail()}
              {threadId !== 'welcomemail' ? (
                <>
                  <div style={{ margin: '20px 0px 20px 0px' }}>
                    <button
                      onClick={this.replyFieldToggle}
                      style={{
                        padding: '10px',
                        cursor: 'pointer',
                        border: '0px',
                        color: 'blue',
                        backgroundColor: 'transparent',
                      }}>
                      Reply
                    </button>
                    <button
                      onClick={this.replyAllFieldToggle}
                      style={{
                        padding: '10px',
                        cursor: 'pointer',
                        border: '0px',
                        color: 'blue',
                        backgroundColor: 'transparent',
                      }}>
                      Reply All
                    </button>
                  </div>
                  <div className='colorGreen'>{isError ? '' : message}</div>
                  <br />
                  {replyField ? this.replyAllToField() : ''}
                  <div className={replyField ? 'displayBlock' : 'visibilityHidden'}>
                    <div
                      style={{
                        width: '100%',
                        display: 'block',
                        marginTop: '20px',
                        marginBottom: '20px',
                      }}>
                      <i
                        style={{ float: 'right', cursor: 'pointer' }}
                        className='close icon'
                        onClick={this.onReplyFieldClose}></i>
                    </div>
                    <br />
                    <div id='replyFiles' style={{ minHeight: '20%' }}>
                      <TextEditor
                        toolbarHidden={!replyField}
                        onMessageBodyFieldChange={this.onMessageBodyFieldChange}
                      />
                      <label htmlFor='attach-file'>
                        <Icon
                          name='paperclip'
                          size='large'
                          style={{ cursor: 'pointer', display: 'block', marginTop: '30px' }}
                        />
                      </label>
                      <Input
                        id='attach-file'
                        style={{ display: 'none' }}
                        type='file'
                        multiple='multiple'
                        onChange={this.onFilesAttach}
                      />
                    </div>
                    <div className='colorRed'>{isError ? message : ''}</div>
                    {files ? <Grid>{this.fileNameList()}</Grid> : ''}
                    <Button
                      className='coral'
                      loading={isLoading}
                      disabled={replyMessageBodyField ? (isError ? true : false) : true}
                      onClick={this.onReply}>
                      Send
                    </Button>
                  </div>
                </>
              ) : (
                ''
              )}
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </>
    );
  }

  componentWillUnmount() {
    window.removeEventListener('dragenter', this.onDragOverEnter);
    window.removeEventListener('dragover', this.onDragOverEnter);
    window.removeEventListener('drop', this.onFileDrop);
    document.getElementById('replyFiles').removeEventListener('dragleave', this.onDragLeave);
  }
}

RenderFullMail.propTypes = {};

RenderFullMail.defaultProps = {};

const mapStateToProps = state => ({});

export default withRouter(connect(mapStateToProps)(RenderFullMail));
