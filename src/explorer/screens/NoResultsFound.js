import React from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { Segment } from 'semantic-ui-react';

class NoResultsFound extends React.Component {
  render() {
    return (
      <Segment.Group>
        <Segment className='cen'>No results found</Segment>
      </Segment.Group>
    );
  }
}

const mapStateToProps = state => ({});

export default withRouter(connect(mapStateToProps)(NoResultsFound));
