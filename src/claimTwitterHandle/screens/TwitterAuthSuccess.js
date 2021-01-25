import React from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';

class TwitterAuthSuccess extends React.Component {
  componentDidMount() {
    const {
      location: { search },
    } = this.props;
    window.opener.postMessage(search, window.location.origin);
  }

  render() {
    return null;
  }
}

const mapStateToProps = state => ({});

export default withRouter(connect(mapStateToProps)(TwitterAuthSuccess));
