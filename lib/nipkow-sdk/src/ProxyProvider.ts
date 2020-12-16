const app = window.require('electron').remote;
const tls = app.require('tls');
const process = app.require('process');

class ProxyProvider {
  sock!: any;
  responseFlag = 0;

  async _init(host: string, port: number, requestBuffer: Buffer) {
    return new Promise((resolve, reject) => {
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
        reject();
      });

      this.sock.on('secureConnect', () => {
        this.sock.setNoDelay(true);
        this.sock.setKeepAlive(true, 0);
        this.sock.write(requestBuffer);
        resolve(true);
      });
    });
  }

  async sendRequest(host: string, port: number, request: string) {
    console.log(request);
    const requestBuffer = Buffer.from(request);
    // const length = requestBuffer.length;
    // const lengthBuffer = Buffer.allocUnsafe(4);
    // lengthBuffer.writeIntBE(length, 0, 4);
    // const buffer = Buffer.concat([lengthBuffer, requestBuffer]);
    if (this.sock) {
      this.sock.write(requestBuffer);
    } else {
      await this._init(host, port, requestBuffer);
    }
    return new Promise((resolve, reject) => {
      this.sock.on('data', (data: any) => {
        console.log(data);
        if (this.responseFlag === 0) {
          this.responseFlag = 1;
        } else {
          this.responseFlag = 0;
          // const response = JSON.parse(data);
          resolve(data);
        }
      });
    });
  }
}

export default new ProxyProvider();
