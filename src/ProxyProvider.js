const tls = require('tls');

class ProxyProvider {
  sock;

  init(host = '127.0.0.1', port = 9090, request, onResponse) {
    const options = {
      rejectUnauthorized: false,
      secureProtocol: 'TLSv1_1_method',
    };
    this.sock = tls.connect(port, host, options, () => {
      console.log(
        'TLS client connected and it is',
        this.sock.authorized ? 'authorized' : 'unauthorized'
      );
      process.stdin.pipe(this.sock);
      process.stdin.resume();
    });
    this.sock.setEncoding('utf8');

    this.sock.on('timeout', function () {
      console.log('TLS client timed out');
    });

    this.sock.on('data', data => {
      console.log('on Data');
      debugger;
      // const response = this._receiveResponse(data);
      // onResponse(response);
    });

    this.sock.on('end', () => {
      console.log('TLS server ended connection');
    });

    this.sock.on('error', error => {
      console.log(error);
    });

    this.sock.on('secureConnect', () => {
      console.log('on secureconnect');
      this.sock.setNoDelay(true);
      this.sock.setKeepAlive(true, 0);
      this._sendRequest(request);
    });
  }

  /*_receiveResponse(data: any) {
    let responseFlag = 0;
    let response: string;
    let decoded;
    debugger;
    if (responseFlag === 0) {
      const rbytestobuffer = data.slice(0, 4);
      const rbuf = Buffer.from(rbytestobuffer);
      const firstfourbytes = rbuf.readIntBE(0, 4);
      console.log(firstfourbytes + 'integer value in first 4 bytes');
      response = data.slice(4);
      responseFlag = 1;
    } else {
      response = data;
      // let tempresp,
      //   loopbreaker = 0;

      // while (firstfourbytes > (parseInt(Buffer.byteLength(this.fullresp, 'utf8')))) {
      //   console.log("in loop");
      //   if (null!==(tempresp = sock.read())) {
      //     response+=tempresp;
      //   }
      //   if (loopbreaker >= 10000) {
      //     break;
      //   }
      //   loopbreaker+=1;
      // }

      console.log(response);
      console.log(Buffer.byteLength(response, 'utf8') + 'bytes');

      try {
        decoded = JSON.parse(response);
      } catch (error) {
        decoded = {};
        console.log(error);
      }
    }

    // if (parseInt(Buffer.byteLength(response, 'utf8')) >= firstfourbytes) {
    //   return { response: decoded };
    // }
    console.log(decoded);
    return { response: null };
  }*/

  _sendRequest(request) {
    try {
      const requestBuffer = Buffer.from(request);
      const length = requestBuffer.length;
      const lengthBuffer = Buffer.allocUnsafe(4);
      lengthBuffer.writeIntBE(length, 0, 4);
      const buffer = Buffer.concat([lengthBuffer, requestBuffer]);
      this.sock.write(buffer);
    } catch (error) {
      console.error(error);
    }
  }
}

export default new ProxyProvider();
