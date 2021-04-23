import React from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { Grid } from 'semantic-ui-react';
import ImportWallet from '../components/ImportWallet';

class ImportWalletScreen extends React.Component {
  onContinue = () => {
    const {
      history,
      location: { pathname },
    } = this.props;
    if (pathname === '/mail/existing') {
      history.push('/mail/password');
    } else {
      history.push('/wallet/password');
    }
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
