import React from 'react';
import { List } from 'semantic-ui-react';

export default class Profiles extends React.Component {
  render() {
    const { profiles, onSelect } = this.props;
    return (
      <>
        {profiles && profiles.length > 0 ? (
          <List selection verticalAlign='middle'>
            {profiles.map((profile, index) => {
              const { screenName } = profile;
              return (
                <List.Item
                  key={index}
                  onClick={onSelect(screenName)}
                  className='ui coralinverted button custommargin'>
                  <List.Content>
                    <List.Header>{screenName}</List.Header>
                  </List.Content>
                </List.Item>
              );
            })}
          </List>
        ) : (
          <p className='purplefontcolor'>You don't have any profile.</p>
        )}
      </>
    );
  }
}
