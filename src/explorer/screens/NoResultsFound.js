import React from 'react';
import { Link, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';

class NoResultsFound extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <>
        <div className='cen'>
          <div>No results found</div>
        </div>
      </>
    );
  }
}

const mapStateToProps = state => ({});

export default withRouter(connect(mapStateToProps)(NoResultsFound));
