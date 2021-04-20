import React from 'react';
import { connect } from 'react-redux';
import { withRouter, Link } from 'react-router-dom';
import { Button, Grid, Icon, Input } from 'semantic-ui-react';
import { EditorState, ContentState } from 'draft-js';
import htmlToDraft from 'html-to-draftjs';
import { Editor } from 'react-draft-wysiwyg';
import TextEditor from '../components/TextEditor';
import { format } from 'date-fns';
import { wallet } from 'allegory-allpay-sdk';
import images from '../../shared/images';
import * as mailActions from '../mailActions';
class RenderFullMail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      replyMessageBodyField: '',
      files: [],
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
  to = '';
  uniqueRecipients = [];

  findUniqueRecipients(recipientList, updateTo) {
    const { allpayHandles } = this.props;
    this.uniqueRecipients = Array.from(new Set(recipientList));

    let u = this.uniqueRecipients.indexOf(allpayHandles[0]);

    if (u > -1 && this.uniqueRecipients.length !== 1) {
      this.uniqueRecipients.splice(u, 1);
      if (updateTo) {
        if (this.uniqueRecipients[0] === allpayHandles[0]) {
          this.to = this.uniqueRecipients[1];
        } else {
          this.to = this.uniqueRecipients[0];
        }
      }
    } else if (updateTo) {
      this.to = this.uniqueRecipients[0];
    }
  }

  componentDidMount() {
    const { currentlyOpenMailData, threadId } = this.props;
    let subject = '',
      sentMail = false;
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

      this.findUniqueRecipients(recipientList, true);
      subject =
        'Re: ' + currentlyOpenMailData[0].additionalInfo.value.senderInfo.commonMetaData.subject;
      sentMail = true;
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

      this.findUniqueRecipients(recipientList, false);
      this.to = currentlyOpenMailData[0].additionalInfo.value.recipientInfo.commonMetaData.sender;
      subject =
        'Re: ' + currentlyOpenMailData[0].additionalInfo.value.recipientInfo.commonMetaData.subject;
      sentMail = false;
    }
    this.setState({
      sentMail: sentMail,
      threadId: threadId,
      toAllField: this.uniqueRecipients,
      toField: this.to,
      subject: subject,
    });

    if (threadId !== 'welcome-mail') {
      window.addEventListener('dragenter', this.onDragOverEnter);
      window.addEventListener('dragover', this.onDragOverEnter);
      window.addEventListener('drop', this.onFileDrop);
      document.getElementById('replyFiles').addEventListener('dragleave', this.onDragLeave);
    }
  }

  componentDidUpdate() {
    if (this.props.threadId !== this.state.threadId) {
      const { currentlyOpenMailData, threadId } = this.props;
      let sentMail = false,
        subject = '';
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

        this.findUniqueRecipients(recipientList, true);
        sentMail = true;
        subject =
          'Re: ' + currentlyOpenMailData[0].additionalInfo.value.senderInfo.commonMetaData.subject;
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

        this.findUniqueRecipients(recipientList, false);
        sentMail = false;
        subject =
          'Re: ' +
          currentlyOpenMailData[0].additionalInfo.value.recipientInfo.commonMetaData.subject;
        this.to = currentlyOpenMailData[0].additionalInfo.value.recipientInfo.commonMetaData.sender;
      }
      this.setState({
        sentMail: sentMail,
        replyMessageBodyField: '',
        files: null,
        isError: false,
        message: '',
        replyField: false,
        replyAll: false,
        toAllFieldHtml: null,
        threadId: threadId,
        toAllField: this.uniqueRecipients,
        toField: this.to,
        subject: subject,
      });
      const dragDropArea = document.getElementById('replyFiles');

      if (dragDropArea && dragDropArea.getAttribute('listener') !== 'true') {
        window.addEventListener('dragenter', this.onDragOverEnter);
        window.addEventListener('dragover', this.onDragOverEnter);
        window.addEventListener('drop', this.onFileDrop);
        dragDropArea.addEventListener('dragleave', this.onDragLeave);
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
    for (let z = 0; z < tempFiles.length; z++) {
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
    let recipientList = [];
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
      this.findUniqueRecipients(recipientList, false);
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

      this.findUniqueRecipients(recipientList, false);
    }
    this.updateToValueHTML(this.uniqueRecipients);
    this.setState({ replyField: false, toAllField: this.uniqueRecipients });
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
          attachments: files,
        })
      );
      this.setState({
        isLoading: false,
        replyMessageBodyField: '',
        files: [],
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
    const newFiles = [...files, ...event.target.files];
    const fileSize = newFiles.reduce((acc, currFile) => {
      return acc + currFile.size;
    }, 0);
    if (fileSize > 1000000) {
      this.setState({
        isError: true,
        message: 'Total size of all files cannot be larger than 1MB',
      });
    } else {
      this.setState({ files: newFiles, isError: false, message: '' });
    }
  };

  onDownload = args => () => {
    wallet.downloadAttachment(args);
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

  renderAttachments() {
    const { files } = this.state;
    if (files.length > 0) {
      return (
        <Grid.Row>
          <Grid.Column>
            {files.map((file, index) => {
              return (
                <div className='ui label attachment' key={index.toString()}>
                  {file.name}
                  <i className='delete icon' onClick={this.onRemoveAttachedFile}></i>
                </div>
              );
            })}
          </Grid.Column>
        </Grid.Row>
      );
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

  renderRecipientNames(recipients) {
    return recipients.map((recipient, index) => {
      return (
        <span key={index.toString()}>
          {recipient}
          {index < recipients.length - 1 ? ', ' : ''}
        </span>
      );
    });
  }

  renderAttachmentList(attachments, txId) {
    return attachments
      .map((attachment, index) => ({ attachmentDetail: attachment, attachmentIndex: index }))
      .filter((attachment, index) => {
        if (index === 0 && attachment.attachmentDetail[1] === 'text/html') return false;
        return true;
      })
      .map((attachment, index) => {
        return (
          <div
            key={index.toString()}
            className='attachedFiles'
            onClick={this.onDownload({
              txId,
              attachmentIndex: attachment.attachmentIndex,
            })}>
            <div>
              <img alt='Attached-File' style={{ width: '40px' }} src={images.file} />
            </div>
            <div className='word-wrap'>
              {attachment.attachmentDetail[0].length > 20
                ? attachment.attachmentDetail[0].substr(0, 19) +
                  '...' +
                  attachment.attachmentDetail[0].substr(attachment.attachmentDetail[0].length - 5)
                : attachment.attachmentDetail[0]}
            </div>
          </div>
        );
      });
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
                  {sentMail
                    ? this.renderRecipientNames(mailData.commonMetaData.recepient)
                    : mailData.commonMetaData.sender}
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
              <Grid.Column>
                {this.renderAttachmentList(mailData.commonMetaData.attachmentTypes, mail.txId)}
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
                  padding: '8px',
                  color: 'red',
                  marginBottom: '20px',
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
              {threadId !== 'welcome-mail' ? (
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
                      <label htmlFor='attach-file-reply'>
                        <Icon
                          name='paperclip'
                          size='large'
                          style={{
                            cursor: 'pointer',
                            display: 'block',
                            margin: '30px 0px 30px 0px',
                          }}
                        />
                      </label>
                      <Input
                        id='attach-file-reply'
                        style={{ display: 'none' }}
                        type='file'
                        multiple='multiple'
                        onChange={this.onFilesAttach}
                      />
                    </div>
                    <div className='colorRed'>{isError ? message : ''}</div>
                    {files && files.length > 0 ? <Grid>{this.renderAttachments()}</Grid> : ''}
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
    const dragDropArea = document.getElementById('replyFiles');
    if (dragDropArea && dragDropArea.getAttribute('listener') === 'true') {
      window.removeEventListener('dragenter', this.onDragOverEnter);
      window.removeEventListener('dragover', this.onDragOverEnter);
      window.removeEventListener('drop', this.onFileDrop);
      document.getElementById('replyFiles').removeEventListener('dragleave', this.onDragLeave);
    }
  }
}

RenderFullMail.propTypes = {};

RenderFullMail.defaultProps = {};

const mapStateToProps = state => ({ allpayHandles: state.wallet.allpayHandles });

export default withRouter(connect(mapStateToProps)(RenderFullMail));
