import React from 'react';
//import axios from 'axios';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { Button, Grid, Input, Icon, Loader } from 'semantic-ui-react';
import TextEditor from '../components/TextEditor';
import * as mailActions from '../mailActions';
import * as mailSelectors from '../mailSelectors';
import { allPay } from 'allegory-allpay-sdk';

class SendMail extends React.Component {
  constructor(props) {
    super(props);
    this.maxWidthRef = React.createRef();
    this.toFieldWidthRef = React.createRef();
    this.state = {
      files: null,
      attachFileModal: false,
      toField: [],
      subjectField: '',
      messageBodyField: '',
      message: '',
      isError: false,
      toFieldHtml: [],
      toFieldTemp: '',
      toFieldWidth: 0,
      isLoading: false,
    };
  }
  maxWidth = 0;

  onCancel = () => {
    this.props.onCancel();
  };

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
    // window.addEventListener('dragenter', this.onDragOverEnter);
    // window.addEventListener('dragover', this.onDragOverEnter);
    // window.addEventListener('drop', this.onFileDrop);
    // document.getElementById('files').addEventListener('dragleave', this.onDragLeave);
    this.setState({ toFieldWidth: this.maxWidthRef.current.offsetWidth - 27 });
    this.maxWidth = this.maxWidthRef.current.offsetWidth;
  }

  componentWillUnmount() {
    // window.removeEventListener('dragenter', this.onDragOverEnter);
    // window.removeEventListener('dragover', this.onDragOverEnter);
    // window.removeEventListener('drop', this.onFileDrop);
    // document.getElementById('file-attach').removeEventListener('dragleave', this.onDragLeave);
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
    const { isError } = this.state;
    if (isError) {
      this.setState({ messageBodyField: content, isError: false, message: '' });
    } else {
      this.setState({ messageBodyField: content });
    }
  };

  onToFieldChange = event => {
    const { toField, toFieldRows, toFieldTemp } = this.state;
    let eventTargetValue = event.target.value.toLowerCase();
    let uniqueRecipients = [];
    let maxWidthOfInput = this.maxWidthRef.current.offsetWidth;
    let fourthWidth = Math.floor(this.maxWidthRef.current.offsetWidth / 4);
    let currentToFieldWidth = this.toFieldWidthRef.current.offsetWidth;
    if (event.key === 'Enter' || event.key === 'Tab') {
      eventTargetValue += ' ';
    }
    let tempToValue = toField,
      temp = eventTargetValue.split(/[ ,\t]+/);
    if (/[ ,]+/g.test(eventTargetValue)) {
      updateToField(temp.length);
      this.setState({
        toField: uniqueRecipients,
        toFieldTemp: '',
        toFieldWidth: fourthWidth,
        isError: false,
        message: '',
      });
    } else {
      updateToField(temp.length - 1);
      this.setState({
        toField: uniqueRecipients,
        toFieldTemp: eventTargetValue,
        isError: false,
        message: '',
      });
    }
    function updateToField(tempLength) {
      for (var i = 0; i < tempLength; i++) {
        tempToValue.push(temp[i]);
      }
      uniqueRecipients = tempToValue.filter(function (item, position, self) {
        return self.indexOf(item) == position;
      });
    }

    this.updateToValueHTML(uniqueRecipients);

    if (event.target.value.length * 10 > fourthWidth && currentToFieldWidth < maxWidthOfInput) {
      if (event.target.value.length * 9 >= maxWidthOfInput - 27) {
        this.setState({
          toFieldWidth: maxWidthOfInput - 27,
        });
      } else {
        this.setState({
          toFieldWidth: event.target.value.length * 9,
        });
      }
    }
  };

  updateToValueHTML = tempToValue => {
    let toValueHtml;
    toValueHtml = tempToValue.map((toAddress, index) => {
      if (toAddress) {
        return (
          <span key={index.toString()}>
            <span className='peach toFieldHighlight'>{toAddress}</span>
            <span
              style={{ color: 'blue', cursor: 'pointer', margin: '0px 15px 0px 5px' }}
              id={'toField' + index}
              onClick={this.onToFieldRemove}>
              x
            </span>
          </span>
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
    if (toField.length > 0) {
      this.setState({ toField: toField });
    } else {
      this.setState({
        toField: toField,
        isError: true,
        message: 'To Field/recipients field is empty',
      });
    }
  };

  onSend = async () => {
    const { dispatch, isLoadingMailTransactions } = this.props;
    const { toField, subjectField, messageBodyField, files, toFieldTemp } = this.state;
    let filteredToField = [],
      closeModalTimer = 0;
    const formData = new FormData();
    if (files) {
      for (let i = 0; i < files.length; i++) {
        formData.append('File', files[i], files[i].name);
      }
    }
    if (toField.length > 0) {
      filteredToField = toField.filter(function (addressName) {
        return addressName !== '';
      });

      if (filteredToField.length !== 0) {
        try {
          this.setState({ isLoading: true });
          await dispatch(
            mailActions.createMailTransaction({
              recipients: filteredToField,
              threadId: null,
              subject: subjectField,
              body: messageBodyField,
            })
          );

          this.setState({
            isLoading: false,
            subjectField: '',
            messageBodyField: '',
            toField: [],
            toFieldHtml: [],
            toFieldTemp: '',
            files: null,
            isError: false,
            message: 'Mail Sent Successfully!',
          });

          closeModalTimer = setTimeout(this.onCancel, 1500);
        } catch (error) {
          clearTimeout(closeModalTimer);
          closeModalTimer = 0;
          this.setState({
            isError: true,
            message: error.response && error.response.data ? error.response.data : error.message,
          });
        }
      }
    } else {
      this.setState({ isError: true, message: 'One or more fields are empty' });
    }
  };

  onToFieldBlur = () => {
    const { toFieldTemp, toField } = this.state;
    let tempToField = toField;
    if (toFieldTemp) {
      tempToField.push(toFieldTemp);
      this.setState({
        toField: tempToField,
        toFieldTemp: '',
        toFieldWidth: Math.floor(this.maxWidthRef.current.offsetWidth / 4),
      });
      this.updateToValueHTML(tempToField);
    }
  };

  render() {
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
      isLoading,
    } = this.state;
    const { isLoadingMailTransactions } = this.props;
    return (
      <>
        <Grid>
          <Grid.Row>
            <Grid.Column>
              <span className='toFieldSpanEnvelope' style={{ width: this.maxWidth + 'px' }}>
                <span>To:</span>
                <span ref={this.toFieldWidthRef}>
                  <Input
                    rows='1'
                    id='toField'
                    type='text'
                    style={{ width: toFieldWidth + 'px' }}
                    value={toFieldTemp}
                    className='form-control toField'
                    onChange={this.onToFieldChange}
                    onKeyDown={event =>
                      event.key === 'Enter' || event.key === 'Tab'
                        ? this.onToFieldChange(event)
                        : ''
                    }
                    onBlur={this.onToFieldBlur}
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
              <span
                id='files'
                style={{ minHeight: '20%', display: 'block' }}
                ref={this.maxWidthRef}>
                <TextEditor
                  toolbarHidden={false}
                  onMessageBodyFieldChange={this.onMessageBodyFieldChange}
                />
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
              {
                // <label htmlFor='file-attach'>
                //   <Icon
                //     name='paperclip'
                //     size='large'
                //     style={{ cursor: 'pointer' }}
                //     //  onClick={this.toggleAttachFileModal}
                //   />
                // </label>
                // <Input
                //   id='file-attach'
                //   style={{ display: 'none' }}
                //   type='file'
                //   icon='paperclip'
                //   multiple='multiple'
                //   onChange={this.onFilesAttach}
                // />
              }
            </Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <Grid.Column>
              {
                // files ? <Grid>{this.fileNameList()}</Grid> : ''
              }
              <div className={isError ? 'colorRed' : 'colorGreen'}>{message}</div>
            </Grid.Column>
          </Grid.Row>
          <Grid.Row centered>
            <Grid.Column>
              {isLoading ? (
                <Loader active />
              ) : (
                <Button
                  className='coral'
                  disabled={toField ? (subjectField ? (isError ? true : false) : true) : true}
                  onClick={this.onSend}>
                  Send
                </Button>
              )}{' '}
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

SendMail.propTypes = {};

SendMail.defaultProps = {};

const mapStateToProps = state => ({
  isLoadingMailTransactions: mailSelectors.isLoadingMailTransactions(state),
});

export default withRouter(connect(mapStateToProps)(SendMail));
