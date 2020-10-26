import React from 'react';
import { connect } from 'react-redux';
import { Button, Form, Modal } from 'semantic-ui-react';
import * as authActions from '../../auth/authActions';

class BuyAllpayName extends React.Component {
  onSearch = async () => {};

  render() {
    return (
      <>
        <Modal.Header>Buy Allpay name</Modal.Header>
        <Modal.Content>
          <Modal.Description>
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
              </Form.Group>
            </Form>
          </Modal.Description>
        </Modal.Content>
      </>
    );
  }
}

const mapStateToProps = state => ({});

export default connect(mapStateToProps)(BuyAllpayName);
