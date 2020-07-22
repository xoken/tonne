var https = require('https');
var sjdecoded;
const sendcredentials = '{ "username": "", "password": ""}';
var soptions = {
  hostname: '',
    port: ,
    path: '/v1/auth',
    method: 'POST',
    protocol:'https:',
    headers:{
      "Content-type": "application/json",
      'Content-Length': Buffer.byteLength(sendcredentials)
  }
};
process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0;
if((localStorage.getItem("callsremaining") == null) || (localStorage.getItem("callsremaining") <= 3)){
  httpsauth();
}

function httpsauth(){
const sreq = https.request(soptions, (sres) => {

  console.log('STATUS: '+sres.statusCode);
  console.log('HEADERS: '+JSON.stringify(sres.headers));
  sres.setEncoding('utf8');
  sres.on('data', (chunk) => {
    console.log('BODY: '+chunk);

    try {
      sjdecoded=JSON.parse(chunk);
    } catch(e) {
      sjdecoded = {};
    }
    if (Object.keys(sjdecoded).length !== 0) {
      localStorage.setItem("sessionkey",sjdecoded.auth.sessionKey);
      localStorage.setItem("callsremaining",sjdecoded.auth.callsRemaining);
      //localStorage.setItem("callsused",sjdecoded.auth.callsUsed);
  }

  });
  sres.on('end', () => {
    console.log('No more data in response.');
  });
});

sreq.on('error', (e) => {
  console.error(e.message);
});

// Write data to request body
sreq.write(sendcredentials);
sreq.end();

}
