import React from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';

class NoResultsFound extends React.Component {
  render() {
    return (
      <div className='cen'>
        <div>No results found</div>
      </div>
    );
  }
}

const mapStateToProps = state => ({});

export default withRouter(connect(mapStateToProps)(NoResultsFound));
