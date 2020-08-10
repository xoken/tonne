import React from 'react';

function Login() {
  return (
    <div id="authpop">
      <div className="container">
        <div className="row">
          <div className="col-md-12 col-lg-12">
            <div className="form-group">
              <label htmlFor="username">Enter Username</label>
              <input
                type="text"
                className="form-control"
                id="username"
                placeholder="Enter username"
              />
            </div>
            <div className="form-group">
              <label htmlFor="password">Enter Password</label>
              <input
                type="password"
                className="form-control"
                id="password"
                placeholder="Password"
              />
            </div>
            <div className="form-group">
              <label htmlFor="hostname">Enter hostname</label>
              <input
                type="text"
                className="form-control"
                id="hostname"
                placeholder="hostname"
              />
            </div>

            <div className="form-group">
              <label htmlFor="port">Enter Port number</label>
              <input
                type="text"
                className="form-control"
                id="portnumber"
                placeholder="port number"
              />
            </div>
            <div style={{ textAlign: 'center' }}>
              <input
                className="btn btn-primary"
                type="button"
                id="submitcredentials"
                value="Authenticate"
              />
            </div>
            <div id="authmessage"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
