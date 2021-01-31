import React from 'react';
import { Segment, Grid, Button, Icon, Header } from 'semantic-ui-react';

export default function Downloads() {
  return (
    <>
      <Grid verticalAlign='middle' style={{ height: '100%' }}>
        <Grid.Row>
          <Grid.Column>
            <Header as='h3' className='purplefontcolor' textAlign='center'>
              Download Tonne Desktop App
            </Header>
            <Segment placeholder>
              <Grid centered stackable columns={3}>
                <Grid.Row>
                  <Grid.Column textAlign='center'>
                    <Header icon className='purplefontcolor'>
                      <Icon name='apple' />

                      <Button className='coral'>Download</Button>
                    </Header>
                  </Grid.Column>
                  <Grid.Column textAlign='center'>
                    <Header icon className='purplefontcolor'>
                      <Icon name='windows' />
                      <Button className='coral'>Download</Button>
                    </Header>
                  </Grid.Column>
                  <Grid.Column textAlign='center'>
                    <Header icon className='purplefontcolor'>
                      <Icon name='linux' />

                      <Button className='coral'>Download</Button>
                    </Header>
                  </Grid.Column>
                </Grid.Row>
              </Grid>
            </Segment>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </>
  );
}
