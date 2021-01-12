import React from 'react';
import { connect } from 'react-redux';
import { satoshiToBSV } from '../../shared/utils';
import { Grid } from 'semantic-ui-react';
import { allegory } from 'client-sdk';

class RenderOutput extends React.Component {
  constructor(props) {
    super(props);
    this.state = { showEmbedData: false };
  }

  toggleEmbedDataVisiblity = () => {
    this.setState({
      showEmbedData: !this.state.showEmbedData,
    });
  };

  renderOutput() {
    const { addressStyle, address, script, title } = this.props;
    if (address) {
      return (
        <p className='monospace'>
          <span className={addressStyle} title={title}>
            {address}
          </span>
        </p>
      );
    } else if (script && script.startsWith('006a0f416c6c65676f72792f416c6c506179')) {
      return (
        <p className='monospace'>
          <span
            className={`${addressStyle} embed-data`}
            title={title}
            onClick={this.toggleEmbedDataVisiblity}>
            OP_RETURN
          </span>
        </p>
      );
    }
    return null;
  }

  renderEmbedData() {
    const { addressStyle, script, title } = this.props;
    const { showEmbedData } = this.state;

    if (showEmbedData) {
      const allegoryData = allegory.decodeCBORData(script);
      const allegoryJSON = allegory.getAllegoryType(allegoryData);
      return (
        <Grid.Row>
          <Grid.Column width='16'>
            <p className={`monospace ${addressStyle} word-wrap embed-data-json`} title={title}>
              {JSON.stringify(allegoryJSON)}
            </p>
          </Grid.Column>
        </Grid.Row>
      );
    }
    return null;
  }

  render() {
    const { key, valueStyle, value } = this.props;
    return (
      <Grid key={key}>
        <Grid.Row>
          <Grid.Column width='10'>{this.renderOutput()}</Grid.Column>
          <Grid.Column width='6' textAlign='right'>
            <p className='monospace'>
              <span className={valueStyle}>{satoshiToBSV(value)}</span>
            </p>
          </Grid.Column>
        </Grid.Row>
        {this.renderEmbedData()}
      </Grid>
    );
  }
}

RenderOutput.propTypes = {};

RenderOutput.defaultProps = {};

const mapStateToProps = state => ({});

export default connect(mapStateToProps)(RenderOutput);
