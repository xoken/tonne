import React from 'react';
import { connect } from 'react-redux';
import { Grid } from 'semantic-ui-react';
import { utils, allegory } from 'allegory-allpay-sdk';

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
        <p className='monospace word-wrap'>
          <span className={addressStyle} title={title}>
            {address}
          </span>
        </p>
      );
    } else if (script && script.startsWith('006a0f416c6c65676f72792f416c6c506179')) {
      function renderAdditionalInfo() {
        const allegoryData = allegory.decodeCBORData(script);
        const allegoryJSON = allegory.getAllegoryType(allegoryData);
        const { name, action } = allegoryJSON;
        if (action instanceof allegory.OwnerAction) {
          const ownerAction = action;
          if (ownerAction.oProxyProviders.length > 0) {
            if (name) {
              return (
                <span>
                  {' '}
                  Proxy registration: <i>{utils.codePointToName(name)}</i>
                </span>
              );
            }
          }
        } else if (action instanceof allegory.ProducerAction) {
          const producerAction = action;
          if (producerAction.extensions.length > 0) {
            const producerExtensions = producerAction.extensions.map(extension => {
              return {
                codePoint: extension.codePoint,
              };
            });
            const producerCodePoints = producerExtensions.map(({ codePoint }) => codePoint);
            const namePurchased = utils.codePointToName([...name, ...producerCodePoints]);
            return (
              <span>
                {' '}
                Purchase: <i>{namePurchased}</i>
              </span>
            );
          }
        }
      }
      return (
        <p className='monospace'>
          <span
            className={`${addressStyle} embed-data`}
            title={title}
            onClick={this.toggleEmbedDataVisiblity}>
            OP_RETURN
          </span>
          {renderAdditionalInfo()}
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
            <pre className={`monospace embed-data-json ${addressStyle}`} title={title}>
              {JSON.stringify(allegoryJSON, null, 2)}
            </pre>
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
              <span className={valueStyle}>{utils.satoshiToBSV(value)}</span>
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
