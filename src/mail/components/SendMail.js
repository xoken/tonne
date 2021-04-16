import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { Button, Grid, Input, Icon } from 'semantic-ui-react';
import TextEditor from '../components/TextEditor';
import * as mailActions from '../mailActions';
import * as mailSelectors from '../mailSelectors';

class SendMail extends React.Component {
  constructor(props) {
    super(props);
    this.maxWidthRef = React.createRef();
    this.toFieldWidthRef = React.createRef();
    this.maxWidth = 0;
    this.state = {
      files: [],
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

  componentDidMount() {
    this.setState({ toFieldWidth: this.maxWidthRef.current.offsetWidth - 27 });
    this.maxWidth = this.maxWidthRef.current.offsetWidth;
  }

  onCancel = () => {
    this.props.onCancel();
  };

  toggleAttachFileModal = () => {
    const { attachFileModal } = this.state;
    this.setState({ attachFileModal: !attachFileModal });
  };

  onAttach = event => {
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

  onDragOverEnter = event => {
    event.preventDefault();
  };

  onDragLeave = event => {
    event.stopPropagation();
    event.preventDefault();
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
    const { toField } = this.state;
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
        return self.indexOf(item) === position;
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
    toValueHtml = tempToValue
      .filter(toAddress => {
        if (toAddress) return true;
        return false;
      })
      .map((toAddress, index) => {
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
    const { dispatch } = this.props;
    const { toField, subjectField, messageBodyField, files } = this.state;
    if (toField.length > 0) {
      const filteredToField = toField.filter(function (addressName) {
        return addressName !== '';
      });

      if (filteredToField.length > 0) {
        try {
          this.setState({ isLoading: true });
          await dispatch(
            mailActions.createMailTransaction({
              recipients: filteredToField,
              threadId: null,
              subject: subjectField,
              body: messageBodyField,
              attachments: files,
            })
          );

          this.setState({
            isLoading: false,
            subjectField: '',
            messageBodyField: '',
            toField: [],
            toFieldHtml: [],
            toFieldTemp: '',
            files: [],
            isError: false,
            message: 'Mail Sent Successfully!',
          });

          this.dismissModal = setTimeout(this.onCancel, 1500);
        } catch (error) {
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

  render() {
    const {
      message,
      toField,
      toFieldTemp,
      toFieldHtml,
      subjectField,
      toFieldWidth,
      isError,
      isLoading,
    } = this.state;
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
              <div ref={this.maxWidthRef}>
                <TextEditor
                  toolbarHidden={false}
                  onMessageBodyFieldChange={this.onMessageBodyFieldChange}
                />
              </div>
            </Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <Grid.Column width='16'>
              <label htmlFor='attach-file' className='attach-file'>
                <Icon name='paperclip' size='large' />
              </label>
              <Input
                id='attach-file'
                // style={{ display: 'none' }}
                type='file'
                multiple='multiple'
                onChange={this.onAttach}
              />
            </Grid.Column>
          </Grid.Row>
          {isError && (
            <Grid.Row>
              <Grid.Column>
                <div className='colorRed'>{message}</div>
              </Grid.Column>
            </Grid.Row>
          )}
          {this.renderAttachments()}
          <Grid.Row centered>
            <Grid.Column>
              <Button
                className='coral'
                loading={isLoading}
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
      </>
    );
  }

  componentWillUnmount() {}
}

SendMail.propTypes = {};

SendMail.defaultProps = {};

const mapStateToProps = state => ({
  isLoadingMailTransactions: mailSelectors.isLoadingMailTransactions(state),
});

export default withRouter(connect(mapStateToProps)(SendMail));
