var rjdecoded;
function httpsreq(key,resourcepath,functionname){
  var roptions = {
    hostname: localStorage.getItem("hostname"),
    port: localStorage.getItem("port"),
    method: 'GET',
    protocol:'https:',
    headers:{
      'Accept' : 'application/json'
    }
  }
  var chunktemp='';
  if((localStorage.getItem("callsremaining") == null) || (localStorage.getItem("callsremaining") == 3)){
    httpsauth();
    setTimeout(httpsauth,5000);
  }
  localStorage.setItem("callsremaining",parseInt(localStorage.getItem("callsremaining"),10)-1);
roptions.headers.Authorization = key;
roptions.path = resourcepath;
const rreq = https.request(roptions, (rres) => {
    console.log(roptions);
    console.log('STATUS: '+rres.statusCode);
    console.log('HEADERS: '+JSON.stringify(rres.headers));
    if(parseInt(rres.statusCode,10)==404){
      searchresultsmessage();
    }
    rres.setEncoding('utf8');
    rres.on('data', (chunk) => {
      chunktemp += chunk;
      try {
        rjdecoded=JSON.parse(chunktemp);
        console.log(chunktemp);
      } catch(e) {
        rjdecoded = {};
      }

    if (Object.keys(rjdecoded).length !== 0) {
      window[functionname]();
    }

    });
    rres.on('end', () => {
      console.log('No more data in response.');
    });
  });

  rreq.on('error', (e) => {
    console.error(e.message);
  });
  rreq.end();

}
