import React from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { Grid } from 'semantic-ui-react';
import ImportWallet from '../components/ImportWallet';

class ImportWalletScreen extends React.Component {
  onContinue = () => {
    this.props.history.push('/wallet/password');
  };

  render() {
    return (
      <Grid verticalAlign='middle' style={{ height: '100%' }}>
        <Grid.Row>
          <Grid.Column width={16}>
            <ImportWallet onContinue={this.onContinue} />
          </Grid.Column>
        </Grid.Row>
      </Grid>
    );
  }
}

ImportWalletScreen.propTypes = {};

ImportWalletScreen.defaultProps = {};

const mapStateToProps = state => ({});

export default withRouter(connect(mapStateToProps)(ImportWalletScreen));
