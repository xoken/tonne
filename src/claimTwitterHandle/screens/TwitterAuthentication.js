import React from 'react';
import { Link } from 'react-router-dom';

export default class TwitterAuthentication extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <p>Twitter Auth</p>
        <Link to='/claim-twitter-handle/home' className='ui coral button'>
          home
        </Link>
      </div>
    );
  }
}
