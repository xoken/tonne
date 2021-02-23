import React, { Component } from 'react';
import { EditorState, convertToRaw } from 'draft-js';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { Editor } from 'react-draft-wysiwyg';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';
import { Grid } from 'semantic-ui-react';
import '../../../node_modules/react-draft-wysiwyg/dist/react-draft-wysiwyg.css';

class TextEditor extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      editorState: EditorState.createEmpty(),
    };
  }

  onEditorStateChange: Function = editorState => {
    const { onMessageBodyFieldChange } = this.props;
    this.setState({
      editorState,
    });
    onMessageBodyFieldChange(draftToHtml(convertToRaw(editorState.getCurrentContent())));
  };

  render() {
    const { editorState } = this.state;
    return (
      <Editor
        editorState={editorState}
        placeholder='Type your message here / Drop files here...'
        wrapperClassName='demo-wrapper'
        editorClassName='demo-editor'
        onEditorStateChange={this.onEditorStateChange}
      />
    );
  }
}

TextEditor.propTypes = {};

TextEditor.defaultProps = {};

const mapStateToProps = state => ({});

export default withRouter(connect(mapStateToProps)(TextEditor));
