import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Button, Grid, Input, Divider, Icon, TextArea } from 'semantic-ui-react';
import * as mailSelectors from '../mailSelectors';
import { EditorState, ContentState } from 'draft-js';
import htmlToDraft from 'html-to-draftjs';
import { Editor } from 'react-draft-wysiwyg';
import '../../../node_modules/react-draft-wysiwyg/dist/react-draft-wysiwyg.css';

class RenderFullMail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  renderFullMail = () => {
    const { currentlyOpenMailData } = this.props;
    return currentlyOpenMailData.map((mail, index) => {
      console.log(mail);
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
        <Grid>
          <Grid.Row>
            <Grid.Column computer={8} mobile={8} floated='left'>
              <span style={{ color: 'lightgrey' }} className='word-wrap'>
                {sentMail ? mailData.commonMetaData.recepient : mailData.commonMetaData.sender}{' '}
              </span>
              <span>
                {mailData ? (
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
        </Grid>
      );
    });
  };

  render() {
    const { currentlyOpenMailThreadId, currentlyOpenMailData } = this.props;
    return (
      <>
        {' '}
        <Grid
          style={{
            boxShadow: '5px 5px 5px #fafafa',
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
