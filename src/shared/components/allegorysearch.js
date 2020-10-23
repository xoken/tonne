import React from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { Segment, Grid, Button } from 'semantic-ui-react';

const electron = require('electron');
const tls = require('tls');
const utf8 = require('utf8');
process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0;
class AllegorySearch extends React.Component {
  constructor(props) {
    super(props);
    this.state = { fullResponse: '' };
  }
  options = {
    secureProtocol: 'TLSv1_1_method',
  };
  fullresp;
  jdecoded;
  sock;
  date;
  responseflag;
  name = '';
  inputTxId = '';
  inputTxIndex = 0;
  inputAmount = 0;
  inputsD = [({ opTxHash: inputTxId, opIndex: parseInt(inputTxIndex) }, parseInt(inputAmount))];
  jsonrequest =
    "{id: 17,jsonrpc: '2.0',method: 'PS_ALLEGORY_TX',params: {sessionKey: " +
    localStorage.getItem('sessionKey') +
    ',methodParams: {paymentInputs: ' +
    this.inputsD +
    ',name: ' +
    (name, False) +
    ",outputOwner: 'mzLLg4LGQVNAAPgq9wxAcQtzBQ8Uk8eeB6',outputChange: 'mzLLg4LGQVNAAPgq9wxAcQtzBQ8Uk8eeB6'}}}";

  jsonrequest1 =
    "{'id': 14, 'jsonrpc' : '2.0',  'method': 'RELAY_TX', 'params': {'sessionKey': " +
    localStorage.getItem('sessionKey') +
    ", 'methodParams': {'rawTx' : b64FsaTx}}}";

  tlssocket = () => {
    this.sock = tls.connect(9090, 'sb2.xoken.org', options, () => {
      console.log(
        'client connected and it is',
        this.sock.authorized ? 'authorized' : 'unauthorized'
      );

      process.stdin.pipe(this.sock);
      process.stdin.resume();
    });
    this.sock.setEncoding('utf8');

    this.sock.on('timeout', function () {
      console.log('Timed out');
    });

    this.sock.on('data', function (data) {
      this.splitresponse(this.sock, data);
    });

    this.sock.on('end', () => {
      console.log('server ended connection');
    });
    this.sock.on('error', function (err) {
      console.log('error connection ended');
    });

    this.sock.on('secureConnect', () => {
      this.sock.setNoDelay(true);
      this.sock.setKeepAlive(true, 0);
      session = this.sock.getSession();
      console.log(this.sock);
      //    console.log(`secureConnectListener (${this.sock.getProtocol()}), session reused: ${this.sock.isSessionReused()}, sessionId: ${session.toString('hex').substr(0, 50)}...`);
      this.makerequest(this.sock, this.jsonrequest);
    });
  };

  splitresponse = (rsock, rdata) => {
    if (this.responseflag == 0) {
      var rbytestobuffer;
      rbytestobuffer = rdata.slice(0, 4);
      const rbuf = Buffer.from(rbytestobuffer);
      firstfourbytes = rbuf.readIntBE(0, 4);
      console.log(firstfourbytes + 'integer value in first 4 bytes');
      this.fullresp = rdata.slice(4);
      this.responseflag = 1;
    } else {
      this.fullresp += rdata;
      var tempresp,
        loopbreaker = 0;

      /*  while (firstfourbytes > (parseInt(Buffer.byteLength(this.fullresp, 'utf8')))) {
    console.log("in loop");
    if (null!==(tempresp = rsock.read())) {
      this.fullresp+=tempresp;
    }
    if (loopbreaker>=10000) {
      break;
    }
    loopbreaker+=1;
    } */

      console.log(this.fullresp);

      console.log(Buffer.byteLength(this.fullresp, 'utf8') + 'bytes');
      try {
        this.jdecoded = JSON.parse(this.fullresp);
      } catch (e) {
        this.jdecoded = {};
      }
    }
    if (parseInt(Buffer.byteLength(this.fullresp, 'utf8')) >= firstfourbytes) {
      this.setState({ fullResponse: this.jdecoded });
    }
  };

  makerequest = (socket, jrequest) => {
    try {
      socket.write(jrequest, () => {
        let chunk1;
        //  chunkflag = 0;
        chunk1 = socket.read();
        while (chunk1 == null || typeof chunk1.length == 'undefined') {
          chunk1 += socket.read();
          console.log(chunk1 + '-' + chunk1.length);
          // if (chunkflag == 10000) {
          //   break;
          // }
          // chunkflag += 1;
        }
      });
      console.log(jrequest);
    } catch (error) {
      console.error(error);
    }
  };

  componentDidMount() {
    this.tlssocket();
  }

  render() {
    const { fullResponse } = this.state;
    return <>{fullResponse}</>;
  }
}
const mapStateToProps = state => ({});

export default withRouter(connect(mapStateToProps)(AllegorySearch));
