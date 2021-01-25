import React from 'react';
import { Segment, Grid, Button, Icon, Header } from 'semantic-ui-react';

export default function Downloads() {
  return (
    <>
      <Header as='h3' className='purplefontcolor'>
        Download Tonne Desktop App
      </Header>
      <Segment placeholder style={{ height: '93%' }}>
        <Grid centered columns={3} verticalAlign='middle' style={{ height: '100%' }}>
          <Grid.Row>
            <Grid.Column textAlign='center'>
              <Header icon className='purplefontcolor'>
                <Icon name='apple' />
              </Header>

              <Button className='coral'>Download</Button>
            </Grid.Column>
            <Grid.Column textAlign='center'>
              <Header icon className='purplefontcolor'>
                <Icon name='windows' />
              </Header>
              <Button className='coral'>Download</Button>
            </Grid.Column>
            <Grid.Column textAlign='center'>
              <Header icon className='purplefontcolor'>
                <Icon name='linux' />
              </Header>
              <Button className='coral'>Download</Button>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Segment>
    </>
  );
}
