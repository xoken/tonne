import React from 'react';
import { connect } from 'react-redux';
import { Button, Modal, Grid, Checkbox, Input } from 'semantic-ui-react';
import * as authActions from '../../auth/authActions';

class BuyAllpayName extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      searchedName: '',
      searchResultsSuggestions: false,
      namespace: false,
    };
  }

  onSearch = () => {
    if (this.state.searchedName) {
      this.setState({ searchResultsSuggestions: true });
    } else {
      this.setState({ searchResultsSuggestions: false });
    }
  };

  searchResultsSuggestionsArea = () => {
    const { namespace, searchedName, searchResultsSuggestions } = this.state;
    function isnamespace() {
      if (namespace && searchedName) {
        return (
          <>
            <Grid.Column width={8}>
              <b>{searchedName}</b> is available
            </Grid.Column>
            <Grid.Column width={8}>
              <Button>Buy</Button>
              <Checkbox label='Add reseller Rights' defaultChecked />
            </Grid.Column>
          </>
        );
      } else {
        return (
          <>
            <Grid.Column width={8}>
              <b>xyz-{searchedName}</b> is available
            </Grid.Column>
            <Grid.Column width={8}>
              <Button>Buy</Button>
              <Checkbox label='Add reseller Rights' />
            </Grid.Column>
          </>
        );
      }
    }
    if (searchResultsSuggestions) {
      return (
        <>
          <Grid.Row columns={1}>
            <Grid.Column width={16}>
              <Grid>
                <Grid.Row columns={1}>{isnamespace()}</Grid.Row>
              </Grid>
            </Grid.Column>
          </Grid.Row>
        </>
      );
    }
  };
  onNamespaceCheckClick = () => {
    this.setState({ namespace: !this.state.namespace });
  };

  render() {
    return (
      <>
        <Modal.Header>
          Buy Allpay name<i className='close icon' onClick={this.props.onClose}></i>
        </Modal.Header>
        <Modal.Content>
          <Modal.Description>
            <Grid centered>
              <Grid.Row columns={3} centered>
                <Grid.Column width={3} centered></Grid.Column>
                <Grid.Column width={10} centered>
                  <Input
                    fluid
                    type='text'
                    placeholder='Enter a name you want to purchase'
                    action
                    onChange={event => this.setState({ searchedName: event.target.value })}>
                    <input />
                    <Button color='yellow' onClick={this.onSearch}>
                      Search
                    </Button>
                  </Input>
                  <Checkbox label='Namespace' onClick={this.onNamespaceCheckClick} />
                </Grid.Column>
                <Grid.Column width={3} centered></Grid.Column>
              </Grid.Row>
              {this.searchResultsSuggestionsArea()}
            </Grid>
          </Modal.Description>
        </Modal.Content>
      </>
    );
  }
}

const mapStateToProps = state => ({});

export default connect(mapStateToProps)(BuyAllpayName);
