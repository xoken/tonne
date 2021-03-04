import React from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { Grid } from 'semantic-ui-react';
import ImportWallet from '../../wallet/components/ImportWallet';

class ImportWalletScreen extends React.Component {
  onContinue = () => {
    this.props.history.push('/mail/password');
  };

  render() {
    return (
      <div className='paddingBottom100px'>
        <Grid verticalAlign='middle' style={{ height: '100%', paddingTop: '30px' }}>
          <Grid.Row>
            <Grid.Column width={16}>
              <ImportWallet onContinue={this.onContinue} />
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </div>
    );
  }
}

ImportWalletScreen.propTypes = {};

ImportWalletScreen.defaultProps = {};

const mapStateToProps = state => ({});

export default withRouter(connect(mapStateToProps)(ImportWalletScreen));
