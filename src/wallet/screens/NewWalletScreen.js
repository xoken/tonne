import React from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { Grid } from 'semantic-ui-react';
import NewWallet from '../components/NewWallet';

class NewWalletScreen extends React.Component {
  onContinue = () => {
    const {
      history,
      location: { pathname },
    } = this.props;
    if (pathname === '/mail/new') {
      history.push('/mail/password');
    } else {
      history.push('/wallet/password');
    }
  };

  render() {
    return (
      <Grid verticalAlign='middle' style={{ height: '100%' }} className='paddingBottom100px'>
        <Grid.Row>
          <Grid.Column width={16}>
            <NewWallet onContinue={this.onContinue} />
          </Grid.Column>
        </Grid.Row>
      </Grid>
    );
  }
}

NewWalletScreen.propTypes = {};

NewWalletScreen.defaultProps = {};

const mapStateToProps = state => ({});

export default withRouter(connect(mapStateToProps)(NewWalletScreen));
