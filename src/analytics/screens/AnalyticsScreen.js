import React from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { Grid, Form, Segment, Checkbox } from 'semantic-ui-react';

class AnalyticsScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      protocolName: '',
      prop1: '',
      prop2: '',
      fromBlockHeight: '',
      toBlockHeight: '',
      fromDate: '',
      toDate: '',
      dateParam: false,
      day: false,
      month: false,
      year: false,
      feesParam: false,
      feesCount: false,
      feesAverage: false,
      feesSum: false,
      feesListAll: false,
      bytesParam: false,
      bytesCount: false,
      bytesAverage: false,
      bytesSum: false,
      bytesListAll: false,
      countParam: false,
      countCount: false,
      countAverage: false,
      countSum: false,
      countListAll: false,
      filterWith: 'Block Height',
    };
  }

  onCountParamChange = event => {
    const { countParam } = this.state;
    if (countParam) {
      this.setState({
        countCount: false,
        countAverage: false,
        countSum: false,
        countListAll: false,
      });
    } else {
      this.setState({ countCount: true });
    }
    this.setState({
      countParam: !countParam,
    });
  };

  onDateParamChange = event => {
    const { dateParam } = this.state;
    if (dateParam) {
      this.setState({ day: false, month: false, year: false });
    } else {
      this.setState({ day: true });
    }
    this.setState({ dateParam: !dateParam });
  };

  onBytesParamChange = event => {
    const { bytesParam } = this.state;
    if (bytesParam) {
      this.setState({
        bytesCount: false,
        bytesAverage: false,
        bytesSum: false,
        bytesListAll: false,
      });
    } else {
      this.setState({ bytesCount: true });
    }
    this.setState({
      bytesParam: !bytesParam,
    });
  };
  onFeesParamChange = event => {
    const { feesParam } = this.state;
    if (feesParam) {
      this.setState({ feesCount: false, feesAverage: false, feesSum: false, feesListAll: false });
    } else {
      this.setState({ feesCount: true });
    }
    this.setState({
      feesParam: !feesParam,
    });
  };

  onFilterWithChange = event => {
    const { filterWith } = this.state;
    if (filterWith === 'Block Height') {
      this.setState({ filterWith: 'Date' });
    } else {
      this.setState({ filterWith: 'Block Height' });
    }
  };

  renderFilterWithBlockDate = () => {
    const { filterWith, fromBlockHeight, toBlockHeight, fromDate, toDate } = this.state;
    if (filterWith === 'Block Height') {
      return (
        <Grid>
          <Grid.Row centered columns={2}>
            <Grid.Column>
              <label>From Block Height</label>
              <input
                placeholder='0'
                value={fromBlockHeight}
                onChange={event => this.setState({ fromBlockHeight: event.target.value })}
              />
            </Grid.Column>
            <Grid.Column>
              <label>To Block Height</label>
              <input
                placeholder='60000'
                value={toBlockHeight}
                onChange={event => this.setState({ toBlockHeight: event.target.value })}
              />
            </Grid.Column>
          </Grid.Row>
        </Grid>
      );
    } else {
      return (
        <Grid>
          <Grid.Row centered columns={2}>
            <Grid.Column>
              <label>From Date</label>
              <input
                type='date'
                value={fromDate}
                onChange={event => this.setState({ fromDate: event.target.value })}
              />
            </Grid.Column>
            <Grid.Column>
              <label>To Date</label>
              <input
                type='date'
                value={toDate}
                onChange={event => this.setState({ toDate: event.target.value })}
              />
            </Grid.Column>
          </Grid.Row>
        </Grid>
      );
    }
  };

  generateJsonQuery = () => {
    const {
      protocolName,
      prop1,
      prop2,
      fromBlockHeight,
      toBlockHeight,
      fromDate,
      toDate,
      dateParam,
      feesParam,
      bytesParam,
      countParam,
      countSum,
      countAverage,
      countCount,
      countListAll,
      feesSum,
      feesCount,
      feesAverage,
      feesListAll,
      bytesSum,
      bytesCount,
      bytesAverage,
      bytesListAll,
      day,
      month,
      year,
      filterWith,
    } = this.state;
    var tempWhere = '{ "where":{ "$and": { ';
    var tempReturn = ',"return":{"$fields":{';
    if (protocolName) {
      if (protocolName && !prop1 && !prop2) {
        tempWhere += '"p.name":{"$eq":["' + protocolName + '"]}}}';
      } else if (protocolName && prop1 && !prop2) {
        tempWhere += '"p.name":{"$eq":["' + protocolName + '","' + prop1 + '"]}}}';
      } else {
        tempWhere += '"p.name":{"$eq":["' + protocolName + '","' + prop1 + '","' + prop2 + '"]}}}';
      }
    }
    if (filterWith === 'Block Height') {
      tempWhere +=
        ',{"b.height" :{"$gte": ' + fromBlockHeight + ', "$lte" : ' + toBlockHeight + '}';
    } else {
      tempWhere +=
        ',{"b.timestamp":{"$gte":' +
        new Date(fromDate).getTime() +
        ',"$lte":' +
        new Date(toDate).getTime() +
        '}';
    }
    tempWhere += '}}}';
    var queryWhere = tempWhere;

    var queryReturn =
      ',"return":{"$fields":{"b.height":"","b.day":"","rel.fees":"avg","rel.bytes":"avg"}}';
    var queryOnTo =
      ',"on":{"from":{"node":"protocol","alias":"p"},"to":{"node":"block","alias":"b"}';
    var queryVia = ',"via":{ "relationship":"PRESENT_IN", "alias":"rel" }}}';
  };

  render() {
    const {
      protocolName,
      prop1,
      prop2,
      fromBlockHeight,
      toBlockHeight,
      fromDate,
      toDate,
      dateParam,
      feesParam,
      bytesParam,
      countParam,
      countSum,
      countAverage,
      countCount,
      countListAll,
      feesSum,
      feesCount,
      feesAverage,
      feesListAll,
      bytesSum,
      bytesCount,
      bytesAverage,
      bytesListAll,
      day,
      month,
      year,
      filterWith,
    } = this.state;
    console.log(new Date(fromDate).getTime());
    return (
      <Segment>
        <Grid centered>
          <Grid.Row centered columns={2}>
            <Grid.Column>
              <Form>
                <h4 className='ui dividing header'>Nipkow Analytics</h4>
                <Form.Field>
                  <label>Protocol Name</label>
                  <input
                    placeholder='xyz'
                    value={protocolName}
                    onChange={event => this.setState({ protocolName: event.target.value })}
                  />
                </Form.Field>
                <Form.Field>
                  <label>Sub Protocol (1)'s' Name</label>
                  <input
                    placeholder='xyz'
                    value={prop1}
                    onChange={event => this.setState({ prop1: event.target.value })}
                  />
                </Form.Field>
                <Form.Field>
                  <label>Sub Protocol (2)'s' Name</label>
                  <input
                    placeholder='xyz'
                    value={prop2}
                    onChange={event => this.setState({ prop2: event.target.value })}
                  />
                </Form.Field>

                <Form.Field>
                  <Checkbox
                    toggle
                    label={`Filter with ${filterWith}`}
                    onChange={this.onFilterWithChange}
                    checked={filterWith === 'Block Height' ? true : false}
                  />
                </Form.Field>
                <Form.Field>{this.renderFilterWithBlockDate()}</Form.Field>
                <hr />
                <h5>Select Parameters you wish to see</h5>
                <Form.Field>
                  <Grid>
                    <Grid.Row centered columns={2}>
                      <Grid.Column width={4}>
                        <Checkbox toggle onChange={this.onDateParamChange} checked={dateParam} />
                      </Grid.Column>
                      <Grid.Column width={12}>
                        <Checkbox
                          label='Day'
                          onChange={event => this.setState({ day: !day })}
                          checked={day}
                          className='analyticsdateparamcheckbox'
                          disabled={dateParam ? false : true}
                        />
                        <Checkbox
                          label='Month'
                          onChange={event => this.setState({ month: !month })}
                          checked={month}
                          className='analyticsdateparamcheckbox'
                          disabled={dateParam ? false : true}
                        />
                        <Checkbox
                          label='Year'
                          onChange={event => this.setState({ year: !year })}
                          checked={year}
                          className='analyticsdateparamcheckbox'
                          disabled={dateParam ? false : true}
                        />
                      </Grid.Column>
                    </Grid.Row>
                  </Grid>
                </Form.Field>

                <Form.Field>
                  <Grid>
                    <Grid.Row centered columns={2}>
                      <Grid.Column width={4}>
                        <Checkbox
                          toggle
                          onChange={this.onFeesParamChange}
                          checked={feesParam}
                          label='Fees'
                        />
                      </Grid.Column>
                      <Grid.Column width={12}>
                        <Checkbox
                          label='Count'
                          onChange={event => this.setState({ feesCount: !feesCount })}
                          checked={feesCount}
                          className='analyticsdateparamcheckbox'
                          disabled={feesParam ? false : true}
                        />
                        <Checkbox
                          label='Average'
                          onChange={event => this.setState({ feesAverage: !feesAverage })}
                          checked={feesAverage}
                          className='analyticsdateparamcheckbox'
                          disabled={feesParam ? false : true}
                        />
                        <Checkbox
                          label='Sum'
                          onChange={event => this.setState({ feesSum: !feesSum })}
                          checked={feesSum}
                          className='analyticsdateparamcheckbox'
                          disabled={feesParam ? false : true}
                        />
                        <Checkbox
                          label='List all'
                          onChange={event => this.setState({ feesListAll: !feesListAll })}
                          checked={feesListAll}
                          className='analyticsdateparamcheckbox'
                          disabled={feesParam ? false : true}
                        />
                      </Grid.Column>
                    </Grid.Row>
                  </Grid>
                </Form.Field>

                <Form.Field>
                  <Grid>
                    <Grid.Row centered columns={2}>
                      <Grid.Column width={4}>
                        <Checkbox
                          toggle
                          onChange={this.onBytesParamChange}
                          checked={bytesParam}
                          label='Bytes'
                        />
                      </Grid.Column>
                      <Grid.Column width={12}>
                        <Checkbox
                          label='Count'
                          onChange={event => this.setState({ bytesCount: !bytesCount })}
                          checked={bytesCount}
                          className='analyticsdateparamcheckbox'
                          disabled={bytesParam ? false : true}
                        />
                        <Checkbox
                          label='Average'
                          onChange={event => this.setState({ bytesAverage: !bytesAverage })}
                          checked={bytesAverage}
                          className='analyticsdateparamcheckbox'
                          disabled={bytesParam ? false : true}
                        />
                        <Checkbox
                          label='Sum'
                          onChange={event => this.setState({ bytesSum: !bytesSum })}
                          checked={bytesSum}
                          className='analyticsdateparamcheckbox'
                          disabled={bytesParam ? false : true}
                        />
                        <Checkbox
                          label='List all'
                          onChange={event => this.setState({ bytesListAll: !bytesListAll })}
                          checked={bytesListAll}
                          className='analyticsdateparamcheckbox'
                          disabled={bytesParam ? false : true}
                        />
                      </Grid.Column>
                    </Grid.Row>
                  </Grid>
                </Form.Field>

                <Form.Field>
                  <Grid>
                    <Grid.Row centered columns={2}>
                      <Grid.Column width={4}>
                        <Checkbox
                          toggle
                          onChange={this.onCountParamChange}
                          checked={countParam}
                          label='Count'
                        />
                      </Grid.Column>
                      <Grid.Column width={12}>
                        <Checkbox
                          label='Count'
                          onChange={event => this.setState({ countCount: !countCount })}
                          checked={countCount}
                          className='analyticsdateparamcheckbox'
                          disabled={countParam ? false : true}
                        />
                        <Checkbox
                          label='Average'
                          onChange={event => this.setState({ countAverage: !countAverage })}
                          checked={countAverage}
                          className='analyticsdateparamcheckbox'
                          disabled={countParam ? false : true}
                        />
                        <Checkbox
                          label='Sum'
                          onChange={event => this.setState({ countSum: !countSum })}
                          checked={countSum}
                          className='analyticsdateparamcheckbox'
                          disabled={countParam ? false : true}
                        />
                        <Checkbox
                          label='List all'
                          onChange={event => this.setState({ countListAll: !countListAll })}
                          checked={countListAll}
                          className='analyticsdateparamcheckbox'
                          disabled={countParam ? false : true}
                        />
                      </Grid.Column>
                    </Grid.Row>
                  </Grid>
                </Form.Field>
              </Form>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Segment>
    );
  }
}

const mapStateToProps = state => ({});

export default withRouter(connect(mapStateToProps)(AnalyticsScreen));
