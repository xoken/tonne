import React from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';

class TwitterAuthSuccess extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    const {
      location: { search },
    } = this.props;
    window.opener.postMessage(search, 'http://127.0.0.1:3000');
  }

  render() {
    return null;
  }
}

const mapStateToProps = state => ({});

export default withRouter(connect(mapStateToProps)(TwitterAuthSuccess));
