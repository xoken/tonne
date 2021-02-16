import React from 'react';
import { connect } from 'react-redux';
import { Grid } from 'semantic-ui-react';
import { utils, allegory } from 'allegory-allpay-sdk';
import { Link } from 'react-router-dom';
import images from '../../shared/images';

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
          <span className={'recentTxidAddressColumn ' + addressStyle} title={title}>
            <span className='recentTxidAddress'>{address}</span>
            <Link to={'/explorer/address/' + address}>
              <span className='padding5px'>
                <i class='walletLink'></i>
              </span>
            </Link>
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
                <>
                  {' '}
                  Proxy registration: <i>{utils.codePointToName(name)}</i>{' '}
                </>
              );
            }
          } else {
            return (
              <>
                {' '}
                Purchase: <i>{utils.codePointToName(name)}</i>{' '}
              </>
            );
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
              <>
                {' '}
                Purchase: <i>{namePurchased}</i>{' '}
              </>
            );
          }
        }
      }
      return (
        <p className='monospace paddingLeftRight14px'>
          <span
            className={`${addressStyle} embed-data word-wrap`}
            title={title}
            onClick={this.toggleEmbedDataVisiblity}>
            OP_RETURN{renderAdditionalInfo()}
            <span style={{ color: 'black' }}>&#9660;</span>
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
          <Grid.Column width='11'>{this.renderOutput()}</Grid.Column>
          <Grid.Column width='5' textAlign='right'>
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
