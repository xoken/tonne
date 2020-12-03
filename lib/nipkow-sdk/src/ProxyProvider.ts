const app = window.require('electron').remote;
const tls = app.require('tls');
const process = app.require('process');

class ProxyProvider {
  sock!: any;
  responseFlag = 0;

  _init(host: string, port: number, requestBuffer: Buffer) {
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

    this.sock.on('end', () => {
      console.log('TLS server ended connection');
    });

    this.sock.on('error', (error: any) => {
      console.log(error);
    });

    this.sock.on('secureConnect', () => {
      this.sock.setNoDelay(true);
      this.sock.setKeepAlive(true, 0);
      this.sock.write(requestBuffer);
    });
  }

  sendRequest(
    host = '127.0.0.1',
    port = 9090,
    request: string,
    onResponse: any
  ) {
    const requestBuffer = Buffer.from(request);
    // const length = requestBuffer.length;
    // const lengthBuffer = Buffer.allocUnsafe(4);
    // lengthBuffer.writeIntBE(length, 0, 4);
    // const buffer = Buffer.concat([lengthBuffer, requestBuffer]);
    if (this.sock) {
      try {
        this.sock.write(requestBuffer);
      } catch (error) {
        console.error(error);
      }
    } else {
      this._init(host, port, requestBuffer);
    }
    this.sock.on('data', (data: any) => {
      console.log(data);
      if (this.responseFlag === 0) {
        this.responseFlag = 1;
      } else {
        this.responseFlag = 0;
        const response = JSON.parse(data).result;
        if (response.tx) {
          onResponse({ psaTx: response.tx });
        } else {
          console.log('Error');
        }
      }
    });
  }
}

export default new ProxyProvider();
