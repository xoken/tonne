import React from 'react';
import { connect } from 'react-redux';
import { Button, Form, Modal } from 'semantic-ui-react';
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
    this.setState({ searchResultsSuggestions: true });
  };

  searchResultsSuggestionsArea = () => {
    const { namespace, searchedName } = this.state;
    function isnamespace() {
      if (namespace) {
        return <Checkbox label='Add reseller Rights' defaultChecked />;
      } else {
        return <Checkbox label='Add reseller Rights' />;
      }
    }
    if (searchResultsSuggestions) {
      return (
        <>
          <Grid.Row columns={1}>
            <Grid.Column width={16}>
              <Grid>
                <Grid.Row columns={1}>
                  <Grid.Column width={8}>{searchedName} is available</Grid.Column>
                  <Grid.Column width={8}>
                    <Button>Buy</Button>
                    {isnamespace()}
                  </Grid.Column>
                </Grid.Row>
              </Grid>
            </Grid.Column>
          </Grid.Row>
        </>
      );
    } else {
      <></>;
    }
  };

  render() {
    return (
      <>
        <Modal.Header>Buy Allpay name</Modal.Header>
        <Modal.Content>
          <Modal.Description>
            <Grid>
              <Grid.Row columns={1}>
                <Grid.Column width={16}>
                  <Form>
                    <Form.Group>
                      <Form.Field
                        label='Name to be purchased'
                        placeholder='Enter a name you want to purchase'
                      />
                      <Form.Field
                        control={Button}
                        content='Search'
                        label='Search'
                        onClick={this.onSearch}
                      />
                      <Checkbox label='Namespace' onChange={this.setState({ namespace: true })} />
                    </Form.Group>
                  </Form>
                </Grid.Column>
              </Grid.Row>
              {this.searchResultsSuggestionsArea}
            </Grid>
          </Modal.Description>
        </Modal.Content>
      </>
    );
  }
}

const mapStateToProps = state => ({});

export default connect(mapStateToProps)(BuyAllpayName);
