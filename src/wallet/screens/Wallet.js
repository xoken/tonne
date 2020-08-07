import React from 'react';

export default class Wallet extends React.Component {
  onCreateWallet = () => {
    this.props.history.push('/wallet/new');
  };

  onImportWallet = () => {
    this.props.history.push('/wallet/existing');
  };

  render() {
    return (
      <>
        <div className="container wallet-container">
          <div className="row align-items-center">
            <div className="col-sm-6">
              <div className="card text-center">
                <div className="card-body">
                  <h5 className="card-title">I already have a seed phrase</h5>
                  <p className="card-text">
                    Import your existing wallet using a 12 word seed phrase
                  </p>
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={this.onImportWallet}
                  >
                    Import wallet
                  </button>
                </div>
              </div>
            </div>
            <div className="col-sm-6">
              <div className="card text-center">
                <div className="card-body">
                  <h5 className="card-title">Yes, let's get set up!</h5>
                  <p className="card-text">
                    This will create a new wallet and seed phrase
                  </p>
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={this.onCreateWallet}
                  >
                    Create a Wallet
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }
}
