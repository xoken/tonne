import React from 'react';
import { connect } from 'react-redux';
import { Grid } from 'semantic-ui-react';
import { utils, allegory, getPushData } from 'allegory-allpay-sdk';
import { Link } from 'react-router-dom';

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
    const { showEmbedData } = this.state;
    if (address) {
      return (
        <p className='monospace word-wrap recentTxidAddressColumn'>
          <span className={addressStyle} title={title}>
            {address}
          </span>
          <Link to={'/explorer/address/' + address} className='recentTxidAddress'>
            <span className='padding10px'>
              <i className='walletLink'></i>
            </span>
          </Link>
        </p>
      );
    } else if (script && script.startsWith('006a0f416c6c65676f72792f416c6c506179')) {
      function renderAdditionalInfo() {
        const pushData = getPushData(script);
        if (pushData.length >= 2) {
          const allegoryData = allegory.getAllegoryType(pushData[1]);
          if (allegoryData) {
            const { name, action } = allegoryData;
            if (action instanceof allegory.OwnerAction) {
              const ownerAction = action;
              if (ownerAction.registrations.length > 0) {
                if (name) {
                  return (
                    <>
                      Proxy registration : <i>{utils.codePointToName(name)}</i>{' '}
                    </>
                  );
                }
              } else {
                return (
                  <>
                    Purchase : <i>{utils.codePointToName(name)}</i>{' '}
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
                    Purchase: <i>{namePurchased}</i>{' '}
                  </>
                );
              }
            }
          }
        }
      }
      return (
        <p className='monospace'>
          <span
            className={`${addressStyle} embed-data word-wrap`}
            title={title}
            onClick={this.toggleEmbedDataVisiblity}>
            {`OP_RETURN `}
            {renderAdditionalInfo()}
            <span style={{ color: 'black' }}>
              {showEmbedData ? <span>&#9660;</span> : <span>&#9654;</span>}
            </span>
          </span>
        </p>
      );
    } else if (script) {
      return (
        <p className='monospace'>
          <span className={`${addressStyle} embed-data word-wrap`} title={title}>
            {script}
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
      const pushData = getPushData(script);
      if (pushData.length >= 2) {
        const allegoryData = allegory.getAllegoryType(pushData[1]);
        if (allegoryData) {
          return (
            <Grid.Row>
              <Grid.Column width='16'>
                <pre className={`monospace embed-data-json ${addressStyle}`} title={title}>
                  {JSON.stringify(allegoryData, null, 2)}
                </pre>
              </Grid.Column>
            </Grid.Row>
          );
        }
      }
    }
    return null;
  }

  render() {
    const { key, valueStyle, value } = this.props;
    return (
      <Grid key={key}>
        <Grid.Row>
          <Grid.Column computer='12' tablet='11' mobile='11'>
            {this.renderOutput()}
          </Grid.Column>
          <Grid.Column computer='4' tablet='5' mobile='5' textAlign='right'>
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
