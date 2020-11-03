import React from 'react';
import { connect } from 'react-redux';
import { Button, Grid, Header, Checkbox, Input, GridColumn } from 'semantic-ui-react';

class BuyName extends React.Component {
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

  renderSearchResult() {
    const { namespace, searchedName, searchResultsSuggestions } = this.state;
    // function isnamespace() {
    //   if (namespace && searchedName) {
    //     return (
    //       <>
    //         <Grid.Column width={8}>
    //           <b>{searchedName}</b> is available
    //         </Grid.Column>
    //         <Grid.Column width={8}>
    //           <Button>Buy</Button>
    //           <Checkbox label='Add reseller Rights' defaultChecked />
    //         </Grid.Column>
    //       </>
    //     );
    //   } else {
    //     return (
    //       <>
    //         <Grid.Column width={8}>
    //           <b>xyz-{searchedName}</b> is available
    //         </Grid.Column>
    //         <Grid.Column width={8}>
    //           <Button>Buy</Button>
    //           <Checkbox label='Add reseller Rights' />
    //         </Grid.Column>
    //       </>
    //     );
    //   }
    // }
    if (true) {
      return (
        <>
          <div class='ten wide column centered row'>
            <div className='column'>
              <div class='ui clearing segment'>
                <div class='ui grid'>
                  <div class='row'>
                    <div class='six wide middle aligned column'>
                      <h4 class='ui header'>
                        Shubendra.com is available
                        {/* <div class='sub header'>$10.99</div> */}
                      </h4>
                    </div>
                    <div class='right floated right aligned six wide column'>
                      <div class='ui label'>20 BSV</div>
                      <div>
                        <Button>Buy</Button>
                        <div>
                          <Checkbox label='Add reseller Rights' />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      );
    }
  }
  onNamespaceCheckClick = () => {
    this.setState({ namespace: !this.state.namespace });
  };

  render() {
    return (
      <>
        <Header as='h2' textAlign='center'>
          Buy Allpay name
        </Header>
        <div class='ui grid'>
          <div class='ten wide column centered row'>
            <div className='column'>
              <Input
                fluid
                placeholder='Enter a name you want to purchase'
                action='Search'
                onChange={event => this.setState({ searchedName: event.target.value })}
              />
            </div>
          </div>
          <div class='ten wide column centered row'>
            <div className='column'>
              <div class='ui form'>
                <div class='fields'>
                  <div class='field'>
                    <div class='ui checkbox'>
                      <input type='checkbox' name='example' />
                      <label>Domain 1</label>
                    </div>
                  </div>
                  <div class='field'>
                    <div class='ui checkbox'>
                      <input type='checkbox' name='example' />
                      <label>Domain 2</label>
                    </div>
                  </div>
                  <div class='field'>
                    <div class='ui checkbox'>
                      <input type='checkbox' name='example' />
                      <label>Domain 3</label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {this.renderSearchResult()}
        </div>
      </>
    );
  }
}

const mapStateToProps = state => ({});

export default connect(mapStateToProps)(BuyName);
