import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Button, Grid, Input, Divider, Icon, TextArea } from 'semantic-ui-react';

class SentMails extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  sentMailSection = () => {
    let sentmail = [
      {
        toaddress: 'aa/allpayname',
        time: '10:10',
        subject: 'welcome to',
        currentlyOpenMail: 'sent1',
      },
      { toaddress: 'aa/allpayname', time: '10:10', subject: 'Welcome', currentlyOpenMail: 'sent2' },
    ];

    return sentmail.map((mail, index) => {
      return (
        <Grid.Row
          style={{ cursor: 'pointer' }}
          onClick={() => this.props.mailOnClick(mail.currentlyOpenMail)}>
          <Grid.Column
            style={{
              boxShadow: '5px 5px 5px #fafafa',
              paddingTop: '12px',
              paddingBottom: '12px',
              marginTop: '8px',
              marginBottom: '8px',
            }}>
            <Grid>
              <Grid.Row>
                <Grid.Column computer={8} mobile={8} floated='left'>
                  <span style={{ color: 'lightGrey' }}>{mail.toaddress}</span>
                </Grid.Column>
                <Grid.Column computer={2} mobile={8} floated='right'>
                  <span style={{ color: 'lightGrey', float: 'right' }}>{mail.time}</span>
                </Grid.Column>
              </Grid.Row>
              <Grid.Row>
                <Grid.Column computer={16} floated='left'>
                  <b>{mail.subject}</b>
                </Grid.Column>
              </Grid.Row>
            </Grid>
          </Grid.Column>
        </Grid.Row>
      );
    });
  };

  render() {
    return <>{this.sentMailSection()}</>;
  }
}

SentMails.propTypes = {};

SentMails.defaultProps = {};

const mapStateToProps = state => ({});

export default withRouter(connect(mapStateToProps)(SentMails));
